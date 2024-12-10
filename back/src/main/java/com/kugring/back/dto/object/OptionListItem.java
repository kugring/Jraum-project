package com.kugring.back.dto.object;

import java.util.ArrayList;
import java.util.List;
import com.kugring.back.repository.resultSet.GetMenuOptionListResultSet;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OptionListItem {

    private int price;
    private String type;
    private int sequence;
    private Long optionId;
    private String detail;
    private String category;


    public OptionListItem(GetMenuOptionListResultSet resultSet){
        this.type = resultSet.getType();
        this.price = resultSet.getPrice();
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
}
