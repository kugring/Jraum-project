package com.kugring.back.service.implement;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.kugring.back.common.BiblePeople;
import com.kugring.back.dto.request.order.DeleteOrderRequestDto;
import com.kugring.back.dto.request.order.PatchOrderApproveRequestDto;
import com.kugring.back.dto.request.order.PatchOrderRefundCancelRequestDto;
import com.kugring.back.dto.request.order.PatchOrderRefundRequestDto;
import com.kugring.back.dto.request.order.PostOrderCashRequestDto;
import com.kugring.back.dto.request.order.PostOrderDetailOptionRequestDto;
import com.kugring.back.dto.request.order.PostOrderDetailRequestDto;
import com.kugring.back.dto.request.order.PostPointOrderRequestDto;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.dto.response.auth.PinCheckResponseDto;
import com.kugring.back.dto.response.order.DeleteOrderResponseDto;
import com.kugring.back.dto.response.order.GetOrderListResponseDto;
import com.kugring.back.dto.response.order.GetOrderManagementResponseDto;
import com.kugring.back.dto.response.order.PatchOrderApproveResponseDto;
import com.kugring.back.dto.response.order.PatchOrderRefundCancelResponseDto;
import com.kugring.back.dto.response.order.PatchOrderRefundResponseDto;
import com.kugring.back.dto.response.order.PostOrderCashResponseDto;
import com.kugring.back.dto.response.order.PostPointOrderResponseDto;
import com.kugring.back.entity.User;
import com.kugring.back.entity.Menu;
import com.kugring.back.entity.Order;
import com.kugring.back.entity.MenuOption;
import com.kugring.back.entity.OrderDetail;
import com.kugring.back.entity.OrderDetailOption;
import com.kugring.back.repository.MenuRepository;
import com.kugring.back.repository.OptionRepository;
import com.kugring.back.repository.OrderRepository;
import com.kugring.back.repository.StaffOneFreeOrderRepository;
import com.kugring.back.repository.UserRepository;
import com.kugring.back.repository.resultSet.GetOrderListResultSet;
import com.kugring.back.repository.resultSet.GetOrderManageMentResultSet;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import com.kugring.back.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImplement implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final MenuRepository menuRepository;
    private final OptionRepository optionRepository;
    private final StaffOneFreeOrderRepository staffOneFreeOrderRepository;

    public boolean hasUserOrderThisWeek(User user) {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(WeekFields.of(Locale.getDefault()).dayOfWeek(), 1);
        LocalDate endOfWeek = startOfWeek.plusDays(7);

        LocalDateTime startDateTime = startOfWeek.atStartOfDay();
        LocalDateTime endDateTime = endOfWeek.atStartOfDay();

        return staffOneFreeOrderRepository.existsByUserAndCreatedAtBetween(user, startDateTime, endDateTime);
    }

    @Override
    @Transactional
    public ResponseEntity<? super PostPointOrderResponseDto> postPointOrderList(String userId,
            PostPointOrderRequestDto dto) {

        GetOrderManageMentResultSet result = null;
        int balance = 0;
        long waitingNum = 0;

        try {

            // 주문요청자의 회원 존재 여부 확인
            User user = userRepository.findByUserId(userId);


            boolean existFreeOrder = hasUserOrderThisWeek(user);
            System.out.println("existFreeOrder: "+ existFreeOrder);

            // 메뉴 ID들 추출 후에 모두 존재하는지 확인
            List<Long> menuIds = dto.getOrderList().stream().map(PostOrderDetailRequestDto::getMenuId)
                    .collect(Collectors.toList());
            if (!menuRepository.existsByMenuIdIn(menuIds))
                return PostPointOrderResponseDto.noExistMenu();

            // 옵션 ID들 추출 후에 모두 존재하는지 확인
            List<Long> optionIds = dto.getOrderList().stream().flatMap(orderDetail -> orderDetail.getOptions().stream())
                    .map(PostOrderDetailOptionRequestDto::getOptionId).collect(Collectors.toList());
            if (!optionRepository.existsByOptionIdIn(optionIds))
                return PostPointOrderResponseDto.noExistOption();

            // 주문 대기중인 팀 갯수 확인
            waitingNum = orderRepository.countByStatus("대기");

            // Order 생성
            Order order = new Order();

            // OrderDetail 리스트 생성 및 추가
            List<OrderDetail> orderDetails = dto.getOrderList().stream().map(detailDto -> {
                // 등록할 아이템 생성
                OrderDetail orderDetail = new OrderDetail();
                // OrderList와 OrderItem 연결
                orderDetail.setOrder(order);
                // 아이템 메뉴 Entity 가져오기
                Menu Menu = menuRepository.findByMenuId(detailDto.getMenuId());
                // 아이템 메뉴 Set
                orderDetail.setMenu(Menu);
                // 아이템 수량
                orderDetail.setQuantity(detailDto.getQuantity());
                // OrderDetailOption 리스트 생성 및 추가
                List<OrderDetailOption> orderDetailOptions = detailDto.getOptions().stream().map(optionDto -> {
                    // 등록할 아이템의 옵션 생성
                    OrderDetailOption orderDetailOption = new OrderDetailOption();
                    // OrderDetail 과 OrderDetailOption 연결
                    orderDetailOption.setOrderDetail(orderDetail);
                    // 옵션 Entity 가져오기
                    MenuOption option = optionRepository.findByOptionId(optionDto.getOptionId());
                    // 옵션 코드 Set
                    orderDetailOption.setMenuOption(option);
                    // 옵션 수량 Set
                    orderDetailOption.setQuantity(optionDto.getQuantity());
                    // 가공된 옵션 데이터 반환
                    return orderDetailOption;
                }).collect(Collectors.toList());
                // 가공된 옵션 리스트를 아이템의 필드에 Set
                orderDetail.setOptions(orderDetailOptions);
                return orderDetail;
            }).collect(Collectors.toList());

            int totalPrice = orderDetails.stream()
                    .mapToInt(orderDetail -> {
                        int menuPrice = orderDetail.getMenu().getPrice();
                        int itemQuantity = orderDetail.getQuantity();

                        // 기본 메뉴 가격에 옵션 가격의 총합을 추가합니다.
                        int optionTotalPrice = orderDetail.getOptions().stream()
                                .mapToInt(option -> option.getQuantity() * option.getMenuOption().getPrice())
                                .sum();

                        return (menuPrice + optionTotalPrice) * itemQuantity;
                    }).sum();

            // 잔액 확인
            balance = user.getPoint() - totalPrice;

            // 포인트가 음수가 되지 않도록 설정
            if (balance < 0)
                return PostPointOrderResponseDto.insufficientBlance();

            // 잔여금 저장
            user.setPoint(balance);

            // 주문_아이템 담기
            order.setOrderDetails(orderDetails);
            // 주문자 등록
            order.setUser(user);
            // 주문 날짜 등록
            order.setCreatedAt(LocalDateTime.now());
            // 주문 상태 등록
            order.setStatus("대기");
            // 주문 결제 방법 등록
            order.setPayMethod("포인트결제");

            // 저장
            userRepository.save(user);
            Order newOrder = orderRepository.save(order);
            result = orderRepository.findOrderDetailsByOrderId(newOrder.getOrderId());

        } catch (Exception exception) {
            exception.printStackTrace();
            ResponseDto.databaseError();
        }

        return PostPointOrderResponseDto.success(balance, waitingNum, result);

    }

    @Override
    public ResponseEntity<? super PostOrderCashResponseDto> postCashOrderList(PostOrderCashRequestDto dto) {

        GetOrderManageMentResultSet result = null;
        String userId = null;
        long waitingNum = 0;

        try {

            String[] excludeNames = orderRepository.findUserNamesByUnapprovedAndCashPayment();
            String remainingBiblePeople = BiblePeople.getRandomBiblePerson(excludeNames);

            if (remainingBiblePeople != "다 소모됨") {
                userId = remainingBiblePeople;
            } else {
                // long number = orderRepository.countByStatus("미승인");
                // biblePerson = String.valueOf(number);
                userId = "솔로몬";
            }

            // 주문요청자의 회원 존재 여부 확인
            User user = userRepository.findByUserId(userId);

            // 메뉴 ID들 추출 후에 모두 존재하는지 확인
            List<Long> menuIds = dto.getOrderList().stream().map(PostOrderDetailRequestDto::getMenuId)
                    .collect(Collectors.toList());
            if (!menuRepository.existsByMenuIdIn(menuIds))
                return PostPointOrderResponseDto.noExistMenu();

            // 옵션 ID들 추출 후에 모두 존재하는지 확인
            List<Long> optionIds = dto.getOrderList().stream().flatMap(orderDetail -> orderDetail.getOptions().stream())
                    .map(PostOrderDetailOptionRequestDto::getOptionId).collect(Collectors.toList());
            if (!optionRepository.existsByOptionIdIn(optionIds))
                return PostPointOrderResponseDto.noExistOption();

            // 주문 대기중인 팀 갯수 확인
            waitingNum = orderRepository.countByStatus("대기");

            // Order 생성
            Order order = new Order();

            // OrderDetail 리스트 생성 및 추가
            List<OrderDetail> orderDetails = dto.getOrderList().stream().map(detailDto -> {
                // 등록할 아이템 생성
                OrderDetail orderDetail = new OrderDetail();
                // OrderList와 OrderItem 연결
                orderDetail.setOrder(order);
                // 아이템 메뉴 Entity 가져오기
                Menu Menu = menuRepository.findByMenuId(detailDto.getMenuId());
                // 아이템 메뉴 Set
                orderDetail.setMenu(Menu);
                // 아이템 수량
                orderDetail.setQuantity(detailDto.getQuantity());
                // OrderDetailOption 리스트 생성 및 추가
                List<OrderDetailOption> orderDetailOptions = detailDto.getOptions().stream().map(optionDto -> {
                    // 등록할 아이템의 옵션 생성
                    OrderDetailOption orderDetailOption = new OrderDetailOption();
                    // OrderDetail 과 OrderDetailOption 연결
                    orderDetailOption.setOrderDetail(orderDetail);
                    // 옵션 Entity 가져오기
                    MenuOption option = optionRepository.findByOptionId(optionDto.getOptionId());
                    // 옵션 코드 Set
                    orderDetailOption.setMenuOption(option);
                    // 옵션 수량 Set
                    orderDetailOption.setQuantity(optionDto.getQuantity());
                    // 가공된 옵션 데이터 반환
                    return orderDetailOption;
                }).collect(Collectors.toList());
                // 가공된 옵션 리스트를 아이템의 필드에 Set
                orderDetail.setOptions(orderDetailOptions);
                return orderDetail;
            }).collect(Collectors.toList());

            // 주문_아이템 담기
            order.setOrderDetails(orderDetails);
            // 주문자 등록
            order.setUser(user);
            // 주문 날짜 등록
            order.setCreatedAt(LocalDateTime.now());
            // 주문 상태 등록
            order.setStatus("대기");
            // 주문 결제 방법 등록
            order.setPayMethod("현금결제");

            // 저장
            userRepository.save(user);
            Order newOrder = orderRepository.save(order);
            result = orderRepository.findOrderDetailsByOrderId(newOrder.getOrderId());

        } catch (Exception exception) {
            exception.printStackTrace();
            ResponseDto.databaseError();
        }
        return PostOrderCashResponseDto.success(userId, waitingNum, result);
    }

    @Override
    public ResponseEntity<? super GetOrderManagementResponseDto> getOrderManagement(String userId) {

        List<GetOrderManageMentResultSet> list = null;

        try {

            // userId로 데이터 조회
            User user = userRepository.findByUserId(userId);
            // 정보가 없다면 예외처리
            if (user == null)
                return PinCheckResponseDto.pinCheckFail();
            if (!user.getRole().trim().equals("ROLE_ADMIN")) {
                return PinCheckResponseDto.pinCheckFail();
            }

            list = orderRepository.findOrderDetailsWithTemperatureCount("대기");

        } catch (Exception exception) {
            exception.printStackTrace();
            ResponseDto.databaseError();
        }
        return GetOrderManagementResponseDto.success(list);
    }

    @Override
    public ResponseEntity<? super PatchOrderApproveResponseDto> patchOrderApprove(String userId,
            PatchOrderApproveRequestDto dto) {

        try {
            User user = userRepository.findByUserId(userId);

            if (!user.getRole().equals("ROLE_ADMIN")) {
                return PatchOrderApproveResponseDto.managerNotExisted();
            }

            Order order = orderRepository.findByOrderId(dto.getOrderId());
            order.setStatus("완료");
            order.setUpdatedAt(LocalDateTime.now());

            orderRepository.save(order);

        } catch (Exception exception) {
            exception.printStackTrace();
            ResponseDto.databaseError();
        }
        return PatchOrderApproveResponseDto.success();
    }

    @Override
    public ResponseEntity<? super GetOrderListResponseDto> getOrderList(
            String userId, int page, int size, String Name, String Status, String Date) {

        List<GetOrderListResultSet> list = null;

        try {
            // userId로 데이터 조회
            User user = userRepository.findByUserId(userId);
            // 정보가 없다면 예외처리
            if (user == null)
                return PinCheckResponseDto.pinCheckFail();
            if (!user.getRole().trim().equals("ROLE_ADMIN")) {
                return PinCheckResponseDto.pinCheckFail();
            }

            // 스크롤 이벤트로 인한 데이터 가져오게 도와주는것
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

            // 핀 상태
            String pin = null;

            // 회원이름 정의
            String name = Objects.isNull(Name) ? null : "".equals(Name) ? null : Name;

            // Name이 숫자로 된 4자리인지 확인
            if (name != null && name.matches("\\d+")) {
                pin = name; // 숫자로 된 4자리라면 pin에 저장
                name = null; // name은 null로 설정
            }

            // 상태에 정의
            String status = Objects.isNull(Status) ? null : "모두".equals(Status) ? null : Status;

            // 자바스크립트 Date타입을 LocalDate로 변환
            // 예외 처리를 추가한 경우

            // Date가 null이 아니면 LocalDateTime으로 변환하고, null일 경우 null을 반환
            LocalDateTime startOfDay = Objects.isNull(Date) ? null : LocalDate.parse(Date).atStartOfDay();
            LocalDateTime endOfDay = Objects.isNull(Date) ? null : LocalDate.parse(Date).atTime(LocalTime.MAX);

            // 레파지토리에서 데이터 찾아옴
            list = orderRepository.findOrderList(pin, name, status, startOfDay, endOfDay, pageable);

        } catch (Exception exception) {
            exception.printStackTrace();
            ResponseDto.databaseError();
        }

        return GetOrderListResponseDto.success(list);
    }

    @Override
    public ResponseEntity<? super PatchOrderRefundResponseDto> patchOrderRefund(String userId,
            PatchOrderRefundRequestDto dto) {
        try {
            // userId로 데이터 조회
            User manager = userRepository.findByUserId(userId);
            // 정보가 없다면 예외처리
            if (manager == null)
                return PinCheckResponseDto.pinCheckFail();
            if (!manager.getRole().trim().equals("ROLE_ADMIN")) {
                return PinCheckResponseDto.pinCheckFail();
            }
            int refundPrice = orderRepository.findTotalPriceByOrderId(dto.getOrderId());
            Order order = orderRepository.findByOrderId(dto.getOrderId());
            order.setStatus("환불");
            User user = order.getUser();
            int finalPrice = user.getPoint() + refundPrice;
            user.setPoint(finalPrice);
            orderRepository.save(order);
            userRepository.save(user);
        } catch (Exception exception) {
            exception.printStackTrace();
            ResponseDto.databaseError();
        }
        return PatchOrderRefundResponseDto.success();
    }

    @Override
    public ResponseEntity<? super PatchOrderRefundCancelResponseDto> patchOrderRefundCancel(String userId,
            PatchOrderRefundCancelRequestDto dto) {
        try {
            // userId로 데이터 조회
            User manager = userRepository.findByUserId(userId);
            // 정보가 없다면 예외처리
            if (manager == null)
                return PinCheckResponseDto.pinCheckFail();
            if (!manager.getRole().trim().equals("ROLE_ADMIN")) {
                return PinCheckResponseDto.pinCheckFail();
            }
            int totalPrice = orderRepository.findTotalPriceByOrderId(dto.getOrderId());
            Order order = orderRepository.findByOrderId(dto.getOrderId());
            order.setStatus("대기");
            User user = order.getUser();
            int balance = user.getPoint() - totalPrice;
            if (balance < 0) {
                return PatchOrderRefundCancelResponseDto.insufficientBalance();
            }
            user.setPoint(balance);
            orderRepository.save(order);
            userRepository.save(user);
        } catch (Exception exception) {
            exception.printStackTrace();
            ResponseDto.databaseError();
        }
        return PatchOrderRefundCancelResponseDto.success();
    }

    @Override
    public ResponseEntity<? super DeleteOrderResponseDto> deleteOrder(String managerId, DeleteOrderRequestDto dto) {

        System.out.println("managerId: " + managerId);
        System.out.println("orderId: " + dto.getOrderId());
        try {
            // userId로 데이터 조회
            User manager = userRepository.findByUserId(managerId);
            // 정보가 없다면 예외처리
            if (manager == null)
                return PinCheckResponseDto.pinCheckFail();
            if (!manager.getRole().trim().equals("ROLE_ADMIN")) {
                return PinCheckResponseDto.pinCheckFail();
            }
            int refundPrice = orderRepository.findTotalPriceByOrderId(dto.getOrderId());
            System.out.println("refundPrice: " + refundPrice);
            Order order = orderRepository.findByOrderId(dto.getOrderId());
            order.setStatus("삭제");
            User user = order.getUser();
            int finalPrice = user.getPoint() + refundPrice;
            user.setPoint(finalPrice);
            orderRepository.save(order);
            userRepository.save(user);
        } catch (Exception exception) {
            exception.printStackTrace();
            ResponseDto.databaseError();
        }
        return DeleteOrderResponseDto.success();
    }

}
