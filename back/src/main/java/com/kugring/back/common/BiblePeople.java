package com.kugring.back.common;

import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

public class BiblePeople {

    // 전체 성경 인물 리스트
    public static final List<String> BIBLE_PERSONS = Arrays.asList(
            "아브라함", "모세", "다윗", "이사야", "엘리야",
            "마리아", "바울", "노아", "삼손", "솔로몬");

    // 특정 배열에 포함된 값들을 제외한 나머지 성경 인물 리스트 반환
    public static List<String> getRemainingBiblePeople(String[] excludeNames) {
        List<String> excludeList = Arrays.asList(excludeNames); // 제외할 이름을 리스트로 변환
        return BIBLE_PERSONS.stream()
                .filter(person -> !excludeList.contains(person)) // 제외할 이름을 제외하고 필터링
                .collect(Collectors.toList());
    }

    // 랜덤 인물 반환
    public static String getRandomBiblePerson(String[] excludeNames) {
        List<String> remainingPeople = getRemainingBiblePeople(excludeNames);

        // 남은 인물이 없을 경우 기본값 반환
        if (remainingPeople.isEmpty()) {
            return "다 소모됨";
        }

        Random random = new Random();
        return remainingPeople.get(random.nextInt(remainingPeople.size()));
    }
}
