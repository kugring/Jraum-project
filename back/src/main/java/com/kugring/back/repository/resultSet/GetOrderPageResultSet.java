package com.kugring.back.repository.resultSet;

import com.kugring.back.entity.Order;

public interface GetOrderPageResultSet {
    int getHotCount();
    int getColdCount();
    int getTotalQuantity();
    Long getOrderId();
    String getName();
    String getPosition();
    String getProfileImage();
    String getOffice();
    Order getOrder();
}
