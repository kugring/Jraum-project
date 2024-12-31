import { useEffect, useRef } from "react";
import { StyledCalendarWrapper, StyledCalendar, StyledDate, StyledDot, StyledReset } from "./styles";
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';  // 기본 스타일
import { FaRegCalendarAlt } from "react-icons/fa";
import useCalendarStore from "store/calendar.store";
import styled from "styled-components";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

//          component: 캘린더 컴포넌트           //
const Calendar = () => {

    //          state: 오늘 날짜           //
    const today = useCalendarStore.getState().today;
    //          state: 캘린더 상태           //
    const showCalendar = useCalendarStore((state) => state.showCalendar);
    //          state: 선택된 날짜 상태         //
    const date = useCalendarStore((state) => state.date);
    //          state: 오늘 날짜로 돌아오기 위한 상태         //
    const activeStartDate = useCalendarStore((state) => state.activeStartDate);
    //          state: 오늘 날짜 셋팅?         //
    const setActiveStartDate = useCalendarStore.getState().setActiveStartDate;
    //          state: 날짜 셋팅?         //
    const setDate = useCalendarStore.getState().setDate;
    //          state: 출석한 날짜         //
    const attendDay = useCalendarStore.getState().attendDay

    //          state: 캘린더 컴포넌트를 감싸는 ref         //
    const calendarRef = useRef<HTMLDivElement>(null);
    //          state: 캘린더 컴포넌트를 감싸는 ref         //
    const calendarIconRef = useRef<HTMLDivElement>(null);


    //          function: 날짜 설정 함수         //
    const handleDateChange = (newDate: Value) => {
        setDate(newDate);
    };

    //          function: 캘린더 보임 설정 함수         //
    const setShowCalendar = useCalendarStore.getState().setShowCalendar;
    //          function: 오늘 날짜로 돌아가는 함수         //
    const handleTodayClick = useCalendarStore.getState().handleTodayClick;
    //          function: 날짜 초기화 함수         //
    const handleResetClick = useCalendarStore.getState().handleResetClick;

    // 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarIconRef.current && calendarIconRef.current.contains(event.target as Node)) {
                setShowCalendar(!showCalendar)
            } else if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setShowCalendar, showCalendar]);

    //          render: 캘린더 렌더링           //
    return (
        <>
            <Icon ref={calendarIconRef}>
                <DateFilter size={24} color={"#FFF"} />
            </Icon>
            <StyledCalendarWrapper ref={calendarRef} $show={showCalendar}>
                <StyledCalendar
                    value={date}
                    onChange={handleDateChange}
                    formatDay={(locale, date) => moment(date).format("D")}
                    formatYear={(locale, date) => moment(date).format("YYYY")}
                    formatMonthYear={(locale, date) => moment(date).format("YYYY.MM")}
                    calendarType="gregory"
                    showNeighboringMonth={false}
                    next2Label={null}
                    prev2Label={null}
                    minDetail="year"
                    // 오늘 날짜로 돌아오는 기능을 위해 필요한 옵션 설정
                    activeStartDate={
                        activeStartDate === null ? undefined : activeStartDate
                    }
                    onActiveStartDateChange={({ activeStartDate }) => {
                        console.log(activeStartDate);
                        setActiveStartDate(activeStartDate);
                    }}
                    // 오늘 날짜에 '오늘' 텍스트 삽입하고 출석한 날짜에 점 표시를 위한 설정
                    tileContent={({ date, view }) => {
                        let html = [];
                        if (
                            view === "month" &&
                            date.getMonth() === today.getMonth() &&
                            date.getDate() === today.getDate()
                        ) {
                        }
                        if (
                            attendDay.find((x) => x === moment(date).format("YYYY-MM-DD"))
                        ) {
                            html.push(<StyledDot key={moment(date).format("YYYY-MM-DD")} />);
                        }
                        return <>{html}</>;
                    }}
                />
                <StyledDate $show={showCalendar} onClick={handleTodayClick}>오늘</StyledDate>
                <StyledReset $show={showCalendar} onClick={handleResetClick}>초기화</StyledReset>
            </StyledCalendarWrapper>

        </>

    )
}

export default Calendar

const Icon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px 12px;
    margin-left: auto;
    border-radius: 8px;
    background: var(--orange);
`

const DateFilter = styled(FaRegCalendarAlt)`

`
