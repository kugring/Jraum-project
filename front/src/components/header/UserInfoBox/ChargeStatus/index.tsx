import { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { PulseLoader } from 'react-spinners';
import { deletePointChargeRequest, getPointChargePendingCountRequest } from 'apis';
import { useCookies } from 'react-cookie';
import { DeletePointChargeResponseDto, GetPointChargePendingCountResponseDto } from 'apis/response/pointCharge';
import { ResponseDto } from 'apis/response';
import usePointChargeStore from 'store/modal/point-charge-modal.store';
import useBlackModalStore from 'store/modal/black-modal.store';
import usePinUserStore from 'store/pin-user.store';
import useOrderStore from 'store/modal/order-list.store';

//              component: 충전 상태 컴포넌트              //
const ChargeStatus = () => {

    //              state: 쿠키 상태              //
    const [cookies] = useCookies();
    //              state: 충전 승인 상태              //
    const [approve, setApprove] = useState<boolean>(false);
    //              state: 포인트 충전 ID 상태              //
    const pointChargeId = usePointChargeStore(state => state.pointChargeId);
    //              state: 화이트 모달 상태             //
    const prePayModal = useBlackModalStore(state => state.whiteModal === '포인트결제');
    //              state: 충전 취소 질문 상태              //
    const [cancelAlert, setCancelAlert] = useState<boolean>(false);
    //              state: 충전 메세지 상태              //
    const [message, setMessage] = useState<string>('충전 완료');
    //              state: 회원 현재 포인트 상태            //
    const currentPoint = usePinUserStore.getState().pinUser?.point!;
    //          state: 주문의 최종 결제 금액 상태            //
    const canPay = useOrderStore(state => state.getTotalPrice() > currentPoint)



    //              function: 포인트 충전 ID 설정 함수              //
    const setPointChargeId = usePointChargeStore(state => state.setPointChargeId);
    //              function: 블랙 모달 여는 함수               //
    const openModal = useBlackModalStore.getState().openModal;
    //              function: 화이트 모달 설정 함수               //
    const setWhiteModal = useBlackModalStore.getState().setWhiteModal;
    //              function: 미승인 상태 요청 갯수에 대한 반환 처리하는 함수              /
    const getPointChargePendingCountResponse = (responseBody: GetPointChargePendingCountResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMN') alert('존재하지 않는 메뉴입니다.');
        if (code !== 'SU') return;

        const { approve } = responseBody as GetPointChargePendingCountResponseDto;
        if (approve) {
            // 승인 상태
            setApprove(approve);
            // 이전 작업이 결제상황이었다면 기존 결제 화면으로 다시 이동
            if (prePayModal) { setTimeout(() => { openModal(); setPointChargeId(0); }, 500) }
            // 5초 후에 상태 초기화
            setTimeout(() => { setApprove(false); setCancelAlert(false); }, 5000);
        }

    };
    //              function: 승인 상태에 대한 요청을 확인하는 함수              //
    const approveCheck = () => {
        if (!cookies.pinToken) return;
        getPointChargePendingCountRequest(pointChargeId, cookies.pinToken).then(getPointChargePendingCountResponse);
    };
    //              function: 미승인 상태 요청 갯수에 대한 반환 처리하는 함수              /
    const deletePointChargeResponse = (responseBody: DeletePointChargeResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMN') alert('존재하지 않는 메뉴입니다.');
        if (code !== 'SU') return;

        setCancelAlert(false);
        setApprove(true);
        setMessage("충전이 취소됨")
        setTimeout(() => { setApprove(false); setMessage("충전 완료"); setPointChargeId(0) }, 2000)
    };
    //              function: 승인 상태에 대한 요청을 확인하는 함수              //
    const deletePointCharge = () => {
        if (!cookies.pinToken) return;
        deletePointChargeRequest(pointChargeId, cookies.pinToken).then(deletePointChargeResponse);
    };
    //              function: 포인트 모달을 여는 함수               //
    const pointChargeModal = () => {
        openModal();
        setWhiteModal('포인트충전')
    }


    //              effect: pointChargeId가 0보다 클 때 1초마다 approveCheck 실행              //
    useEffect(() => {
        if (pointChargeId > 0) {
            const intervalId = setInterval(approveCheck, 1000);
            // 컴포넌트 언마운트 시 인터벌 정리
            return () => clearInterval(intervalId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pointChargeId, cookies.pinToken]);




    //              render: 충전 상태 렌더링                //
    return (
        <>
            {approve ? (
                <CompletedCharge>{message}</CompletedCharge>
            ) : (
                <>
                    {pointChargeId > 0 ? (
                        <>
                            {!cancelAlert ? (
                                <WaitCharge onClick={() => setCancelAlert(true)}>
                                    {`충전 대기`}
                                    <PulseLoader color="#FFF" size={6} />
                                </WaitCharge>
                            ) : (
                                <>
                                    <DeleteCharge onClick={() => setCancelAlert(false)}>
                                        {`대기 유지`}
                                    </DeleteCharge>
                                    or
                                    <DeleteCharge onClick={() => { deletePointCharge(); }}>
                                        {`충전 취소`}
                                    </DeleteCharge>
                                </>
                            )}
                        </>
                    ) :
                        <PointCharge $canPay={canPay} onClick={pointChargeModal}>{'포인트 충전'}</PointCharge> // 템플릿 리터럴 제거
                    }
                </>
            )}
        </>
    );
};

export default memo(ChargeStatus);

const CompletedCharge = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 20px;
    padding: 4px 8px;
    border-radius: 8px;
    border: 2px solid #FFF;
    background-color: var(--coralPink);
`;

const PointCharge = styled.div<{ $canPay: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 14px;
    padding: 8px 6px;
    border-radius: 8px;
    border: 2px solid #FFF;
    background-color: ${({ $canPay }) => ($canPay ? "var(--coralPink)" : "var(--goldenPeach)")} ;
    transition: background 0.3s ease-in-out;
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

