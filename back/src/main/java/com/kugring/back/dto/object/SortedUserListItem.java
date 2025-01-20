package com.kugring.back.dto.object;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.kugring.back.repository.resultSet.GetSortedUserResultSet;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SortedUserListItem {
    
    private int point;
    private String pin;
    private String name;
    private String userId;
    private String division;
    private String position;
    private String nickname;
    private String initialName;
    private String phoneNumber;
    private String profileImage;
    private Integer totalSpent;
    private LocalDateTime createdAt;


    public SortedUserListItem(GetSortedUserResultSet reusltSet) {
        this.pin = reusltSet.getUser().getPin();
        this.name = reusltSet.getUser().getName();
        this.point = reusltSet.getUser().getPoint();
        this.userId = reusltSet.getUser().getUserId();
        this.division = reusltSet.getUser().getDivision();
        this.position = reusltSet.getUser().getPosition();
        this.nickname = reusltSet.getUser().getNickname();
        this.createdAt = reusltSet.getUser().getCreatedAt();
        this.phoneNumber = reusltSet.getUser().getPhoneNumber();
        this.initialName =  reusltSet.getUser().getInitialName();
        this.profileImage = reusltSet.getUser().getProfileImage();
        this.totalSpent = reusltSet.getTotalSpent();
    }

    public static List<SortedUserListItem> getList(List<GetSortedUserResultSet> resultSets) {
        List<SortedUserListItem> list = new ArrayList<>();
        for (GetSortedUserResultSet resultSet : resultSets) {
            SortedUserListItem activeMenuListItem = new SortedUserListItem(resultSet);
            list.add(activeMenuListItem);
        }
        return list;
    }
}
