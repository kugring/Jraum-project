import { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { PulseLoader } from 'react-spinners';
import { deletePointChargeRequest, getPointChargeStatusRequest } from 'apis';
import { useCookies } from 'react-cookie';
import { DeletePointChargeResponseDto, GetPointChargeStatusResponseDto } from 'apis/response/pointCharge';
import { ResponseDto } from 'apis/response';
import usePointChargeStore from 'store/modal/point-charge-modal.store';
import useBlackModalStore from 'store/modal/black-modal.store';
import usePinUserStore from 'store/pin-user.store';
import useOrderStore from 'store/modal/order-list.store';

//              component: 충전 상태 컴포넌트              //
const ChargeStatus = () => {

    //              state: 쿠키 상태              //
    const [cookies] = useCookies();

    //              state: 포인트 충전 진행 상태              //
    const charging = usePointChargeStore(state => state.charging);
    //              state: 화이트 모달 상태             //
    // const prePayModal = useBlackModalStore(state => state.whiteModal === '포인트결제');
    // 혹시 몰라서 주석은 해놓았는데 문제 생기면 이놈 때문임
    //              state: 충전 취소 질문 상태              //
    const [cancelAlert, setCancelAlert] = useState<boolean>(false);

    //              function: 포인트 충전 진행 상태              //
    const setCharging = usePointChargeStore.getState().setCharging
    //              function: 포인트 충전 ID 설정 함수              //
    const setPointChargeId = usePointChargeStore.getState().setPointChargeId
    //              function: 포인트 충전 메세지 설정 함수              //
    const setMessage = usePointChargeStore.getState().setMessage


    //              function: 미승인 상태 요청 갯수에 대한 반환 처리하는 함수              //
    const getPointChargeStatusResponse = (responseBody: GetPointChargeStatusResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMN') alert('존재하지 않는 메뉴입니다.');
        if (code !== 'SU') return;
        const { status, pointChargeId } = responseBody as GetPointChargeStatusResponseDto;
        if (status) {
            // 요청 상태 확인
            if (status === "미승인") {
                setCharging(true);
                setPointChargeId(pointChargeId);
                return;
            }
        }
    };

    //              function: 충전 요청의 상태를 확인하는 함수              //
    const getPointChargeStatus = () => {
        if (!charging) {
            if (!cookies.pinToken) return;
            getPointChargeStatusRequest(cookies.pinToken).then(getPointChargeStatusResponse);
        }
    };

    //              function: 충전 요청 삭제하는 함수              //
    const deletePointCharge = () => {
        if (!cookies.pinToken) return;
        const pointChargeId = usePointChargeStore.getState().pointChargeId;
        deletePointChargeRequest(pointChargeId, cookies.pinToken).then(deletePointChargeResponse);
    };

    //              function: 충전을 취소 처리하는 함수              /
    const deletePointChargeResponse = (responseBody: DeletePointChargeResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMN') alert('존재하지 않는 메뉴입니다.');
        if (code === 'NPC') return; // 포인트를 충전한 적이 없는 경우
        if (code !== 'SU') return;

        setCharging(false)
        setCancelAlert(false);
        setMessage("충전이 취소됨")
        setTimeout(() => setMessage("포인트 충전"), 2000)
    };


    //              effect: 처음 렌더링시 이전 충전 요청을 찾아봄              //
    useEffect(() => {
        if (!charging) {
            getPointChargeStatus();
        }
        return () => {
            setCharging(false);
            setCancelAlert(false);
        };
    }, [cookies.pinToken]);


    // useEffect(() => {
    //     return () => {
    //         setCharging(false);
    //         setCancelAlert(false);
    //     };
    // }, []);

    //              render: 충전 상태 렌더링                //
    return (
        <>

            {!charging &&
                <MessageE />
            }
            {charging && !cancelAlert &&
                <WaitCharge onClick={() => setCancelAlert(true)}>
                    {`충전 대기`}
                    <PulseLoader color="#FFF" size={6} />
                </WaitCharge>
            }

            {charging && cancelAlert &&
                <>
                    <DeleteCharge onClick={() => setCancelAlert(false)}>
                        {`대기 유지`}
                    </DeleteCharge>
                    or
                    <DeleteCharge onClick={() => { deletePointCharge(); }}>
                        {`충전 취소`}
                    </DeleteCharge>
                </>
            }

        </>

    );
};
export default memo(ChargeStatus);



//                  component: 포인트 충전 메세지 컴포넌트                      //
const MessageE = () => {

    //              state: 충전 메세지 상태              //
    const message = usePointChargeStore(state => state.message);
    //              state: 회원 현재 포인트 상태            //
    const currentPoint = usePinUserStore.getState().pinUser!.point!;
    //          state: 주문의 최종 결제 금액 상태            //
    const canPay = useOrderStore(state => state.getTotalPrice() <= currentPoint!)


    //              function: 블랙 모달 여는 함수               //
    const openModal = useBlackModalStore.getState().openModal;
    //              function: 화이트 모달 설정 함수               //
    const setWhiteModal = useBlackModalStore.getState().setWhiteModal;
    //              function: 포인트 모달을 여는 함수               //
    const pointChargeModal = () => {
        openModal();
        setWhiteModal('포인트충전')
    }

    //                  render: 포인트 충전 메세지 렌더링                      //
    return (
        <Message $canPay={canPay && message === "포인트 충전"} onClick={pointChargeModal}>{message}</Message> // 템플릿 리터럴 제거
    )
}


const Message = styled.div<{ $canPay: boolean }>`
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size: 14px;
                padding: 8px 6px;
                border-radius: 8px;
                border: 2px solid #FFF;
                background-color: ${({ $canPay }) => ($canPay ? "var(--goldenPeach)" : "var(--coralPink)")} ;
                transition: background 0.3s ease-in-out;
                /* 반응형 스타일 적용 */
                @media (max-width: 768px) {
                    font-size: 12px;
                    padding: 6px 4px;
                    border-radius: 6px;
                }
                `;

const WaitCharge = styled.div`
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size: 18px;
                padding: 4px 8px;
                border-radius: 8px;
                border: 2px solid #FFF;
                background-color: var(--coralPink);
                `
const DeleteCharge = styled.div`
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size: 18px;
                padding: 4px 8px;
                border-radius: 8px;
                border: 2px solid #FFF;
                background-color: var(--coralPink);
                `

