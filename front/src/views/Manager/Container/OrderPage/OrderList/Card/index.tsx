import styled from 'styled-components'
import { isEqual } from 'lodash'
import { fromNow } from 'helpers/dayjs'
import { OrderList } from 'types/interface'
import { useCookies } from 'react-cookie'
import { ResponseDto } from 'apis/response'
import { memo, useState } from 'react'
import { BiSolidBellRing } from "react-icons/bi";
import { useWebSocketStore } from 'store'
import { useBlackModalStore } from 'store/modal'
import { defaultUserImage, formattedDate, formattedPoint } from 'constant'
import { deleteOrderRequest, patchOrderApproveRequest, patchOrderRefundCancelRequest, patchOrderRefundRequest } from 'apis'
import { DeleteOrderRequestDto, PatchOrderApproveRequestDto, PatchOrderRefundCancelRequestDto, PatchOrderRefundRequestDto } from 'apis/request/order'
import { PatchOrderApproveResponseDto, PatchOrderRefundCancelResponseDto, PatchOrderRefundResponseDto } from 'apis/response/order'
import DeleteOrderResponseDto from 'apis/response/order/delete-order.response.dto'

//          component: 주문 목록 카드 컴포넌트            //
const Card = ({ order }: { order: OrderList }) => {

    //          state: 쿠키 상태            //
    const [cookies] = useCookies(['managerToken'])
    //          state: 주문 상태            //
    const [status, setStatus] = useState(order.status);
    //          state: 포지션 상태          //
    const position = [order.division, order.position].filter(Boolean).join(' / ') || '';

    //          function: 블랙 모달과 알림창 모달을 위한 함수               //
    const setWhiteModal = useBlackModalStore.getInitialState().setWhiteModal;
    const setCallback = useBlackModalStore.getInitialState().setCallback;
    const setMessage = useBlackModalStore.getInitialState().setMessage;
    const openModal = useBlackModalStore.getState().openModal;

    //          function: 주문 완료 처리 이후 함수          //
    const patchOrderApproveResponse = (responseBody: PatchOrderApproveResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMN') alert('존재하지 않는 메뉴입니다.');
        if (code === 'NMG') alert('관리자 토큰이 만료되었습니다.');
        if (code !== 'SU') return;
        setStatus('완료')
    }

    //          function: 주문 삭제 처리 이후 함수          //
    const deleteOrderResponse = (responseBody: DeleteOrderResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMN') alert('존재하지 않는 메뉴입니다.');
        if (code === 'NMG') alert('관리자 토큰이 만료되었습니다.');
        if (code !== 'SU') return;
        setStatus('삭제')
    }

    //          function: 주문 환불 처리 이후 함수          //
    const patchOrderRefundResponse = (responseBody: PatchOrderRefundResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMN') alert('존재하지 않는 메뉴입니다.');
        if (code === 'NMG') alert('관리자 토큰이 만료되었습니다.');
        if (code !== 'SU') return;
        setStatus('환불')
    }

    //          function: 주문 환불 처리 이후 함수          //
    const patchOrderRefundCancelResponse = (responseBody: PatchOrderRefundCancelResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMN') alert('존재하지 않는 메뉴입니다.');
        if (code === 'NMG') alert('관리자 토큰이 만료되었습니다.');
        if (code !== 'SU') return;
        setStatus('대기')
    }

    //          function: 주문 완료 처리하는 함수           //
    const orderCompleted = () => {
        if (!cookies.managerToken) return;
        const requestBody: PatchOrderApproveRequestDto = { orderId: order.orderId }
        patchOrderApproveRequest(requestBody, cookies.managerToken).then(patchOrderApproveResponse)
    }

    //          function: 주문 삭제 처리하는 함수           //
    const orderDeleted = () => {
        if (!cookies.managerToken) return;
        const requestBody: DeleteOrderRequestDto = { orderId: order.orderId }
        deleteOrderRequest(requestBody, cookies.managerToken).then(deleteOrderResponse)
    }

    //          function: 주문 환불 처리하는 함수           //
    const orderRefund = () => {
        if (!cookies.managerToken) return;
        const requestBody: PatchOrderRefundRequestDto = { orderId: order.orderId }
        patchOrderRefundRequest(requestBody, cookies.managerToken).then(patchOrderRefundResponse)
    }
    //          function: 주문 환불 취소 처리하는 함수           //
    const orderRefundCancel = () => {
        if (!cookies.managerToken) return;
        const requestBody: PatchOrderRefundCancelRequestDto = { orderId: order.orderId }
        patchOrderRefundCancelRequest(requestBody, cookies.managerToken).then(patchOrderRefundCancelResponse)
    }

    //          function: 주문 완료 안내창 뜨우는 함수              //
    const orderCompletedAlertModalOpen = () => {
        openModal();
        setWhiteModal("안내창");
        setMessage("주문을 완료하시겠습니까?")
        setCallback(orderCompleted);
    }

    //          function: 주문 삭제 안내창 뜨우는 함수              //
    const orderDeletedAlertModalOpen = () => {
        openModal();
        setWhiteModal("안내창");
        setMessage("주문을 삭제하시겠습니까?")
        setCallback(orderDeleted);
    }

    //          function: 주문 환불 안내창 뜨우는 함수              //
    const orderRefundAlertModalOpen = () => {
        openModal();
        setWhiteModal("안내창");
        setMessage("주문을 환불하시겠습니까?")
        setCallback(orderRefund);
    }

    //          function: 주문 환불 취소 안내창 뜨우는 함수              //
    const orderRefundCancelAlertModalOpen = () => {
        openModal();
        setWhiteModal("안내창");
        setMessage("주문을 환불을 취소하시겠습니까?")
        setCallback(orderRefundCancel);
    }

    //          function: 주문 알림 웹소켓 TTS 함수             //
    const orderSendTTS = (orderId: number) => {
        const { manager } = useWebSocketStore.getState();
        manager?.sendMessage('/send/orderTTS', { orderId }); // 메시지 전송
    }

    //          function: 주문 완료 안내창 뜨우는 함수              //
    const orderSendTTSAlertModalOpen = (orderId: number) => {
        openModal();
        setWhiteModal("안내창");
        setMessage("주문 음성 알리기")
        setCallback(() => orderSendTTS(orderId));
    }

    //          render: 주문 목록 카드 렌더링            //
    return (
        <CardE key={`${order.orderId}-${order.createdAt}`}>
            <CardTop>
                <UserInfo>
                    <ProfileImage src={order.profileImage || defaultUserImage}></ProfileImage>
                    <Info>
                        <UserName>{order.name}</UserName>
                        <Position>{position}</Position>
                    </Info>
                </UserInfo>
                <CardTopRight>
                    <PayMethod>{order.payMethod}</PayMethod>
                    <Balance> {order.point >= 0 ? `잔액: ${formattedPoint(order.point)}원` : ""}</Balance>
                </CardTopRight>
            </CardTop>
            <OrderDate>
                <YYYYMMDD>{formattedDate(order.createdAt)}</YYYYMMDD>
                <HHMM>{fromNow(order.createdAt)}</HHMM>
            </OrderDate>
            <OrderInfoBox>
                <InfoHeader>
                    <MenuName>메뉴 이름</MenuName>
                    <MenuQuantity>개수</MenuQuantity>
                    <MenuPrice>가격</MenuPrice>
                </InfoHeader>
                <InfoBody>
                    {order.orderDetails.map((item) => (
                        <InfoRow key={item.orderDetailId}>
                            <MenuName>{item.name}</MenuName>
                            <MenuQuantity>{item.quantity}</MenuQuantity>
                            <MenuPrice>{formattedPoint(item.price)}원</MenuPrice>
                        </InfoRow>
                    ))}
                </InfoBody>
            </OrderInfoBox>
            <TotalOrderInfo>
                <TotalTitle>합계</TotalTitle>
                <TotalQuantity>{order.totalQuantity}</TotalQuantity>
                <TotalPrice>{formattedPoint(order.totalPrice)}원</TotalPrice>
            </TotalOrderInfo>
            <Buttons>
                {(() => {
                    switch (status) {
                        case '완료':
                            return (<>
                                <Cancel onClick={orderRefundAlertModalOpen}>삭제</Cancel>
                                <Completed onClick={() => orderSendTTSAlertModalOpen(order.orderId)}>
                                    완료됨 &nbsp;
                                    <BiSolidBellRing color='var(--copperBrown)' size={16} />
                                </Completed>
                            </>);
                        case '대기':
                            return (<>
                                <Cancel onClick={orderDeletedAlertModalOpen}>삭제</Cancel>
                                <Complete onClick={orderCompletedAlertModalOpen}>주문 완료</Complete>
                            </>)
                        case '환불':
                            return <Canceled onClick={orderRefundCancelAlertModalOpen}>환불 처리됨</Canceled>
                                ;
                        case '삭제':
                            return <Canceled>삭제됨</Canceled>
                                ;
                        default:
                            return null; // 조건에 맞는 값이 없을 때는 아무것도 렌더링하지 않음
                    }
                })()}

            </Buttons>
        </CardE>
    )
}

export default memo(Card, (prevProps, nextProps) => isEqual(prevProps.order.orderId, nextProps.order.orderId));



const CardE = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 12px;
    padding: 16px 16px 14px 16px;
    box-sizing: border-box;
    border-radius: 12px;
    border: 1px solid #E7D7C7;
    background: #FFF;
`

const CardTop = styled.div`
    display: flex;
    justify-content: space-between;
`

const UserInfo = styled.div`
    display: flex;
    gap: 12px;
`

const ProfileImage = styled.img`
    width: 42px;
    height: 42px;
    border-radius: 8px;
`

const Info = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1px;
`

const UserName = styled.div`
    color: var(--brickOrange);
    font-size: 18px;
`

const Position = styled.div`
    color: var(--copperBrown);
    font-size: 12px;
`

const CardTopRight = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    padding: 2px 0px;
`

const PayMethod = styled.div`
    display: flex;
    flex-direction: column;
    padding: 4px;
    color: #FFF;
    font-size: 10px;
    border-radius: 2px;
    background: var(--orange);
`

const Balance = styled.div`
    color: var(--lightBrown);
    font-size: 12px;
`

const OrderDate = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const YYYYMMDD = styled.div`
    color: #c7c7c7;
    font-size: 10px;
`

const HHMM = styled.div`
    color: #c7c7c7;
    font-size: 10px;
`

const OrderInfoBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    padding: 14px 4px;
    border-top: 1px solid gray;
    border-bottom: 1px solid gray;
`

const InfoHeader = styled.div`
    display: flex;
    color: var(--antiqueCream);
    text-align: center;
    font-size: 12px;
`

const InfoBody = styled.div`
    display: flex;
    flex-direction: column;
    color: var(--mochaBrown);
    text-align: center;
    font-size: 11px;
    gap: 8px;
`

const InfoRow = styled.div`
    display: flex;
    align-items: center;
`

const MenuName = styled.div`
    flex: 1;
    text-align: start;
    align-items: center;
`

const MenuQuantity = styled.div`
    width: 42px;
    min-width: 42px;
`

const MenuPrice = styled.div`
    width: 72px;
    text-align: end;
`

const TotalOrderInfo = styled.div`
    display: flex;
    color: var(--brickOrange);
    font-size: 14px;
    padding: 2px 4px;
`

const TotalTitle = styled.div`
    flex: 1;
    text-align: start;
`

const TotalQuantity = styled.div`
    width: 42px;
    min-width: 42px;
    text-align: center;
`

const TotalPrice = styled.div`
    width: 72px;
    text-align: end;
`

const Buttons = styled.div`
    display: flex;
    height: 44px;
    gap: 12px;
    color: #FFF;
    font-size: 18px;
`

const Cancel = styled.div`
  display : flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  width: 62px;
  border-radius: 4px;
  color: var(--antiqueCream);
  border: 1.5px solid var(--antiqueCream);
  background: var(--seashell);
`

const Completed = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 10px 12px;
    border-radius: 4px;

    opacity: 0.8;
    box-sizing: border-box;
    color: var(--lightBrown);
    background: var(--creamyYellow);
    border: 1.5px solid var(--lightBrown);
`

const Complete = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 12px;
    border-radius: 4px;
    background: var(--orange);
`

const Canceled = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 10px 12px;
    border-radius: 4px;

    opacity: 0.8;
    box-sizing: border-box;
    color: var(--lightBrown);
    background: var(--lightCream);
    border: 1.5px solid var(--lightBrown);
`
