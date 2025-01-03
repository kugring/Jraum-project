import styled from 'styled-components'
import { fromNow } from 'helpers/dayjs'
import { useState } from 'react'
import { OrderList } from 'types/interface'
import { useCookies } from 'react-cookie'
import { ResponseDto } from 'apis/response'
import { defaultUserImage, formattedDate, formattedPoint } from 'constant'
import { patchOrderApproveRequest, patchOrderRefundRequest } from 'apis'
import { PatchOrderApproveRequestDto, PatchOrderRefundRequestDto } from 'apis/request/order'
import { PatchOrderApproveResponseDto, PatchOrderRefundResponseDto } from 'apis/response/order'

//          component: 주문 목록 카드 컴포넌트            //
const Card = ({ order }: { order: OrderList }) => {

    //          state: 쿠키 상태            //
    const [cookies] = useCookies(['managerToken'])
    //          state: 주문 상태            //
    const [status, setStatus] = useState(order.status);

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
    //          function: 주문 완료 처리하는 함수           //
    const orderCompleted = () => {
        if (!cookies.managerToken) return;
        const requestBody: PatchOrderApproveRequestDto = { orderId: order.orderId }
        patchOrderApproveRequest(requestBody, cookies.managerToken).then(patchOrderApproveResponse)
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
    //          function: 주문 환불불 처리하는 함수           //
    const orderRefund = () => {
        if (!cookies.managerToken) return;
        const requestBody: PatchOrderRefundRequestDto = { orderId: order.orderId }
        patchOrderRefundRequest(requestBody, cookies.managerToken).then(patchOrderRefundResponse)
    }

    //          render: 주문 목록 카드 렌더링            //
    return (
        <CardE key={`${order.orderId}-${order.createdAt}`}>
            <CardTop>
                <UserInfo>
                    <ProfileImage src={order.profileImage || defaultUserImage}></ProfileImage>
                    <Info>
                        <UserName>{order.name}</UserName>
                        <Position>{order.office === null ? "" : `${order.position} / ${order.office}`}</Position>
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
                                <Cancel onClick={orderRefund}>환불</Cancel>
                                <Completed>완료됨</Completed>
                            </>);
                        case '대기':
                            return (<>
                                <Cancel onClick={orderRefund}>환불</Cancel>
                                <Complete onClick={orderCompleted}>주문 완료</Complete>
                            </>)
                        case '환불':
                            return <Canceled>환불 처리됨</Canceled>
                                ;
                        default:
                            return null; // 조건에 맞는 값이 없을 때는 아무것도 렌더링하지 않음
                    }
                })()}

            </Buttons>
        </CardE>
    )
}
export default Card



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