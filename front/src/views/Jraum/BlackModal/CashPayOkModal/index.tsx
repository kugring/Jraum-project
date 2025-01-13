import Divider from 'components/Divider'
import React, { memo, useEffect, useState } from 'react'
import useBlackModalStore from 'store/modal/black-modal.store'
import useOrderStore from 'store/modal/order-list.store'
import usePinUserStore from 'store/pin-user.store'
import styled from 'styled-components'

//          component: 현금 결제 완료 모달 컴포넌트             //
const CashPayOkModal = () => {


    //          state: 주문 대기 인원 상태           //
    const waitingNum = useOrderStore.getState().waitingNum;
    //          state: 현금 결제 이름 상태           //
    const cashName = useOrderStore.getState().cashName;

    //          render: 현금 결제 완료 렌더링               //
    return (
        <PointPayOkModalE>
            <Title>{`주문이 완료되었습니다`}</Title>
            <Divider />
            <Info>
                <Text>
                    <div>{'주문이름:'}</div>
                    <div>{'대기인원:'}</div>
                </Text>
                <Point>
                    <div>{`${cashName}`}</div>
                    <div>{waitingNum}팀</div>
                </Point>
            </Info>
            <GoBackToStartButton />
        </PointPayOkModalE>
    )
}

export default memo(CashPayOkModal);




//          component: 처음으로 돌아가는 버튼 컴포넌트              //
const GoBackToStartButton = memo(() => {


    //          function: 블랙 모달 닫는 함수           //
    const closeModal = useBlackModalStore.getState().closeModal;
    //      function: 결제 방식 설정하는 함수         //
    const setPayment = usePinUserStore.getState().setPayment;
    //          function: 주문 리스트 초기화 함수           //
    const resetOrderList = useOrderStore.getState().resetOrderList;
    //          function: 확인 버튼 클릭 이벤트 처리 함수           //
    const goBackToStart = () => {
        closeModal();
        setPayment('');
        setTimeout(() => { resetOrderList(); }, 500)

    }


    //          render: 처음으로 돌아가는 버튼 렌더링              //
    return (
        <GoBackToStartButtonE onClick={goBackToStart}>
            {`확인 `}
            <CountDown>
                <Count goBackToStart={goBackToStart} />
            </CountDown>

        </GoBackToStartButtonE>
    )
})


//          component: 카운트 다운 컴포넌트              //
const Count = memo(({ goBackToStart }: { goBackToStart: () => void }) => {

    //          state: 확인 버튼 5초 카운트         //
    const [countdown, setCountdown] = useState(5); // 5초로 카운트다운 시작

    //           effect: 5초 이후 처음으로 돌아가는 설정         //
    useEffect(() => {
        // 5초 후 이벤트 발생시키기 위한 타이머
        const timer = setTimeout(() => {
            goBackToStart(); // 5초 후 이벤트 발생
        }, 5000); // 5000ms = 5초

        // 카운트다운을 1초씩 줄여가며 출력
        const countdownTimer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        // 컴포넌트가 언마운트되거나, 10초가 지나면 타이머를 정리
        return () => {
            clearTimeout(timer);
            clearInterval(countdownTimer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //          render: 카운트 다운 렌더링              //
    return (
        <>
            {countdown}
        </>
    )
})





const PointPayOkModalE = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 36px 38px 20px 38px;
    gap: 20px;
    box-sizing: border-box;

    border-radius: 26px;
    border: 16px solid var(--goldenOrange);
    background: var(--seashell);

    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        width: 320px;
        gap: 16px;
        padding: 24px 26px 12px 26px;
        border-radius: 20px;
        border: 12px solid var(--goldenOrange);
    }
`

const Title = styled.div`
    color: var(--amberBrown);
    font-size: 32px;

    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        font-size: 28px;
    }
`

const Info = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0 12px 0 6px;
    width: 100%;
    box-sizing: border-box;

    font-size: 24px;
    color: var(--copperBrown);

    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        font-size: 18px;
    }
`

const Text = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
`

const Point = styled.div`
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 14px;
`

const GoBackToStartButtonE = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    padding-left: 35%;
    width: 100%;
    height: 58px;
    box-sizing: border-box;
    color: #FFF;
    font-size: 28px;
    border-radius: 6px;
    border: 4px solid var(--coralPink);
    background: var(--orange);

    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        height: 52px;
    }
`

const CountDown = styled.div`
    text-align: center;
    width: 36px;
`