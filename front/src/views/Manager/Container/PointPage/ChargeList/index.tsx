import SearchFilter from './SearchFilter';
import Calendar from './Calendar';
import styled from 'styled-components';
import moment from 'moment';
import Card from './Card';
import { Value } from 'react-calendar/dist/cjs/shared/types';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { ResponseDto } from 'apis/response';
import { formattedDate } from 'constant';
import { useCalendarStore } from 'store';
import { usePointChargeListStore } from 'store/manager';
import { getPointChargeListRequest } from 'apis';
import { GetPointChargeListResponseDto } from 'apis/response/pointCharge';
import { useQuery } from '@tanstack/react-query';

//              component: 충전 내역 컴포넌트                   //
const ChargeList = () => {

    //              render: 충전 내역 렌더링                  //
    return (
        <ChargeListE>
            <FilterE />
            <CardBoxE />
        </ChargeListE>
    );
};
export default ChargeList;


//              subComponent: 포인트 충전 내역 필터 서브 컴포넌트               //
const FilterE = () => {

    //              subComponent: 주문 진행 서브컴포넌트                 //
    const StateE = ({ status }: { status: string }) => {
        //              state: 주문 진행 상태           //
        const select = usePointChargeListStore(state => state.status === status);
        return (
            <State $select={select} onClick={() => usePointChargeListStore.getState().setStatus(status)}>
                {status}
            </State>
        )
    }

    //              subComponent: 주문 날짜 서브컴포넌트                 //
    const SelectDateE = () => {
        //              state: 선택된 날짜 상태             //
        const date = useCalendarStore(state => state.date);
        return (<>{date instanceof Date && (<SelectDate>선택된 날짜: <div>{formattedDate(date)}</div></SelectDate>)}</>)
    }

    //              render: 포인트 충전 내역 필터 서브 렌더링               //
    return (
        <Filter>
            <SelectDateE />
            <States>
                <StateE status={"모두"} />
                <StateE status={"승인"} />
                <StateE status={"미승인"} />
                <StateE status={"거절"} />
            </States>
            <Calendar />
            <SearchFilter />
        </Filter>
    )
}


//              subComponent: 포인트 내역 카드 박스 서브컴포넌트                 //
const CardBoxE = () => {


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
    //          state: 데이터 END 상태               //
    const end = usePointChargeListStore.getState().end;

    //          function: 충전 내역 설정 함수               //
    const addChargeList = usePointChargeListStore.getState().addChargeList;
    //          function: 충전 내역 설정 함수               //
    const setStatus = usePointChargeListStore.getState().setStatus;
    //          function: 충전 내역 리셋 함수               //
    const resetChargeList = usePointChargeListStore.getState().resetChargeList;
    //          function: 로딩 상태 설정 함수               //
    const setIsLoading = usePointChargeListStore.getState().setIsLoading;
    //          function: 페이지 상태 설정 함수               //
    const setPage = usePointChargeListStore.getState().setPage;
    //          function: 데이터 END 설정 함수               //
    const setEnd = usePointChargeListStore.getState().setEnd;

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

    //          function: 충전 내역 불러와서 처리하는 함수          //
    const getPointChargeListResponse = (responseBody: GetPointChargeListResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMN') alert('존재하지 않는 메뉴입니다.');
        if (code !== 'SU') return;

        const { chargeList } = responseBody as GetPointChargeListResponseDto;
        addChargeList(chargeList);
        setIsLoading(false);
        if (chargeList.length < limit) { setEnd(true); }
    };


    //          function: 충전 내역 불러오는 함수            //
    const { data: chargeListQ, isSuccess } = useQuery<GetPointChargeListResponseDto>({
        queryKey: ['chargeListQ', page, limit, name, status, date],  // 의존성 배열에 상태를 추가하여 쿼리 실행
        queryFn: () => getPointChargeListRequest(cookies.managerToken, page, limit, name, status, formatValueToDate(date)!),
        staleTime: 1000 * 3, // 3초
    });


    //          effect: 데이터 성공적으로 불러왔을 때 처리          //
    useEffect(() => {
        resetChargeList(); // 기존 데이터 리셋
        setPage(0); // 페이지 번호를 0으로 초기화
        setEnd(false); // 끝 상태를 false로 초기화
        setIsLoading(true); // 로딩 상태를 true로 설정

        // 데이터 요청을 위한 새로운 API 호출
        // setIsLoading 상태 변경 후 바로 getOrderListRequest를 호출합니다.
    }, [name, status, date]); // name, status, date가 변경될 때마다 실행됩니다.

    //          effect: 데이터 불러오기 성공 시 처리          //
    useEffect(() => {
        if (isSuccess && chargeListQ) {
            getPointChargeListResponse(chargeListQ);
        }
    }, [isSuccess, chargeListQ]);


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
    //          effect: 마운트 될때만 실행되는 이펙트             //
    useEffect(() => () => { setStatus("모두"); setPage(0); setEnd(false); }, [setStatus, setPage, setEnd]);



    //              render: 포인트 내역 카드 박스 렌더링                 //
    return (
        <CardBox onScroll={handleScroll}>
            {chargeList.map((item) => (
                <Card key={item.pointChargeId} chargeDetail={item} />
            ))}
            {!end && isLoading && <Message>Loading...</Message>}
            {end && <Message>--- 더이상 데이터 없음 ---</Message>}
        </CardBox>
    );
}


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
    width: 100%;
    color: var(--copperRed);
    text-align: end;
`

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
    align-items: center;
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


const Message = styled.div`
    padding: 24px;
    color: var(--copperBrown);
`