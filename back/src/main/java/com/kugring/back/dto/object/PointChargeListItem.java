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
public class PointChargeListItem {

    private int chargePoint;
    private Long pointChargeId;
    private String name;
    private String office;
    private String status;
    private String position;
    private String profileImage;
    private LocalDateTime updatedAt;

    public PointChargeListItem(PointCharge reusltSet) {
        this.name = reusltSet.getUser().getName();
        this.office = reusltSet.getUser().getOffice();
        this.position = reusltSet.getUser().getPosition();
        this.profileImage = reusltSet.getUser().getProfileImage();
        this.pointChargeId = reusltSet.getPointChargeId();
        this.chargePoint = reusltSet.getChargePoint();
        this.updatedAt = reusltSet.getUpdatedAt();
        this.status = reusltSet.getStatus();
    }

    public static List<PointChargeListItem> getList(List<PointCharge> resultSets) {
        List<PointChargeListItem> list = new ArrayList<>();
        for (PointCharge resultSet : resultSets) {
            PointChargeListItem item = new PointChargeListItem(resultSet);
            list.add(item);
        }
        return list;
    }

}
