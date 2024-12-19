package com.kugring.back.dto.object;

import java.util.ArrayList;
import java.util.List;
import com.kugring.back.entity.OrderDetail;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailListItem {

    private Long orderDetailId;
    private Long menuId;
    private String name;
    private String image;
    private String category;
    private String temperature;
    private int price;
    private int status;
    private int sequence;
    private int quantity;
    private int totalPrice;
    private int espressoShot;
    private List<OrderDetailOptionListItem> options; 


    public OrderDetailListItem(OrderDetail orderDetail){
        this.name = orderDetail.getMenu().getName();
        this.image = orderDetail.getMenu().getImage();
        this.price = orderDetail.getMenu().getPrice();
        this.menuId = orderDetail.getMenu().getMenuId();
        this.status = orderDetail.getMenu().getStatus();
        this.sequence = orderDetail.getMenu().getSequence();
        this.category = orderDetail.getMenu().getCategory();
        this.temperature = orderDetail.getMenu().getTemperature();
        this.espressoShot = orderDetail.getMenu().getEspressoShot();
        this.orderDetailId = orderDetail.getOrderDetailId();
        this.quantity = orderDetail.getQuantity();
        this.totalPrice = orderDetail.getQuantity() * orderDetail.getMenu().getPrice();
        this.options = OrderDetailOptionListItem.getOrderDetailOptionList(orderDetail.getOptions()); 
    }

    public static List<OrderDetailListItem> getOrderDetailList(List<OrderDetail> orderDetails) {
        List<OrderDetailListItem> list = new ArrayList<>();
        for (OrderDetail orderDetail : orderDetails) {
            OrderDetailListItem item = new OrderDetailListItem(orderDetail);
            list.add(item);
        }
        return list;
    }

}