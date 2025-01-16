import Card from './Card'
import moment from 'moment';
import styled from 'styled-components'
import Calendar from "./Calendar";
import { Value } from 'react-calendar/dist/cjs/shared/types';
import SearchFilter from './SearchFilter'
import { useQuery } from '@tanstack/react-query';
import { memo, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { ResponseDto } from 'apis/response'
import { formattedDate } from 'constant'
import { useCalendarStore } from 'store';
import { getOrderListRequest } from 'apis'
import { useOrderListPageStore } from 'store/manager';
import { GetOrderListResponseDto } from 'apis/response/order'
import 'react-calendar/dist/Calendar.css';  // 기본 스타일


//              component: 주문 목록 컴포넌트               //
const OrderList = () => {


    //              render: 주문 목록 렌더링                //
    return (
        <OrderListE>
            <FilterE />
            <CardBoxE />
        </OrderListE>
    );
}
export default memo(OrderList);

//              subComponent: 필터 서브 컴포넌트                //
const FilterE = () => {

    //              function: 상태 클릭 이벤트 핸드러               //
    const onStatusClickHandler = (status: string) => {
        const setEnd = useOrderListPageStore.getState().setEnd;
        const setPage = useOrderListPageStore.getState().setPage;
        const setStatus = useOrderListPageStore.getState().setStatus;
        setStatus(status);
        setEnd(false);
        setPage(0);
    }

    //              subComponent: 주문 진행 서브컴포넌트                 //
    const StateE = ({ status }: { status: string }) => {
        //              state: 주문 진행 상태           //
        const select = useOrderListPageStore(state => state.status === status);
        return (
            <State $select={select} onClick={() => onStatusClickHandler(status)}>
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
    //              render: 주문 필터 렌더링                //
    return (
        <Filter>
            <SelectDateE />
            <ButtonFilter>
                <StateE status={"모두"} />
                <StateE status={"대기"} />
                <StateE status={"완료"} />
                <StateE status={"환불"} />
                <Calendar />
            </ButtonFilter>
            <SearchFilter />
        </Filter>
    )
}

//              subComponent: 주문 카드 박스 서브컴포넌트                 //
const CardBoxE = () => {

    //              state: 선택된 날짜 상태         //
    const date = useCalendarStore(state => state.date);
    //              state: 끝 상태            //
    const end = useOrderListPageStore(state => state.end);
    //              state: 주문 진행 상태           //
    const status = useOrderListPageStore(state => state.status);
    //              state: 쿠키 상태            //
    const [cookies] = useCookies(['managerToken'])
    //              state: 주문들의 상태          //
    const orders = useOrderListPageStore(state => state.orders);
    //              state: 페이지와 로딩 상태 관리         //
    const isLoading = useOrderListPageStore.getState().isLoading;
    //              state: 페이지 상태 관리         //
    const page = useOrderListPageStore(state => state.page);
    //              state: 페이지당 제한한 수          //
    const limit = useOrderListPageStore.getState().limited;
    //              state: 주문자 이름 상태         //
    const name = useOrderListPageStore(state => state.name);


    //          function: 날짜로 변형해주는 함수                //
    const formatValueToDate = (value: Value): string | null => {
        if (value === null) return null;
        const date = Array.isArray(value) ? value[0] : value;
        return date ? moment(date).format("YYYY-MM-DD") : null;
    };


    //          function: 주문 목록 전역함수                //
    const setEnd = useOrderListPageStore.getState().setEnd;
    const setPage = useOrderListPageStore.getState().setPage;
    const setStatus = useOrderListPageStore.getState().setStatus;
    const addOrders = useOrderListPageStore.getState().addOrders;
    const resetOrders = useOrderListPageStore.getState().resetOrders;
    const setIsLoading = useOrderListPageStore.getState().setIsLoading;

    //          function: 주문 목록 불러와서 처리하는 함수          //
    const getOrderListResponse = (responseBody: GetOrderListResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMN') alert('존재하지 않는 메뉴입니다.');
        if (code !== 'SU') return;

        const { orders } = responseBody as GetOrderListResponseDto;
        addOrders(orders);
        setIsLoading(false);
        if (orders.length < limit) { setEnd(true); }
    }

    //          function: 주문 목록 불러오는 함수            //
    const { data: orderListQ, isSuccess } = useQuery<GetOrderListResponseDto>({
        queryKey: ['orderListQ', status, name, date, page],  // 의존성 배열에 상태를 추가하여 쿼리 실행
        queryFn: () => getOrderListRequest(cookies.managerToken, page, limit, name, status, formatValueToDate(date)!),
        staleTime: 1000 * 3, // 3초
    });



    //          effect: 데이터 성공적으로 불러왔을 때 처리          //
    useEffect(() => {
        //          주문자 이름, 상태, 날짜가 변경될 때마다 기존 주문을 리셋하고 새로 데이터를 요청합니다.
        resetOrders(); // 기존 주문 목록을 리셋
        setPage(0); // 페이지 번호를 0으로 초기화
        setEnd(false); // 끝 상태를 false로 초기화
        setIsLoading(true); // 로딩 상태를 true로 설정

        // 데이터 요청을 위한 새로운 API 호출
        // setIsLoading 상태 변경 후 바로 getOrderListRequest를 호출합니다.
    }, [name, status, date]); // name, status, date가 변경될 때마다 실행됩니다.

    //          effect: 데이터 불러오기 성공 시 처리          //
    useEffect(() => {
        if (isSuccess && orderListQ) {
            getOrderListResponse(orderListQ);
        }
    }, [isSuccess, orderListQ]);

    //          function: 스크롤 이벤트 핸들러          //
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (orders.length === 0) return;
        if (isLoading) return;
        if (scrollTop + clientHeight >= scrollHeight - 1 && !isLoading) {
            setIsLoading(true);
            setPage(page + 1)
        }
    };


    //          function: 캘린더 데이터를 설정하는 함수             //
    const { setDate, setActiveStartDate, setShowCalendar } = useCalendarStore.getState();


    //          effect: 언마운트 될때만 실행되는 이펙트             //
    useEffect(() => {
        // 컴포넌트가 마운트 될 때 실행될 코드

        return () => {
            // 컴포넌트가 언마운트 될 때 실행될 코드
            // 상태 초기화 로직
            setDate(null); // 날짜를 null로 설정
            setActiveStartDate(new Date()); // activeStartDate를 현재 날짜로 설정
            setShowCalendar(false); // 캘린더 표시 여부를 false로 설정
            setStatus("모두")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 빈 배열을 전달하여 컴포넌트가 언마운트될 때만 실행되도록 함

    //          effect: 언마운트 될때만 실행되는 이펙트             //
    useEffect(() => () => { setStatus("모두"); setPage(0); setEnd(false); }, [setStatus, setPage, setEnd]);

    //          render: 주문 카드 박스 렌더링               //
    return (
        <CardBox onScroll={handleScroll}>
            {orders.map((order) => (
                <Card key={order.orderId} order={order} />
            ))}
            {!end && isLoading && <Message>Loading...</Message>}
            {end && <Message>--- 더이상 데이터 없음 ---</Message>}
        </CardBox>
    );
}


const OrderListE = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 320px;
    height: 100%;
    gap: 12px;
    padding-top: 18px;
    margin: 0 auto;
    box-sizing: border-box;
`

const Filter = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 8px;
`

const ButtonFilter = styled.div`
    display: flex;
    width: 100%;
    gap: 8px;
    flex-wrap: wrap;
`

const SelectDate = styled.div`
    display: flex;
    justify-content: space-between;
    color: var(--copperRed);
    text-align: end;
`

const State = styled.div<{ $select: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 16px;
    ${({ $select }) => $select ?
        `
        color: #FFF;
        background: var(--orange);
        `: `
        color: var(--copperBrown);
        background: #FFF;
        `
    }

`

const CardBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    width: 100%;
    min-height: 10px;
    height: 100%;
    gap: 12px;
    padding-bottom: 18px;
    border-radius: 8px;
    overflow: scroll;
    scrollbar-width: none;           /* Firefox */
    -ms-overflow-style: none; 
    &::-webkit-scrollbar {              // 크롬
    display: none;
    }
`

const Message = styled.div`
    padding: 24px;
    color: var(--copperBrown);
`