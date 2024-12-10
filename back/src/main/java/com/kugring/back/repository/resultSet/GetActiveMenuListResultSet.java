package com.kugring.back.repository.resultSet;

public interface GetActiveMenuListResultSet {
    Long getMenuId();
    String getName();
    String getImage();
    String getCategory();
    String getTemperature();
    Integer getPrice();
    Integer getSequence();
}