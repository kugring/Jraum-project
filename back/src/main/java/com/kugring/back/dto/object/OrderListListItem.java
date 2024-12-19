package com.kugring.back.dto.object;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.kugring.back.repository.resultSet.GetOrderListResultSet;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrderListListItem {
    
    private Long orderId;
    private String name;
    private String status;
    private String office;
    private String position;
    private String payMethod;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String profileImage;
    private int totalPrice;
    private int totalQuantity;
    private List<OrderDetailListItem> orderDetails;

    public OrderListListItem(GetOrderListResultSet resultSet){
        this.name = resultSet.getName();
        this.status = resultSet.getStatus();
        this.office = resultSet.getOffice();
        this.orderId = resultSet.getOrderId();
        this.position = resultSet.getPosition();
        this.payMethod = resultSet.getPayMethod();
        this.createdAt = resultSet.getCreatedAt();
        this.updatedAt = resultSet.getUpdatedAt();
        this.totalPrice = resultSet.getTotalPrice();
        this.profileImage = resultSet.getProfileImage();
        this.totalQuantity = resultSet.getTotalQuantity();
        this.orderDetails =  OrderDetailListItem.getOrderDetailList(resultSet.getOrder().getOrderDetails());
    }

    public static List<OrderListListItem> getList(List<GetOrderListResultSet> resultSets) {
        List<OrderListListItem> list = new ArrayList<>();
        for (GetOrderListResultSet resultSet : resultSets) {
            OrderListListItem orderListListItem = new OrderListListItem(resultSet);
            list.add(orderListListItem);
        }
        return list;
    }

}
