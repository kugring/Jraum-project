package com.kugring.back.service.implement;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.kugring.back.common.BiblePeople;
import com.kugring.back.dto.request.order.PatchOrderApproveRequestDto;
import com.kugring.back.dto.request.order.PatchOrderRefundRequestDto;
import com.kugring.back.dto.request.order.PostOrderCashRequestDto;
import com.kugring.back.dto.request.order.PostOrderDetailOptionRequestDto;
import com.kugring.back.dto.request.order.PostOrderDetailRequestDto;
import com.kugring.back.dto.request.order.PostPointOrderRequestDto;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.dto.response.auth.PinCheckResponseDto;
import com.kugring.back.dto.response.order.GetOrderListResponseDto;
import com.kugring.back.dto.response.order.GetOrderManagementResponseDto;
import com.kugring.back.dto.response.order.PatchOrderApproveResponseDto;
import com.kugring.back.dto.response.order.PatchOrderRefundResponseDto;
import com.kugring.back.dto.response.order.PostOrderCashResponseDto;
import com.kugring.back.dto.response.order.PostPointOrderResponseDto;
import com.kugring.back.entity.Menu;
import com.kugring.back.entity.MenuOption;
import com.kugring.back.entity.OrderDetail;
import com.kugring.back.entity.OrderDetailOption;
import com.kugring.back.entity.Order;
import com.kugring.back.entity.User;
import com.kugring.back.repository.MenuRepository;
import com.kugring.back.repository.OptionRepository;
import com.kugring.back.repository.OrderRepository;
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

    // @Override
    // public ResponseEntity<? super FilterOrderListResponseDto>
    // filterOrderList(FilterOrderListRequestDto dto) {

    // List<Order> orderListEntities = new ArrayList<>();

    // try {

    // String userId = dto.getUserId();
    // String orderStatus = dto.getOrderStatus();
    // LocalDateTime startCreateDate = dto.getStartCreateDate();
    // LocalDateTime endCreateDate = dto.getEndCreateDate();
    // LocalDateTime startCompleteDate = dto.getStartCompleteDate();
    // LocalDateTime endCompleteDate = dto.getEndCompleteDate();

    // orderListEntities = OrderRepository.findOrders(userId, orderStatus,
    // startCreateDate, endCreateDate, startCompleteDate, endCompleteDate);
    // } catch (Exception exception) {
    // exception.printStackTrace();
    // ResponseDto.databaseError();
    // }

    // return FilterOrderListResponseDto.success(orderListEntities);
    // }

    // @Override
    // @Transactional
    // public ResponseEntity<? super PatchOrderListResponseDto>
    // patchOrderList(Integer orderListId, PatchOrderListRequestDto dto) {

    // try {

    // // 주문리스트를 찾아옴
    // Order Order = OrderRepository.findByOrderListId(orderListId);

    // // 해당 주문리스트가 없으면 예외처리
    // if(Order == null) return PatchOrderListResponseDto.noExistOrder();

    // // Dto에서 주문 상태 가져옴
    // String orderStatus = dto.getOrderStatus();

    // // 이전 주문 상태 가져옴
    // String preOrderStatus = Order.getOrderStatus();

    // // 주문 상태 오류라면 예외처리
    // Set<String> validStatuses = Set.of("대기", "완료", "취소");
    // if (!validStatuses.contains(orderStatus)) return
    // PatchOrderListResponseDto.noExistOrderStatus();

    // // 주문자 정보 가져옴
    // User User = Order.getUser();

    // // 완료 상태에서 대기로 변경 시 완료시간 초기화
    // if (preOrderStatus.equals("완료") && orderStatus.equals("대기")) {
    // Order.setCompleteOrderDate(null);
    // }
    // // 대기 상태에서 완료로 변경 시 완료시간 작성
    // else if (preOrderStatus.equals("대기") && orderStatus.equals("완료")) {
    // Order.setCompleteOrderDate(LocalDateTime.now());
    // }
    // // 포인트 계산 및 처리
    // else if ((preOrderStatus.equals("대기") && orderStatus.equals("취소")) ||
    // (preOrderStatus.equals("취소") && (orderStatus.equals("대기") ||
    // orderStatus.equals("완료")))) {
    // Order.setCompleteOrderDate(LocalDateTime.now());
    // int totalPrice = Order.getOrderList().stream()
    // .mapToInt(orderItem -> {
    // int menuPrice = orderItem.getMenu().getMenuPrice();
    // int optionTotalPrice = orderItem.getOrderItemOptions().stream()
    // .mapToInt(optionItem -> optionItem.getOptionQuantity() *
    // optionItem.getOption().getOptionPrice())
    // .sum();
    // return (menuPrice + optionTotalPrice) * orderItem.getOrderItemQuantity();
    // }).sum();

    // if (orderStatus.equals("취소")) {
    // User.pointCharge(totalPrice); // 포인트 롤백
    // } else {
    // User.pointPay(totalPrice); // 포인트 결제
    // }
    // } else {
    // // 상태가 이상하면 예외처리
    // return PatchOrderListResponseDto.noExistOrderStatus();
    // }

    // // 주문 상태를 변경해줌
    // Order.setOrderStatus(orderStatus);
    // OrderRepository.save(Order);

    // } catch (Exception exception) {
    // exception.printStackTrace();
    // return ResponseDto.databaseError();
    // }

    // return PatchOrderListResponseDto.success();
    // }

    // @Override
    // public ResponseEntity<? super PutOrderListResponseDto> putOrderList(Integer
    // orderListId, PutOrderListRequestDto dto) {

    // try {

    // // Order 조회
    // Order orderList = OrderRepository.findByOrderListId(orderListId);

    // // 예외처리_(주문리스트ID)
    // if(orderList == null) return PutOrderListResponseDto.orderFail();

    // // 예외처리_(포인트결제가 아닌 경우)
    // if(!orderList.getPayMethod().equals("포인트결제")) return
    // PutOrderListResponseDto.orderFail();

    // // 예외처리_(대기상태가 아닌 경우)
    // if(!orderList.getOrderStatus().equals("대기")) return
    // PutOrderListResponseDto.orderFail();

    // // 예외처리_(메뉴ID)
    // List<Integer> menuIds =
    // dto.getOrderList().stream().map(OrderItemObject::getMenuId).collect(Collectors.toList());
    // if (menuRepository.countByMenuIdIn(menuIds) != menuIds.size()) return
    // PutOrderListResponseDto.noExistMenu();

    // // 예외처리_(옵션코드) // todo: 여기에 문제 있음
    // List<Integer> optionIds = dto.getOrderList().stream().flatMap(orderItem ->
    // orderItem.getOrderItemOptions().stream())
    // .map(OrderItemOptionObject::getOptionId).collect(Collectors.toList());
    // if (optionRepository.countByOptionIdIn(optionIds) != optionIds.size()) return
    // PutOrderListResponseDto.noExistOption();

    // // 주문자 가져오기
    // User User = orderList.getUser();

    // // 기존 OrderDetail 리스트 가져오기
    // List<OrderDetail> preOrderItems = orderList.getOrderList();

    // // 취소된 가격
    // int rollBackPrice = preOrderItems.stream()
    // .mapToInt(orderItem -> {
    // int menuPrice = orderItem.getMenu().getMenuPrice();
    // int itemQuantity = orderItem.getOrderItemQuantity();

    // // 기본 메뉴 가격에 옵션 가격의 총합을 추가합니다.
    // int optionTotalPrice = orderItem.getOrderItemOptions().stream()
    // .mapToInt(optionItem -> optionItem.getOptionQuantity() *
    // optionItem.getOption().getOptionPrice())
    // .sum();

    // return (menuPrice + optionTotalPrice) * itemQuantity;
    // }).sum();

    // // 포인트 롤백
    // User.pointCharge(rollBackPrice);

    // // orderItems 리스트를 비우면 종속된 order_item 데이터도 삭제됩니다.
    // orderList.getOrderList().clear();

    // // todo: 클린하고 저장을 해야 삭제되나? 결론: 안해도됨
    // // OrderRepository.save(orderList);

    // // OrderDetail 리스트 생성 및 추가
    // List<OrderDetail> orderItems = dto.getOrderList().stream().map(itemDto -> {
    // // 등록할 아이템 생성
    // OrderDetail orderItem = new OrderDetail();
    // // OrderList와 OrderItem 연결
    // orderItem.setOrderList(orderList);
    // // 아이템 메뉴 Entity 가져오기 // todo : menuId만 넣어도 혹시 알아서 저장해주나? // 결론: 알아서 넣어줌 //
    // But: 메뉴 가겨을 알아내기 위해서 엔티티로 저장!
    // Menu Menu = menuRepository.findByMenuId(itemDto.getMenuId());
    // // Menu Menu = new Menu();
    // // Menu.setMenuId(itemDto.getMenuId());
    // // 아이템 메뉴 Set
    // orderItem.setMenu(Menu);
    // // 아이템 수량
    // orderItem.setOrderItemQuantity(itemDto.getOrderItemQuantity());
    // // OrderDetailOption 리스트 생성 및 추가
    // List<OrderDetailOption> orderItemOptions =
    // itemDto.getOrderItemOptions().stream().map(optionDto -> {
    // // 등록할 아이템의 옵션 생성
    // OrderDetailOption orderItemOption = new OrderDetailOption();
    // // OrderItem 과 OrderItemOption 연결
    // orderItemOption.setOrderItem(orderItem);
    // // 옵션 Entity 가져오기
    // MenuOption optionEntity =
    // optionRepository.findByOptionId(optionDto.getOptionId());
    // // 옵션 코드 Set
    // orderItemOption.setOption(optionEntity);
    // // 옵션 수량 Set
    // orderItemOption.setOptionQuantity(optionDto.getOptionQuantity());
    // // 가공된 옵션 데이터 반환
    // return orderItemOption;
    // }).collect(Collectors.toList());
    // // 가공된 옵션 리스트를 아이템의 필드에 Set
    // orderItem.setOrderItemOptions(orderItemOptions);
    // return orderItem;
    // }).collect(Collectors.toList());

    // int totalPrice = orderItems.stream()
    // .mapToInt(orderItem -> {
    // int menuPrice = orderItem.getMenu().getMenuPrice();
    // int itemQuantity = orderItem.getOrderItemQuantity();

    // // 기본 메뉴 가격에 옵션 가격의 총합을 추가합니다.
    // int optionTotalPrice = orderItem.getOrderItemOptions().stream()
    // .mapToInt(optionItem -> optionItem.getOptionQuantity() *
    // optionItem.getOption().getOptionPrice())
    // .sum();

    // return (menuPrice + optionTotalPrice) * itemQuantity;
    // }).sum();

    // // 잔액 확인
    // int upDatePoint = User.getPoint() - totalPrice;

    // // 포인트가 음수가 되지 않도록 설정
    // if (upDatePoint < 0) return PostPointOrderResponseDto.insufficientBlance();
    // // 잔여금 저장
    // User.setPoint(upDatePoint);

    // // 수정된_주문_아이템 담기
    // orderList.getOrderList().addAll(orderItems);
    // // 수정된_주문자 등록
    // orderList.setUser(User);

    // // 저장
    // userRepository.save(User);
    // OrderRepository.save(orderList);

    // } catch (Exception exception) {
    // exception.printStackTrace();
    // ResponseDto.databaseError();
    // }
    // return PutOrderListResponseDto.success();
    // }

}
