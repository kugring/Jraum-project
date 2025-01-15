import styled from "styled-components";
import { isEqual } from "lodash";
import { useCookies } from "react-cookie";
import { ResponseDto } from "apis/response";
import { defaultUserImage } from "constant";
import { useWebSocketStore } from "store";
import { useBlackModalStore } from "store/modal";
import { useOrderManagementStore } from "store/manager";
import { memo, useEffect, useState } from "react";
import { PatchOrderApproveRequestDto } from "apis/request/order";
import { OrderDetail, OrderManagement } from "types/interface";
import { getOrderManagementRequest, patchOrderApproveRequest } from "apis";
import { GetOrderManagementResponseDto, PatchOrderApproveResponseDto } from "apis/response/order";
import { useQuery } from "@tanstack/react-query";

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
    const { data: ordersQ, isFetching, isSuccess } = useQuery<GetOrderManagementResponseDto>({
        queryKey: ['orderManagement', orders],
        queryFn: () => getOrderManagementRequest(cookies.managerToken),
        staleTime: 1000 * 3, // 3초
        notifyOnChangeProps: ['data'] // 'data' 필드가 변경될 때만 리렌더링        
    });

    //          effect: 처음 렌더링시 화면에 주문 상태 보여줌           //
    useEffect(() => {
        // ordersQ가 변경될 때만 호출
        if (isSuccess && ordersQ) {
            getOrderManagementResponse(ordersQ);
        }
    }, [ordersQ, isSuccess, orders]);


    //          render: 주문 뱃지 박스 렌더링            //
    return (
        <>
            {orders && orders.length > 0 ? (
                <WaitingBoxE>
                    {orders.map((order) => (
                        <Badge key={order.orderId} order={order} />
                    ))}
                </WaitingBoxE>
            ) : (
                <NoWaiting>
                    {isSuccess ? '주문 없음' : '로딩중...'}
                </NoWaiting>
            )}
        </>
    )
})

//          component: 주문 뱃지 컴포넌트           //
const Badge = memo(({ order }: { order: OrderManagement }) => {
    //          state: 보여질 주문 데이터 설정 상태         //
    const selected = useOrderManagementStore(state => state.showOrder?.orderId === order.orderId);

    //          state: 프로필 상태         //
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

    // BadgeLeft 컴포넌트
    const BadgeLeftE = memo(({ profileImage, name, position }: { profileImage: string, name: string, position: string }) => (
        <BadgeLeft>
            <ProfileImageE src={profileImage} />
            <UserInfo>
                <NameE>{name}</NameE>
                {position && <PositionE>{position}</PositionE>}
            </UserInfo>
        </BadgeLeft>
    ));

    // BadgeRight 컴포넌트
    const BadgeRightE = memo(({ payMethod, hotCount, coldCount }: { payMethod: string, hotCount: number, coldCount: number }) => (
        <BadgeRight>
            <PayMethod>{payMethod}</PayMethod>
            <Tem>🔥{hotCount} / 🧊{coldCount}</Tem>
        </BadgeRight>
    ));

    //          render: 주문 뱃지 렌더링            //
    return (
        <BadgeE onClick={() => setShowOrder(order)} $select={selected}>
            <BadgeLeftE
                profileImage={profileImage}
                name={order.name}
                position={position()}
            />
            <BadgeRightE
                payMethod={order.payMethod}
                hotCount={order.hotCount}
                coldCount={order.coldCount}
            />
        </BadgeE>
    );
}, (prevProps, nextProps) => isEqual(prevProps.order, nextProps.order));



//          component: 주문 보드 컴포넌트           //
const OrderBoard = () => {


    //          state: 주문 데이터 상태         //
    const showOrder = useOrderManagementStore(state => state.showOrder);
    //          state: 주문 데이터 상태         //
    const show = useOrderManagementStore(state => state.orders?.length !== 0);


    //          render: 주문 카드 렌더링            //
    return (
        <OrderBoardE $show={show}>
            {show && showOrder && showOrder.orderDetails && showOrder.orderDetails.map((item) => (
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
                            .filter((option) => option.quantity > 0 && (option.detail !== '보통' || option.category === "얼음") && option.detail !== '보통컵') // 필터링
                            .sort((a, b) => a.sequence - b.sequence) // sequence 값을 기준으로 오름차순 정렬
                            .map((option) => (
                                <OptionBadge key={option.id} type={option.category}>
                                    {
                                        option.category === "시럽" ?
                                            <>{option.detail + " " + option.quantity}</> :
                                            option.category === "얼음" && option.detail === "보통" ?
                                                <> {`얼음 보통`} </> : <> {option.detail} </>
                                    }
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
const OrderSummaryBox = memo(() => {

    //          state: 주문 데이터 상태         //
    const show = useOrderManagementStore(state => state.orders?.length !== 0);
    //          state: 보여지는 주문 상태           //
    // const name = useOrderManagementStore(state => state.showOrder?.name || '');

    //          subComponent: 주문 데이터 상태         //
    const ProfileImage = () => {
        return <><ProfileImageE src={useOrderManagementStore(state => state.showOrder?.profileImage || defaultUserImage)} /></>
    }
    //          subComponent: 주문 데이터 상태         //
    const Total = () => {
        return <>{useOrderManagementStore(state => state.showOrder?.totalQuantity ? `총: ${state.showOrder?.totalQuantity!}잔` : '')}</>
    }
    //          subComponent: 주문 데이터 상태         //
    const UserName = () => {
        return <>{useOrderManagementStore(state => state.showOrder?.name || '')}</>
    }
    //          subComponent: 주문 데이터 상태         //
    const Position = () => {
        //          state: 보여지는 주문 상태           //
        const office = useOrderManagementStore(state => state.showOrder?.office || null);
        //          state: 보여지는 주문 상태           //
        const position = useOrderManagementStore(state => state.showOrder?.position || null);
        //          function: 포지션 상태 계산          //
        const positionInfo = () => {
            if (position === null && office === null) {
                return '';
            } else if (position === null && office !== null) {
                return '단체';
            } else {
                return `${position} / ${office}`;
            }
        };
        return <>{position && positionInfo()}</>
    }
    //          render: 주문 요약 박스 렌더링               //
    return (
        <OrderInfoBox>
            {show && (
                <>
                    <SummaryLeft>
                        <ProfileImage />
                        <UserInfo>
                            <NameE><UserName /></NameE>
                            <PositionE><Position /></PositionE>
                        </UserInfo>
                    </SummaryLeft>
                    <SummaryRight>
                        <TotalQuantity>
                            <Total />
                        </TotalQuantity>
                        <CompletedButton />
                    </SummaryRight>
                </>
            )}
        </OrderInfoBox>
    );
}, (prevProps, nextProps) => isEqual(prevProps, nextProps));

//          component: 주문 완료 버튼               //
const CompletedButton = memo(() => {


    //          state: 쿠키 상태            //
    const [cookies,] = useCookies(['managerToken']);

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

        const orderId = useOrderManagementStore.getState().showOrder?.orderId;
        removeOrderById(orderId!);

        //  주문이 완료되고 선택될 주문 설정
        if (orders![0].orderId === orderId!) {
            setShowOrder(orders![1])
        } else {
            setShowOrder(orders![0])
        }

        // openTTS가 열려있다면 음성출력을 보내고 닫혀있다면 안보냄
        const openTTS = useOrderManagementStore.getState().openTTS;
        if (openTTS) {
            const { manager } = useWebSocketStore.getState();
            manager?.sendMessage('/send/orderTTS', { orderId }); // 메시지 전송
        }

    }


    //          function: 주문 완료 처리하는 함수           //
    const orderCompleted = () => {
        if (!cookies.managerToken) return;
        const orderId = useOrderManagementStore.getState().showOrder?.orderId;
        const requestBody: PatchOrderApproveRequestDto = { orderId: orderId! }
        patchOrderApproveRequest(requestBody, cookies.managerToken).then(patchOrderApproveResponse)
    }

    //          function: 주문 완료 안내창 뜨우는 함수              //
    const alertModalOpen = () => {
        const openModal = useBlackModalStore.getState().openModal;
        const setWhiteModal = useBlackModalStore.getInitialState().setWhiteModal;
        const setCallback = useBlackModalStore.getInitialState().setCallback;
        const setMessage = useBlackModalStore.getInitialState().setMessage;
        openModal();
        setWhiteModal("안내창");
        setMessage("주문을 완료하시겠습니끼?")
        setCallback(orderCompleted);
    }

    //          render: 주문 완료 버튼          //
    return (
        <CompletedButtonE onClick={alertModalOpen}>
            완료
        </CompletedButtonE>
    )
});



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

const ProfileImageE = styled.img`
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

const PositionE = styled.div`
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


    ${({ $show }) => $show ? ``:`
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
    background-color: rgba(255, 245, 238, 0.95);`}
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
            case '온도':
                return 'var(--hot)';
            case '얼음':
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
    height: 36px;
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

