package com.kugring.back.dto.object;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.kugring.back.entity.PointCharge;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PointChargeRequestListItem {

    private int chargePoint;
    private Long pointChargeId;
    private String name;
    private String office;
    private String position;
    private String profileImage;
    private LocalDateTime createdAt;

    
    public PointChargeRequestListItem(PointCharge reusltSet) {
        this.name = reusltSet.getUser().getName();
        this.office = reusltSet.getUser().getOffice();
        this.position = reusltSet.getUser().getPosition();
        this.profileImage = reusltSet.getUser().getProfileImage();
        this.pointChargeId = reusltSet.getPointChargeId();
        this.chargePoint = reusltSet.getChargePoint();
        this.createdAt = reusltSet.getCreatedAt();
    }

    public static List<PointChargeRequestListItem> getList(List<PointCharge> resultSets) {
        List<PointChargeRequestListItem> list = new ArrayList<>();
        for (PointCharge resultSet : resultSets) {
            PointChargeRequestListItem item = new PointChargeRequestListItem(resultSet);
            list.add(item);
        }
        return list;
    }
}
