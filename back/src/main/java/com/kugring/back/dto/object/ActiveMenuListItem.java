package com.kugring.back.dto.object;

import java.util.ArrayList;
import java.util.List;
import com.kugring.back.repository.resultSet.GetActiveMenuListResultSet;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ActiveMenuListItem {
    private Long menuId;
    private String name;
    private String image;
    private String category;
    private String temperature;
    private int price;
    private int sequence;


    public ActiveMenuListItem(GetActiveMenuListResultSet reusltSet) {
        this.name = reusltSet.getName();
        this.image = reusltSet.getImage();
        this.price = reusltSet.getPrice();
        this.menuId = reusltSet.getMenuId();
        this.sequence = reusltSet.getSequence();
        this.category = reusltSet.getCategory();
        this.temperature = reusltSet.getTemperature();
    }

    public static List<ActiveMenuListItem> getList(List<GetActiveMenuListResultSet> resultSets) {
        List<ActiveMenuListItem> list = new ArrayList<>();
        for (GetActiveMenuListResultSet resultSet : resultSets) {
            ActiveMenuListItem activeMenuListItem = new ActiveMenuListItem(resultSet);
            list.add(activeMenuListItem);
        }
        return list;
    }
}
