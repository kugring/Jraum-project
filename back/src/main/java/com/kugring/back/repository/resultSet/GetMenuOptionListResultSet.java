package com.kugring.back.repository.resultSet;

public interface GetMenuOptionListResultSet {
    Long getOptionId();
    String getType();
    String getDetail();
    String getCategory();
    Integer getSequence();
    Integer getPrice();
    int getStatus();
}
