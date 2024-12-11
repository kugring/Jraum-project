package com.kugring.back.service.implement;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.kugring.back.dto.request.order.PostOrderDetailOptionRequestDto;
import com.kugring.back.dto.request.order.PostOrderDetailRequestDto;
import com.kugring.back.dto.request.order.PostOrderRequestDto;
import com.kugring.back.dto.response.ResponseDto;
import com.kugring.back.dto.response.order.PostOrderResponseDto;
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
import com.kugring.back.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImplement implements OrderService {

    private final OrderRepository OrderRepository;
    private final UserRepository userRepository;
    private final MenuRepository menuRepository;
    private final OptionRepository optionRepository;

    @Override
    @Transactional
    public ResponseEntity<? super PostOrderResponseDto> postOrderList(String userId, PostOrderRequestDto dto) {

        int balance = 0;
        long waitingNum = 0;

        try {

            // 주문요청자의 회원 존재 여부 확인
            User user = userRepository.findByUserId(userId);

            // 메뉴 ID들 추출 후에 모두 존재하는지 확인
            List<Long> menuIds = dto.getOrderList().stream().map(PostOrderDetailRequestDto::getMenuId).collect(Collectors.toList());
            if (!menuRepository.existsByMenuIdIn(menuIds)) return PostOrderResponseDto.noExistMenu();
            
            // 옵션 ID들 추출 후에 모두 존재하는지 확인
            List<Long> optionIds = dto.getOrderList().stream().flatMap(orderDetail -> orderDetail.getOptions().stream()).map(PostOrderDetailOptionRequestDto::getOptionId).collect(Collectors.toList());
            if (!optionRepository.existsByOptionIdIn(optionIds)) return PostOrderResponseDto.noExistOption();
            
            // 주문 대기중인 팀 갯수 확인
            waitingNum = OrderRepository.countByStatus("대기");

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
                    OrderDetailOption orderDetailOption =  new OrderDetailOption();
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
            if (balance < 0) return PostOrderResponseDto.insufficientBlance();

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
            OrderRepository.save(order);

        } catch (Exception exception) {
            exception.printStackTrace();
            ResponseDto.databaseError();
        }

        return PostOrderResponseDto.success(balance, waitingNum);

    }

//     @Override
//     public ResponseEntity<? super FilterOrderListResponseDto> filterOrderList(FilterOrderListRequestDto dto) {

//         List<Order> orderListEntities = new ArrayList<>();

//         try {

//             String userId = dto.getUserId();
//             String orderStatus = dto.getOrderStatus();
//             LocalDateTime startCreateDate = dto.getStartCreateDate();
//             LocalDateTime endCreateDate = dto.getEndCreateDate();
//             LocalDateTime startCompleteDate = dto.getStartCompleteDate();
//             LocalDateTime endCompleteDate = dto.getEndCompleteDate();

//             orderListEntities = OrderRepository.findOrders(userId, orderStatus, startCreateDate, endCreateDate, startCompleteDate, endCompleteDate);
//         } catch (Exception exception) {
//             exception.printStackTrace();
//             ResponseDto.databaseError();
//         }

//         return FilterOrderListResponseDto.success(orderListEntities);
//     }

//     @Override
//     @Transactional
//     public ResponseEntity<? super PatchOrderListResponseDto> patchOrderList(Integer orderListId, PatchOrderListRequestDto dto) {

//         try {

//             // 주문리스트를 찾아옴
//             Order Order = OrderRepository.findByOrderListId(orderListId);

//             // 해당 주문리스트가 없으면 예외처리
//             if(Order == null) return PatchOrderListResponseDto.noExistOrder();

//             // Dto에서 주문 상태 가져옴
//             String orderStatus = dto.getOrderStatus();

//             // 이전 주문 상태 가져옴
//             String preOrderStatus = Order.getOrderStatus();

//             // 주문 상태 오류라면 예외처리
//             Set<String> validStatuses = Set.of("대기", "완료", "취소");
//             if (!validStatuses.contains(orderStatus))  return PatchOrderListResponseDto.noExistOrderStatus();

//             // 주문자 정보 가져옴
//             User User = Order.getUser();

//             // 완료 상태에서 대기로 변경 시 완료시간 초기화
//             if (preOrderStatus.equals("완료") && orderStatus.equals("대기")) {
//                 Order.setCompleteOrderDate(null);
//             }
//             // 대기 상태에서 완료로 변경 시 완료시간 작성
//             else if (preOrderStatus.equals("대기") && orderStatus.equals("완료")) {
//                 Order.setCompleteOrderDate(LocalDateTime.now());
//             }
//             // 포인트 계산 및 처리
//             else if ((preOrderStatus.equals("대기") && orderStatus.equals("취소")) ||
//                 (preOrderStatus.equals("취소") && (orderStatus.equals("대기") || orderStatus.equals("완료")))) {
//                 Order.setCompleteOrderDate(LocalDateTime.now());
//                 int totalPrice = Order.getOrderList().stream()
//                     .mapToInt(orderItem -> {
//                         int menuPrice = orderItem.getMenu().getMenuPrice();
//                         int optionTotalPrice = orderItem.getOrderItemOptions().stream()
//                             .mapToInt(optionItem -> optionItem.getOptionQuantity() * optionItem.getOption().getOptionPrice())
//                             .sum();
//                         return (menuPrice + optionTotalPrice) * orderItem.getOrderItemQuantity();
//                     }).sum();
                
//                 if (orderStatus.equals("취소")) {
//                     User.pointCharge(totalPrice);  // 포인트 롤백
//                 } else {
//                     User.pointPay(totalPrice);     // 포인트 결제
//                 }
//             } else {
//                 // 상태가 이상하면 예외처리
//                 return PatchOrderListResponseDto.noExistOrderStatus();
//             }

//             // 주문 상태를 변경해줌
//             Order.setOrderStatus(orderStatus);
//             OrderRepository.save(Order);

//         } catch (Exception exception) {
//             exception.printStackTrace();
//             return ResponseDto.databaseError();
//         }

//         return PatchOrderListResponseDto.success();
//     }

//     @Override
//     public ResponseEntity<? super PutOrderListResponseDto> putOrderList(Integer orderListId, PutOrderListRequestDto dto) {


//         try {

//             // Order 조회
//             Order orderList = OrderRepository.findByOrderListId(orderListId);

//             // 예외처리_(주문리스트ID)
//             if(orderList == null) return PutOrderListResponseDto.orderFail();

//             // 예외처리_(포인트결제가 아닌 경우)
//             if(!orderList.getPayMethod().equals("포인트결제")) return PutOrderListResponseDto.orderFail();

//             // 예외처리_(대기상태가 아닌 경우)
//             if(!orderList.getOrderStatus().equals("대기")) return PutOrderListResponseDto.orderFail();

//             // 예외처리_(메뉴ID)
//             List<Integer> menuIds = dto.getOrderList().stream().map(OrderItemObject::getMenuId).collect(Collectors.toList());
//             if (menuRepository.countByMenuIdIn(menuIds) != menuIds.size()) return PutOrderListResponseDto.noExistMenu();

//             // 예외처리_(옵션코드) // todo: 여기에 문제 있음
//             List<Integer> optionIds = dto.getOrderList().stream().flatMap(orderItem -> orderItem.getOrderItemOptions().stream())
//                     .map(OrderItemOptionObject::getOptionId).collect(Collectors.toList());
//             if (optionRepository.countByOptionIdIn(optionIds) != optionIds.size()) return PutOrderListResponseDto.noExistOption();


//             // 주문자 가져오기
//             User User = orderList.getUser();

//             // 기존 OrderDetail 리스트 가져오기
//             List<OrderDetail> preOrderItems = orderList.getOrderList();

//             // 취소된 가격
//             int rollBackPrice = preOrderItems.stream()
//             .mapToInt(orderItem -> {
//                 int menuPrice = orderItem.getMenu().getMenuPrice();
//                 int itemQuantity = orderItem.getOrderItemQuantity();
                
//                 // 기본 메뉴 가격에 옵션 가격의 총합을 추가합니다.
//                 int optionTotalPrice = orderItem.getOrderItemOptions().stream()
//                     .mapToInt(optionItem -> optionItem.getOptionQuantity() * optionItem.getOption().getOptionPrice())
//                     .sum();
                
//                 return (menuPrice + optionTotalPrice) * itemQuantity;
//             }).sum();

//             // 포인트 롤백
//             User.pointCharge(rollBackPrice);

//             // orderItems 리스트를 비우면 종속된 order_item 데이터도 삭제됩니다.
//             orderList.getOrderList().clear();

//             // todo: 클린하고 저장을 해야 삭제되나?  결론: 안해도됨
//             // OrderRepository.save(orderList);

//             // OrderDetail 리스트 생성 및 추가
//             List<OrderDetail> orderItems = dto.getOrderList().stream().map(itemDto -> {
//                 // 등록할 아이템 생성
//                 OrderDetail orderItem = new OrderDetail();
//                 // OrderList와 OrderItem 연결
//                 orderItem.setOrderList(orderList); 
//                 // 아이템 메뉴 Entity 가져오기  // todo : menuId만 넣어도 혹시 알아서 저장해주나? // 결론: 알아서 넣어줌 // But: 메뉴 가겨을 알아내기 위해서 엔티티로 저장!
//                 Menu Menu = menuRepository.findByMenuId(itemDto.getMenuId());
//                 // Menu Menu = new Menu();
//                 // Menu.setMenuId(itemDto.getMenuId());
//                 // 아이템 메뉴 Set
//                 orderItem.setMenu(Menu);
//                 // 아이템 수량
//                 orderItem.setOrderItemQuantity(itemDto.getOrderItemQuantity());
//                 // OrderDetailOption 리스트 생성 및 추가
//                 List<OrderDetailOption> orderItemOptions = itemDto.getOrderItemOptions().stream().map(optionDto -> {
//                     // 등록할 아이템의 옵션 생성
//                     OrderDetailOption orderItemOption =  new OrderDetailOption();
//                     // OrderItem 과 OrderItemOption 연결
//                     orderItemOption.setOrderItem(orderItem);
//                     // 옵션 Entity 가져오기
//                     MenuOption optionEntity = optionRepository.findByOptionId(optionDto.getOptionId());
//                     // 옵션 코드 Set
//                     orderItemOption.setOption(optionEntity);
//                     // 옵션 수량 Set
//                     orderItemOption.setOptionQuantity(optionDto.getOptionQuantity());
//                     // 가공된 옵션 데이터 반환
//                     return orderItemOption;
//                 }).collect(Collectors.toList());
//                 // 가공된 옵션 리스트를 아이템의 필드에 Set
//                 orderItem.setOrderItemOptions(orderItemOptions);
//                 return orderItem;
//             }).collect(Collectors.toList());


//             int totalPrice = orderItems.stream()
//                 .mapToInt(orderItem -> {
//                     int menuPrice = orderItem.getMenu().getMenuPrice();
//                     int itemQuantity = orderItem.getOrderItemQuantity();

//                     // 기본 메뉴 가격에 옵션 가격의 총합을 추가합니다.
//                     int optionTotalPrice = orderItem.getOrderItemOptions().stream()
//                         .mapToInt(optionItem -> optionItem.getOptionQuantity() * optionItem.getOption().getOptionPrice())
//                         .sum();
                    
//                     return (menuPrice + optionTotalPrice) * itemQuantity;
//                 }).sum();

//             // 잔액 확인
//             int updatedPoint = User.getPoint() - totalPrice;

//             // 포인트가 음수가 되지 않도록 설정
//             if (updatedPoint < 0) return PostOrderResponseDto.insufficientBlance();
//             // 잔여금 저장
//             User.setPoint(updatedPoint);

//             // 수정된_주문_아이템 담기
//             orderList.getOrderList().addAll(orderItems);
//             // 수정된_주문자 등록
//             orderList.setUser(User);

//             // 저장
//             userRepository.save(User);
//             OrderRepository.save(orderList);

//         } catch (Exception exception) {
//             exception.printStackTrace();
//             ResponseDto.databaseError();
//         }
//         return PutOrderListResponseDto.success();
//     }

}
