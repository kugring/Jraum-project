package com.kugring.back.dto.object;

import java.util.ArrayList;
import java.util.List;

import com.kugring.back.entity.OrderDetailOption;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailOptionListItem {

    private Long id;
    private Long optionId;
    private String type;
    private String detail;
    private String category;
    private int price;
    private int status;
    private int sequence;
    private int quantity;

    public OrderDetailOptionListItem(OrderDetailOption orderDetailOption) {
        this.id = orderDetailOption.getId();
        this.type = orderDetailOption.getMenuOption().getType();
        this.price = orderDetailOption.getMenuOption().getPrice();
        this.detail = orderDetailOption.getMenuOption().getDetail();
        this.optionId = orderDetailOption.getMenuOption().getOptionId();
        this.category = orderDetailOption.getMenuOption().getCategory();
        this.sequence = orderDetailOption.getMenuOption().getSequence();
        this.quantity = orderDetailOption.getQuantity();
    }

    public static List<OrderDetailOptionListItem> getOrderDetailOptionList(List<OrderDetailOption> orderDetailOptions) {
        List<OrderDetailOptionListItem> list = new ArrayList<>();
        for (OrderDetailOption orderDetailOption : orderDetailOptions) {
            OrderDetailOptionListItem item = new OrderDetailOptionListItem(orderDetailOption);
            list.add(item);
        }
        return list;
    }
}
