import styled from 'styled-components';
import { formattedDate } from 'constant';
import SearchFilter from './SearchFilter';
import { useEffect } from 'react';
import Calendar from './Calendar';
import useCalendarStore from 'store/calendar.store';
import { useCookies } from 'react-cookie';
import { Value } from 'react-calendar/dist/cjs/shared/types';
import moment from 'moment';
import { GetPointChargeListResponseDto } from 'apis/response/pointCharge';
import { ResponseDto } from 'apis/response';
import usePointChargeListStore from 'store/manager/point-charge-list.store';
import { getPointChargeListRequest } from 'apis';
import Card from './Card';

//              component: 충전 내역 컴포넌트                   //
const ChargeList = () => {

    //          state: 선택된 날짜 상태         //
    const date = useCalendarStore(state => state.date);
    //              state: 충전 상황 상태               //
    const status = usePointChargeListStore(state => state.status);
    //          state: 쿠키 상태            //
    const [cookies] = useCookies(['managerToken']);
    //          state: 충전 내역 상태               //
    const chargeList = usePointChargeListStore(state => state.chargeList); // 빈 배열로 초기화
    //          state: 페이지와 로딩 상태 관리         //
    const isLoading = usePointChargeListStore.getState().isLoading;
    //          state: 페이지 상태태               //
    const page = usePointChargeListStore(state => state.page);
    //          state: 페이지당 제한한 수          //
    const limit = usePointChargeListStore.getState().limited;
    //          state: 주문자 이름 상태         //
    const name = usePointChargeListStore(state => state.name);

    //          function: 충전 내역 설정 함수               //
    const setChargeList = usePointChargeListStore.getState().setChargeList;
    //          function: 충전 내역 설정 함수               //
    const setStatus = usePointChargeListStore.getState().setStatus;
    //          function: 충전 내역 리셋 함수               //
    const resetChargeList = usePointChargeListStore.getState().resetChargeList;
    //          function: 로딩 상태 설정 함수               //
    const setIsLoading = usePointChargeListStore.getState().setIsLoading;
    //          function: 페이지 상태 설정 함수               //
    const setPage = usePointChargeListStore.getState().setPage;

    //          function: 날짜로 변형해주는 함수                //
    const formatValueToDate = (value: Value): string | null => {
        if (value === null) return null;
        const date = Array.isArray(value) ? value[0] : value;
        return date ? moment(date).format("YYYY-MM-DD") : null;
    };

    //          function: 스크롤 이벤트 핸들러          //
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        // 조건: 충전 내역이 없거나 이미 로딩 중인 경우 중단
        if (chargeList.length === 0 || isLoading) return;
        // 스크롤이 하단에 도달했을 때
        if (scrollTop + clientHeight >= scrollHeight - 1) {
            setPage(page + 1);
        }
    };

    //          function: 캘린더 데이터를 설정하는 함수             //
    const { setDate, setActiveStartDate, setShowCalendar } = useCalendarStore.getState();

    //          function: 주문 목록 불러와서 처리하는 함수          //
    const getPointChargeListResponse = (responseBody: GetPointChargeListResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMN') alert('존재하지 않는 메뉴입니다.');
        if (code !== 'SU') return;

        const { chargeList } = responseBody as GetPointChargeListResponseDto;
        setChargeList(chargeList);
        setIsLoading(false);
    };

    //          function: 충전전 목록 불러오는 함수          //
    const getChargeList = async () => {
        try {
            // 로딩 시작
            setIsLoading(true);
    
            // 데이터 요청
            const responseBody = await getPointChargeListRequest(
                cookies.managerToken,
                page,
                limit,
                name,
                status,
                formatValueToDate(date)!
            );
            // 응답 처리
            getPointChargeListResponse(responseBody);
        } catch (error) {
            console.error("Error fetching charge list:", error);
            alert("충전 내역을 불러오는 중 오류가 발생했습니다.");
        } finally {
            // 로딩 종료
            setIsLoading(false);
        }
    };

    //          effect: 이름, 상태, 날짜가 변경되면 페이지 리셋하고 다시 불러오기       //
    useEffect(() => {
        setPage(0);
        resetChargeList();
        getChargeList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, status, date]);

    //          effect: 이름, 상태, 날짜가 변경되면 페이지 리셋하고 다시 불러오기       //
    useEffect(() => {
        if (page === 0) return; // 페이지가 0일 때는 호출하지 않음
        getChargeList(); // 충전 내역 불러오기
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    //          effect: 언마운트 될때만 실행되는 이펙트             //
    useEffect(() => {
        return () => {
            setDate(null);
            setActiveStartDate(new Date());
            setShowCalendar(false);
            setStatus("모두")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //              render: 충전 내역 렌더링                  //
    return (
        <ChargeListE>
            {date instanceof Date && <SelectDate>선택된 날짜: <div>{formattedDate(date)}</div></SelectDate>}
            <Filter>
                <States>
                    <State $select={status === "모두"} onClick={() => setStatus("모두")}>모두</State>
                    <State $select={status === "승인"} onClick={() => setStatus("승인")}>승인</State>
                    <State $select={status === "미승인"} onClick={() => setStatus("미승인")}>미승인</State>
                    <State $select={status === "거절"} onClick={() => setStatus("거절")}>거절</State>
                </States>
                <Calendar />
            </Filter>
            <SearchFilter />
            <CardBox onScroll={handleScroll}>
                {isLoading ? (
                    <LoadingMessage>Loading...</LoadingMessage>
                ) : chargeList.length > 0 ? (
                    chargeList.map((item) => (
                        <>
                        <Card key={item.pointChargeId} chargeDetail={item} />
                        </>
                    ))
                ) : (
                    <NoDataMessage>내역이 없습니다.</NoDataMessage>
                )}
            </CardBox>
        </ChargeListE>
    );
};
export default ChargeList;

const ChargeListE = styled.div`
    display: flex;
    flex-direction: column;
    width: 320px;
    height: 100%;
    gap: 8px;
    padding-top: 18px;
    margin: 0 auto;
    box-sizing: border-box;
`;

const SelectDate = styled.div`
    display: flex;
    justify-content: space-between;
    color: var(--copperRed);
    text-align: end;
`;

const Filter = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    row-gap: 8px;
`;

const States = styled.div`
    flex-shrink: 0;
    display: flex;
    gap: 10px;
`;

const State = styled.div<{ $select: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 16px;
    ${({ $select }) => $select ? `
        color: #FFF;
        background: var(--orange);
    ` : `
        color: var(--copperBrown);
        background: #FFF;
    `}
`;

const CardBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    width: 100%;
    min-height: 10px;
    height: 100%;
    gap: 2px;
    padding-bottom: 18px;
    border-radius: 8px;
    overflow: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        display: none;
    }
`;

const LoadingMessage = styled.div`
    padding: 36px 0;
    text-align: center;
    color: var(--copperBrown);
`;

const NoDataMessage = styled.div`
    padding: 36px 0;
    text-align: center;
    color: var(--copperBrown);
`;
