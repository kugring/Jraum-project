import Calendar from "react-calendar";
import styled from "styled-components";
import "react-calendar/dist/Calendar.css";


export const StyledCalendarWrapper = styled.div<{ $show: boolean }>`
    display: ${(props) => (props.$show ? "flex" : "none")};
    width: 100%;
    justify-content: center;
    position: relative;
  .react-calendar {
    display: ${(props) => (props.$show ? "block" : "none")};
    width: 100%;
    border: none;
    border-radius: 0.5rem;
    box-shadow: 4px 2px 10px 0px rgba(0, 0, 0, 0.13);
    padding: 3% 5%;
    background-color: white;
  }

  /* 전체 폰트 컬러 */
  .react-calendar__month-view {
    abbr {
      color: var(--copperBrown);
    }
  }

  /* 네비게이션 가운데 정렬 */
  .react-calendar__navigation {
    justify-content: center;
  }

  /* 네비게이션 폰트 설정 */
  .react-calendar__navigation button {
    color: var(--amberBrown);
    font-weight: 800;
    font-size: 1rem;
  }

  /* 네비게이션 버튼 컬러 */
  .react-calendar__navigation button:focus {
    background-color: white;
  }

  /* 네비게이션 비활성화 됐을때 스타일 */
  .react-calendar__navigation button:disabled {
    background-color: white;
    color: ${(props) => props.theme.darkBlack};
  }

  /* 년/월 상단 네비게이션 칸 크기 줄이기 */
  .react-calendar__navigation__label {
    flex-grow: 0 !important;
  }

  /* 요일 밑줄 제거 */
  .react-calendar__month-view__weekdays abbr {
    text-decoration: none;
    font-weight: 800;
  }


  /* 일요일에만 빨간 폰트 */
  .react-calendar__month-view__weekdays {
    color: var(--copperBrown);
  }

/* 일요일에만 빨간 폰트 */
.react-calendar__month-view__weekdays__weekday--weekend abbr[title="일요일"] {
  color: var(--hot);
}

  /* 오늘 날짜 폰트 컬러 */
  .react-calendar__tile--now {
    background: none;
    abbr {
      font-weight: 700;
      color: var(--orange);
    }
  }

  /* 네비게이션 월 스타일 적용 */
  .react-calendar__year-view__months__month {
    border-radius: 0.8rem;
    background-color: var(--lightCream);
    padding: 0;
  }

  /* 네비게이션 현재 월 스타일 적용 */
  .react-calendar__tile--hasActive {
    background-color: var(--lightCream);
    abbr {
      color: var(--orange);
    }
  }

  /* 일 날짜 간격 */
  .react-calendar__tile {
    padding: 5px 0px 15px;
    position: relative;
  }

  /* 네비게이션 월 스타일 적용 */
  .react-calendar__year-view__months__month {
    flex: 0 0 calc(33.3333% - 10px) !important;
    margin-inline-start: 5px !important;
    margin-inline-end: 5px !important;
    margin-block-end: 10px;
    padding: 20px 6.6667px;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--copperBrown);
  }

  /* 선택한 날짜 스타일 적용 */
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus,
  .react-calendar__tile--active {
    background-color: var(--lightCream);
    border-radius: 0.3rem;
  }
`;

export const StyledCalendar = styled(Calendar)``;

/* 오늘 버튼 스타일 */
export const StyledDate = styled.div<{$show: boolean}>`
  display: ${(props) => (props.$show ? "block" : "none")};
  position: absolute;
  right: 6%;
  top: 7%;
  color: #FFF;
  padding: 4px 12px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 800;
  border-radius: 15px;
  background-color: var(--orange);
`;

export const StyledReset = styled.div<{$show: boolean}>`
display: ${(props) => (props.$show ? "block" : "none")};
position: absolute;
left: 6%;
top: 7%;
color: #FFF;
padding: 4px 8px;
text-align: center;
font-size: 0.8rem;
font-weight: 800;
border-radius: 15px;
background-color: var(--orange);
`;

/* 오늘 날짜에 텍스트 삽입 스타일 */
export const StyledToday = styled.div`
  font-size: x-small;
  color: var(--copperBrown);
  font-weight: 600;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
`;

/* 출석한 날짜에 점 표시 스타일 */
export const StyledDot = styled.div`
  background-color: var(--orange);
  border-radius: 50%;
  width: 0.3rem;
  height: 0.3rem;
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translateX(-50%);
`;