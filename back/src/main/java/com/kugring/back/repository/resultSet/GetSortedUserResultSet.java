package com.kugring.back.repository.resultSet;

import com.kugring.back.entity.User;

public interface GetSortedUserResultSet {
    User getUser();
    Integer getTotalSpent();
}
