import styled from "styled-components";
import { memo, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { ResponseDto } from "apis/response";
import { getOrderManagementRequest, patchOrderApproveRequest } from "apis";
import { GetOrderManagementResponseDto, PatchOrderApproveResponseDto } from "apis/response/order";
import useOrderManagementStore from "store/manager/order-management.store";
import { PatchOrderApproveRequestDto } from "apis/request/order";
import { OrderDetail, OrderManagement } from "types/interface";
import { isEqual } from "lodash";
import { defaultUserImage } from "constant";


//          component: 주문 페이지 컴포넌트             //
const OrderManageMent = () => {

    //          render: 주문 페이지 렌더링             //
    return (
        <Page>
            <BadgeBox />
            <OrderBoard />
            <OrderSummaryBox />
        </Page>
    );
};

//          component: 주문 뱃지 박스 컴포넌트               //
const BadgeBox = memo(() => {

    //          state: 쿠키 상태                //
    const [cookies,] = useCookies();
    //          state: 주문 데이터 갯수 상태         //
    const length = useOrderManagementStore(state => state.orders?.length);
    //          state: 주문 데이터 갯수 상태         //
    const orders = useOrderManagementStore(state => state.orders);
    //          state: 보여질 주문 데이터 설정 상태         //
    const showOrder = useOrderManagementStore.getState().showOrder;

    //          function: 주문들 데이터 설정 상태         //
    const setOrders = useOrderManagementStore(state => state.setOrders);
    //          function: 보여질 주문 데이터 설정 상태         //
    const setShowOrder = useOrderManagementStore(state => state.setShowOrder);
    //          function: 주문 데이터 처리 함수            //
    const getOrderManagementResponse = (responseBody: GetOrderManagementResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMN') alert('존재하지 않는 메뉴입니다.');
        if (code !== 'SU') return;
        const { orders } = responseBody as GetOrderManagementResponseDto;
        setOrders(orders)
        if (!showOrder) {
            setShowOrder(orders[0])
        }
    }
    //          function: 주문 뱃지 데이터 가져오는 함수           //
    const orderBadge = () => {
        if (!cookies.managerToken) return;
        getOrderManagementRequest(cookies.managerToken).then(getOrderManagementResponse)
    }

    //          effect: 처음 렌더링시 화면에 주문 상태 보여줌           //
    useEffect(() => {
        orderBadge()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [length]);

    //          render: 주문 뱃지 박스 렌더링            //
    return (
        <>
            {orders!.length > 0 ?
                <WaitingBoxE>
                    {orders!.map((order) => (
                        <Badge key={order.orderId} order={order} /> // id 또는 고유 값 사용
                    ))}
                </WaitingBoxE>
                :
                <NoWaiting> 주문 없음 </NoWaiting>
            }
        </>
    )
})

//          component: 주문 뱃지 컴포넌트           //
const Badge = memo(({ order }: { order: OrderManagement }) => {

    //          state: 보여질 주문 데이터 설정 상태         //
    const selected = useOrderManagementStore(state => state.showOrder?.orderId === order.orderId);
    //          state: 프로필필 상태         //
    const profileImage = order.profileImage !== null ? order.profileImage : defaultUserImage;
    //          state: 포지션 상태          //
    const position = () => {
        if (order.position === null && order.office === null) {
            return '';
        } else if (order.position === null && order.office !== null) {
            return '단체';
        } else {
            return `${order.position} / ${order.office}`;
        }
    };


    //          function: 보여질 주문 데이터 설정 상태         //
    const setShowOrder = useOrderManagementStore(state => state.setShowOrder);



    //          render: 주문 뱃지 렌더링            //
    return (
        <BadgeE onClick={() => setShowOrder(order)} $select={selected}>
            <BadgeLeft>
                <ProfileImage src={profileImage} />
                <UserInfo>
                    <NameE>{order.name}</NameE>
                    {order.position !== null &&
                        <Position>{position()}</Position>
                    }
                </UserInfo>
            </BadgeLeft>
            <BadgeRight>
                <PayMethod>{order.payMethod}</PayMethod>
                <Tem>🔥{order.hotCount} / 🧊{order.coldCount}</Tem>
            </BadgeRight>
        </BadgeE>
    )
}, (prevProps, nextProps) => {
    // name, image, price, quantity, tem 프롭에 대해 깊은 비교
    return (
        isEqual(prevProps.order, nextProps.order)
    );
});



//          component: 주문 카드 컴포넌트           //
const OrderBoard = () => {


    //          state: 주문 데이터 상태         //
    const showOrder = useOrderManagementStore(state => state.showOrder);
    //          state: 주문 데이터 상태         //
    const show = useOrderManagementStore(state => state.orders?.length === 0);


    //          render: 주문 카드 렌더링            //
    return (
        <OrderBoardE $show={show}>
            {showOrder && showOrder.orderDetails && showOrder.orderDetails.map((item) => (
                <OrderCard key={item.orderDetailId} item={item} />
            ))}
        </OrderBoardE>
    );
}

//          component: 주문 카드 컴포넌트               //
const OrderCard = memo(({ item }: { item: OrderDetail }) => {

    //          state: 주문 체크 상태           //
    const [check, setCheck] = useState<boolean>(false);

    const CardInfoBox = () => {
        return <>
            <Left>
                <MenuName>{item.name}</MenuName>
                <Options>
                    {item.options &&
                        item.options
                            .filter((option) => option.quantity > 0 && option.detail !== '보통' && option.detail !== '보통컵') // 필터링
                            .sort((a, b) => a.sequence - b.sequence) // sequence 값을 기준으로 오름차순 정렬
                            .map((option) => (
                                <OptionBadge key={option.id} type={option.detail}>
                                    {option.category === "시럽" ? <>{option.detail + " " + option.quantity}</> : <> {option.detail} </>}
                                </OptionBadge>
                            ))}
                </Options>
            </Left>
            <Right>
                <MenuQuantity>
                    <div>{item.quantity}</div>
                    <div style={{ fontSize: 18 }}>잔</div>
                </MenuQuantity>
                <MenuImage src={item.image} />
            </Right>
        </>
    }

    //          render: 주문 카드 렌더링               //
    return (
        <OrderCardE $check={check} onClick={() => setCheck(!check)}>
            <CardInfoBox />
        </OrderCardE>
    )
})




//          component: 주문 요약 박스 컴포넌트          //
const OrderSummaryBox = () => {

    //          state: 주문 데이터 상태         //
    const show = useOrderManagementStore(state => state.orders?.length !== 0);
    const Total = () => {
        return <>{useOrderManagementStore(state => state.showOrder?.totalQuantity ? `총: ${state.showOrder?.totalQuantity!}잔` : '')}</>
    }
    //          state: 보여지는 주문 상태           //
    const order = useOrderManagementStore(state => state.showOrder!);
    //          state: 프로필필 상태         //
    const profileImage = order && order.profileImage ? order.profileImage : defaultUserImage;

    //          state: 포지션 상태          //
    const position = () => {
        if (order.position === null && order.office === null) {
            return '';
        } else if (order.position === null && order.office !== null) {
            return '단체';
        } else {
            return `${order.position} / ${order.office}`;
        }
    };

    //          render: 주문 요약 박스 렌더링               //
    return (
        <OrderInfoBox>
            {show &&
                <>
                    <SummaryLeft>
                        <ProfileImage src={profileImage!} />
                        <UserInfo>
                            <NameE>{order.name}</NameE>
                            {order.position !== null &&
                                <Position>{position()}</Position>
                            }
                        </UserInfo>
                    </SummaryLeft>
                    <SummaryRight>
                        <TotalQuantity><Total /></TotalQuantity>
                        <CompletedButton />
                    </SummaryRight>
                </>
            }
        </OrderInfoBox>
    )
}

//          component: 주문 완료 버튼               //
const CompletedButton = () => {

    //          state: 쿠키 상태            //
    const [cookies,] = useCookies(['managerToken']);

    //          state: 보여진 주문 Id 상태              //
    const orderId = useOrderManagementStore(state => state.showOrder?.orderId)
    //          state: 보여진 주문 Id 상태              //
    const orders = useOrderManagementStore.getState().orders

    //          function: 주문들 데이터 설정 상태         //
    const removeOrderById = useOrderManagementStore.getState().removeOrderById;
    //          function: 보여질 주문 데이터 설정         //
    const setShowOrder = useOrderManagementStore.getState().setShowOrder;
    //          function: 주문 완료 처리 이후 함수          //
    const patchOrderApproveResponse = (responseBody: PatchOrderApproveResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMN') alert('존재하지 않는 메뉴입니다.');
        if (code === 'NMG') alert('관리자 토큰이 만료되었습니다.');
        if (code !== 'SU') return;
        removeOrderById(orderId!);

        //  주문이 완료되고 선택될 주문 설정
        if (orders![0].orderId === orderId!) {
            setShowOrder(orders![1])
        } else {
            setShowOrder(orders![0])
        }
    }


    //          function: 주문 완료 처리하는 함수           //
    const orderCompleted = () => {
        if (!cookies.managerToken) return;
        const requestBody: PatchOrderApproveRequestDto = { orderId: orderId! }
        patchOrderApproveRequest(requestBody, cookies.managerToken).then(patchOrderApproveResponse)
    }

    //          render: 주문 완료 버튼          //
    return (
        <CompletedButtonE onClick={orderCompleted}>
            완료
        </CompletedButtonE>
    )
}



export default memo(OrderManageMent);

const Page = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 12px 0 8px 0;
    gap: 12px;
    box-sizing: border-box;
`

const WaitingBoxE = styled.div`
    display: flex;
    width: 100%;
    overflow-y: scroll;
    scrollbar-width: none;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scroll-padding-left: 14px;
    scroll-snap-align: start;
    &::-webkit-scrollbar {
    display: none;
  }
`

const NoWaiting = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--copperBrown);
    width: 100%;
    height: 72px;
    font-size: 32px;
`


const BadgeE = styled.div<{ $select: boolean }>`
    flex-shrink: 0;
    position: relative;
    display: flex;
    padding: 8px 10px;
    margin-left: 12px;
    gap: 12px;
    box-sizing: border-box;
    border-radius: 8px;
    /* border: 1px solid #FFB9B9; */
    background: #FFF;
    border: 2px solid ${({ $select }) => $select ? "var(--coralPink)" : "var(--sunsetPeach)"} ;
`

const BadgeLeft = styled.div`
    display: flex;
    gap: 6px;
`

const ProfileImage = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 6px;
`

const UserInfo = styled.div`
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: center;
    gap:3px;
`
const NameE = styled.div`
    font-size: 16px;
    color: var(--copperBrown);
`

const Position = styled.div`
    color: var(--copperBrown);
    font-size: 10px;
`

const BadgeRight = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const PayMethod = styled.div`
    display: flex;
    padding: 2px 4px;
    align-self: self-end;
    border-radius: 2px;
    background: var(--orange);
    color: #FFF;
    font-size: 10px;
`
const Tem = styled.div`
    color: var(--copperRed);
    font-size: 14px;
`


const OrderBoardE = styled.div<{ $show: boolean }>`
    position: relative;
    flex: 1;
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 기본적으로 3열로 정렬 */
    align-content: start;
    width: calc(100% - 24px);
    border-radius: 12px;
    padding: 12px;
    gap: 12px;
    box-sizing: border-box;
    overflow-y: scroll;
    scrollbar-width: none;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scroll-padding-left: 14px;
    scroll-snap-align: start;
    &::-webkit-scrollbar {
    display: none;
    }

    border-radius: 16px;
    background-color: var(--lightCream);
    background-position: 50%;
    background-size: 140%;

    @media (max-width: 846px) {
        grid-template-columns: repeat(2, 1fr); /* 846px 이하에서는 2열로 정렬 */
    }

    @media (max-width: 564px) {
        grid-template-columns: 1fr; /* 564px 이하에서는 1열로 정렬 */
    }


    ${({ $show }) => $show ? `
    background-image: url(https://i.pinimg.com/originals/8c/5c/cb/8c5ccb49470c3344e48f18315fa568a6.gif);
    &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 14px;
    box-shadow: 0px 0px 8px 0px var(--copperBrown);
    background-color: rgba(255, 245, 238, 0.95);`: ""}
`

const OrderCardE = styled.div<{ $check: boolean }>`
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 12px;
    gap: 4px;
    border-radius: 8px;
    outline: 2px solid var(--caramelBrown);
    box-sizing: border-box;
    background: #fff; 
    box-shadow: 5px 5px 5px 0px rgba(216, 111, 77, 0.25);


    ${({ $check }) => $check && `
        &::after{
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 6px;
        content: "";
        width: 100%;
        height: 100%;
        background-color: rgba(43, 25, 13, 0.329); 
    }`}

`

const Left = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    padding-top: 4px;
    gap: 4px;
`

const MenuName = styled.div`
    color: var(--brickOrange);
`

const Options = styled.div`
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    column-gap: 2px;
    row-gap: 1px;
`

const OptionBadge = styled.div<{ type: string }>`
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2px 4px;
    font-size: 12px;
    white-space: nowrap;
    color: #FFF;
    border-radius: 5px;
    background-color:${({ type }) => {
        switch (type) {
            case '뜨거움':
                return 'var(--hot)';
            case '덜~뜨거움':
                return 'var(--hot)';
            case '얼음적게':
                return 'var(--cold)';
            case '얼음많이':
                return 'var(--cold)';
            default:
                return 'var(--orange)'; // 기본값을 설정 (옵션)
        }
    }};
`

const Right = styled.div`
    display: flex;
    align-items: center;
    gap:12px;
`
const MenuImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 6px;
`

const MenuQuantity = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    gap: 2px;
    font-size: 20px;
    border-radius: 6px;
    border: 1.5px solid var(--orange);
    box-sizing: border-box;
    background: #FFF;
    color: var(--copperBrown);
`


const OrderInfoBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    align-items: center;
    width: calc(100% - 24px - 24px);
    padding: 10px;
    margin-bottom: 8px;
    color: var(--amberBrown);
    border-radius: 8px;
    border: 1px solid #FFCFBB;
    background: #FFF;
`

const SummaryLeft = styled.div`
    display: flex;
    gap: 6px;
`
const SummaryRight = styled.div`
    display: flex;
    gap: 12px;
`
const TotalQuantity = styled.div`
    display: flex;
    padding: 8px 8px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    border: 1px solid var(--orange, #FC8D08);
    background: #FFF;

    color: var(--copperBrown);
    font-size: 18px;
`

const CompletedButtonE = styled.div`
    display: flex;
    padding: 8px 20px;
    color: #FFF;
    font-size: 20px;
    border-radius: 4px;
    background: var(--orange);
`

