import Card from './Card'
import styled from 'styled-components'
import Calendar from "./Calendar";
import SearchFilter from './SearchFilter'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { ResponseDto } from 'apis/response'
import useCalendarStore from 'store/calendar.store'
import { formattedDate } from 'constant'
import useOrderListPageStore from 'store/manager/order-list.store'
import { getOrderListRequest } from 'apis'
import { GetOrderListResponseDto } from 'apis/response/order'
import 'react-calendar/dist/Calendar.css';  // 기본 스타일
import { Value } from 'react-calendar/dist/cjs/shared/types';
import moment from 'moment';


//          component: 주문 목록 컴포넌트          //
const OrderList = () => {

    //          state: 선택된 날짜 상태         //
    const date = useCalendarStore(state => state.date);
    //          state: 끝 상태            //
    const end = useOrderListPageStore(state => state.end);
    //          state: 주문 진행 상태           //
    const status = useOrderListPageStore(state => state.status);
    //          state: 쿠키 상태            //
    const [cookies] = useCookies(['managerToken'])
    //          state: 주문들의 상태          //
    const orders = useOrderListPageStore(state => state.orders);
    //          state: 페이지와 로딩 상태 관리         //
    const isLoading = useOrderListPageStore.getState().isLoading;
    //          state: 페이지 상태 관리         //
    const page = useOrderListPageStore(state => state.page);
    //          state: 페이지당 제한한 수          //
    const limit = useOrderListPageStore.getState().limited;
    //          state: 주문자 이름 상태         //
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
    const setOrders = useOrderListPageStore.getState().setOrders;
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

        setOrders(orders);
        if (orders.length !== 0) {
            setIsLoading(false);
        } else {
            setEnd(true);
        }
    }

    //          function: 주문 목록 불러오는 함수          //
    const getOrderList = () => {

        getOrderListRequest(cookies.managerToken, page, limit, name, status, formatValueToDate(date)!).then(getOrderListResponse).then(() => setIsLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };


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

    //          function: 상태태 클릭 이벤트 핸드러               //
    const onStatusClickHandler = (status: string) => {
        setStatus(status);
        setEnd(false);
        setPage(0);
    }

    //          function: 캘린더 데이터를 설정하는 함수             //
    const { setDate, setActiveStartDate, setShowCalendar } = useCalendarStore.getState();

    //          effect: 이름, 상태, 날짜가 변경되면 페이지 리셋하고 다시 불러오기       //
    useEffect(() => {
        setPage(0);
        resetOrders();
        getOrderList();
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, status, date]);

    //          effect: 이름, 상태, 날짜가 변경되면 페이지 리셋하고 다시 불러오기       //
    useEffect(() => {
        if (page === 0) {
            return;
        } else {
            getOrderList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

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
    useEffect(() => () => {setStatus("모두"); setPage(0);setEnd(false);}, [setStatus, setPage, setEnd]);


    //              render: 주문 목록 렌더링               //
    return (
        <OrderListE>
            <Filter>
                {date instanceof Date && <SelectDate>선택된 날짜: <div>{formattedDate(date)}</div></SelectDate>}
                <ButtonFilter>
                    <State $select={status === "모두"} onClick={() => onStatusClickHandler("모두")}>모두</State>
                    <State $select={status === "대기"} onClick={() => onStatusClickHandler("대기")}>대기</State>
                    <State $select={status === "완료"} onClick={() => onStatusClickHandler("완료")}>완료</State>
                    <State $select={status === "환불"} onClick={() => onStatusClickHandler("환불")}>환불</State>
                    <Calendar />
                </ButtonFilter>
                <SearchFilter />
            </Filter>
            <CardBox onScroll={handleScroll}>
                {orders.map((order) => (
                    <Card key={order.orderId} order={order} />
                ))}
                {!end && isLoading && <div>Loading...</div>}
                {end && <div>끝</div>}
            </CardBox>
        </OrderListE>
    )
}

export default OrderList;


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
