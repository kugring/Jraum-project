package com.kugring.back.repository.resultSet;

import java.time.LocalDateTime;
import com.kugring.back.entity.Order;

public interface GetOrderListResultSet {
    Order getOrder();
    Long getOrderId();
    String getName();
    String getStatus();
    String getOffice();
    String getPosition();
    String getPayMethod();
    String getProfileImage();
    LocalDateTime getCreatedAt();
    LocalDateTime getUpdatedAt();
    int getPoint();
    int getTotalPrice();
    int getTotalQuantity();
}
