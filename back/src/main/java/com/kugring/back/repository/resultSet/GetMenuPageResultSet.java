package com.kugring.back.repository.resultSet;


import com.kugring.back.entity.Menu;

public interface GetMenuPageResultSet {
    int getPrice();
    int getSequence();
    int getEspressoShot();
    Long getMenuId();
    String getName();
    String getImage();
    Integer getStatus(); 
    String getCategory();
    String getTemperature();
    Menu getMenu();
}

