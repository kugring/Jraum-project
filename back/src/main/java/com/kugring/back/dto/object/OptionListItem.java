package com.kugring.back.dto.object;

import java.util.ArrayList;
import java.util.List;

import com.kugring.back.entity.MenuOption;
import com.kugring.back.repository.resultSet.GetMenuOptionListResultSet;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OptionListItem {

    private int price;
    private int status;
    private int sequence;
    private String type;
    private String detail;
    private String category;
    private Long optionId;

    public OptionListItem(GetMenuOptionListResultSet resultSet){
        this.type = resultSet.getType();
        this.price = resultSet.getPrice();
        this.status = resultSet.getStatus();
        this.detail = resultSet.getDetail();
        this.optionId = resultSet.getOptionId();
        this.category = resultSet.getCategory();
        this.sequence = resultSet.getSequence();
    }
    public OptionListItem(MenuOption resultSet){
        this.type = resultSet.getType();
        this.price = resultSet.getPrice();
        this.status = resultSet.getStatus();
        this.detail = resultSet.getDetail();
        this.optionId = resultSet.getOptionId();
        this.category = resultSet.getCategory();
        this.sequence = resultSet.getSequence();
    }
    
    public static List<OptionListItem> getList(List<GetMenuOptionListResultSet> resultSets) {
    List<OptionListItem> list = new ArrayList<>();
    for (GetMenuOptionListResultSet resultSet : resultSets) {
        OptionListItem optionListItem = new OptionListItem(resultSet);
        list.add(optionListItem);
    }
    return list;
    }
    
    public static List<OptionListItem> getMenuPageList(List<MenuOption> resultSets) {
    List<OptionListItem> list = new ArrayList<>();
    for (MenuOption resultSet : resultSets) {
        OptionListItem optionListItem = new OptionListItem(resultSet);
        list.add(optionListItem);
    }
    return list;
    }



}
