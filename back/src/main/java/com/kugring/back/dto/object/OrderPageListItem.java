package com.kugring.back.dto.object;

import java.util.ArrayList;
import java.util.List;

import com.kugring.back.repository.resultSet.GetOrderPageResultSet;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

// OrderPageListItem 클래스
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrderPageListItem {

    private int hotCount;
    private int coldCount;
    private int totalQuantity;
    private Long orderId;
    private String name;
    private String office;
    private String position;
    private String payMethod;
    private String profileImage;
    private List<OrderDetailListItem> orderDetails;

    public OrderPageListItem(GetOrderPageResultSet resultSet){
        this.name = resultSet.getName();
        this.office = resultSet.getOffice();
        this.orderId = resultSet.getOrderId();
        this.hotCount = resultSet.getHotCount();
        this.position = resultSet.getPosition();
        this.payMethod = resultSet.getOrder().getPayMethod();
        this.coldCount = resultSet.getColdCount();
        this.profileImage = resultSet.getProfileImage();

        this.totalQuantity = resultSet.getTotalQuantity();
        this.orderDetails =  OrderDetailListItem.getOrderDetailList(resultSet.getOrder().getOrderDetails());
    }

    public static List<OrderPageListItem> getList(List<GetOrderPageResultSet> resultSets) {
        List<OrderPageListItem> list = new ArrayList<>();
        for (GetOrderPageResultSet resultSet : resultSets) {
            OrderPageListItem orderPageListItem = new OrderPageListItem(resultSet);
            list.add(orderPageListItem);
        }
        return list;
    }


}
