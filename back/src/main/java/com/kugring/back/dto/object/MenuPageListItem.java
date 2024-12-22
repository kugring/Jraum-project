package com.kugring.back.dto.object;

import java.util.ArrayList;
import java.util.List;

import com.kugring.back.repository.resultSet.GetMenuPageResultSet;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MenuPageListItem {

    private int price;
    private int status;
    private int sequence;
    private int espressoShot;
    private Long menuId;
    private String name;
    private String image;
    private String category;
    private String temperature;
    private List<OptionListItem> options;

    public MenuPageListItem(GetMenuPageResultSet resultSet) {
        this.name = resultSet.getName();
        this.image = resultSet.getImage();
        this.price = resultSet.getPrice();
        this.menuId = resultSet.getMenuId();
        this.status = resultSet.getStatus();
        this.sequence = resultSet.getSequence();
        this.category = resultSet.getCategory();
        this.temperature = resultSet.getTemperature();
        this.espressoShot = resultSet.getEspressoShot();
        this.options = OptionListItem.getMenuPageList(resultSet.getMenu().getOptions());
    }

    public static List<MenuPageListItem> getList(List<GetMenuPageResultSet> resultSets) {
        List<MenuPageListItem> list = new ArrayList<>();
        for (GetMenuPageResultSet resultSet : resultSets) {
            MenuPageListItem item = new MenuPageListItem(resultSet);
            list.add(item);
        }
        return list;
    }
}
