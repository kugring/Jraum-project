import styled from 'styled-components';
import PinModal from './PinModal';
import MenuModal from './MenuModal';
import CashPayModal from './CashPayModal';
import PointPayModal from './PointPayModal';
import CashPayOkModal from './CashPayOkModal';
import PointPayOkModal from './PointPayOkModal';
import PointChargeModal from './PointChargeModal';
import { usePinUserStore } from 'store';
import { memo, useEffect, useState } from 'react';
import { useBlackModalStore, usePointChargeStore } from 'store/modal';


//                  component: 모달 모음 컴포넌트                   //
const Modals = () => {

    //                state: 블랙 모달 상태 (전역변수)                //
    const isModalOpen = useBlackModalStore(state => state.isModalOpen)
    const closeModal = useBlackModalStore(state => state.closeModal)
    //                state: 블랙 모달의 애니메이션 상태              //
    const [actionBlack, setActionBlack] = useState(false);
    //                state: 블랙 모달의 애니메이션 상태              //
    const [actionWhite, setActionWhite] = useState(false);
    //                state: 블랙 모달의 출현 상태            //
    const [show, setShow] = useState(false);
    //                state: 화이트 모달 전역상태             //
    const whiteModal = useBlackModalStore(state => state.whiteModal)
    //                state: 화이트 모달 상태             //
    const [white, setWhite] = useState<string>('');
    //                state: 클릭 방지 상태 (0.5초 동안 클릭 방지)             //
    const [isClickable, setIsClickable] = useState(true);


    //                function:포인트 충전 숫자 리셋하는 함수             //
    const resetChargePoint = usePointChargeStore.getState().setChargePoint;
    //                function:포인트 충전 숫자 리셋하는 함수             //
    const resetPin = usePinUserStore.getState().setPin;


    //                effect: 화이트 모달 변경 설정               //
    useEffect(() => {
        // 블랙모달 효과가 0.5s으로 내려가고 이후 셋한 다음 다시 올린다.
        setActionWhite(false)
        setTimeout(() => { setWhite(whiteModal); }, 500)
        setTimeout(() => { setActionWhite(true) }, 500)
    }, [whiteModal]);


    //                effect: 블랙 모달 애니메이션 적용 효과              //
    useEffect(() => {
        setWhite(whiteModal)
        if (isModalOpen) {
            if (isModalOpen !== show) {
                setShow(true);
                setIsClickable(false); // ✅ 클릭 방지 시작
                setTimeout(() => setIsClickable(true), 500); // ✅ 0.5초 뒤 클릭 가능
                setTimeout(() => setActionBlack(true), 10)
                setTimeout(() => setActionWhite(true), 10)
            }
        } else {
            if (isModalOpen !== show) {
                setActionBlack(false);
                setActionWhite(false);
                setIsClickable(false); // ✅ 클릭 방지 시작

                // 요소를 자체를 제거함 
                setTimeout(() => {
                    setShow(false)
                    setIsClickable(true); // ✅ 0.5초 뒤 클릭 가능
                }, 500)

                // 블랙 모달이 닫힐때 데이터 리셋하는 부분
                setTimeout(() => {
                    if (whiteModal === '메뉴') {
                        // resetOrderItem(); 리셋을 안해야 정보가 비어서 모달이 나오는 버그가 안난다.
                    } else if (whiteModal === "포인트충전") {
                        resetChargePoint(0)
                    } else if (whiteModal === "핀") {
                        resetPin('')
                    }
                }, 500)
            }
        }




        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalOpen, show]);


    //                    function: 블랙 모달 외 영역 클릭시 모달 종료 함수                   //
    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // 클릭된 대상이 modal 내의 자식 모달이 아니면 closeModal 실행
        if (!isClickable) return; // 0.5초 동안 클릭 방지
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    //                    render: 모달 모음 렌더링                    //
    return (
        <>
            {show && ( // 절대 지우지말것! 렌더링 순서를 위해서!!!
                <BlackModal
                    $actionBlack={actionBlack}
                    $actionWhite={actionWhite}
                    onClick={handleModalClick}>
                    {(() => {
                        switch (white) {
                            case '메뉴':
                                return <MenuModal />;
                            case '핀':
                                return <PinModal />;
                            case '현금결제':
                                return <CashPayModal />
                            case '포인트결제':
                                return <PointPayModal />
                            case '포인트충전':
                                return <PointChargeModal />;
                            case '현금결제완료':
                                return <CashPayOkModal />
                            case '포인트결제완료':
                                return <PointPayOkModal />
                            default:
                                return null; // 조건에 맞는 값이 없을 때는 아무것도 렌더링하지 않음
                        }
                    })()}
                </BlackModal>
            )}
        </>
    );
};

export default memo(Modals);

const BlackModal = styled.div<{ $actionBlack: boolean, $actionWhite: boolean }>`
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 2;
  // z-index: 1은 결제방식 선택하는 대기화면이 가지고 있다.


  &::after {
    content: '';
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ $actionBlack }) => $actionBlack ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0)'}; 
    transition: background-color 0.5s ease-in-out;
  }

  & > * {
  transform: ${({ $actionWhite }) => ($actionWhite ? 'translateY(0)' : 'translateY(100%)')}; 
  opacity: ${({ $actionWhite }) => ($actionWhite ? '1' : '0')}; 
  transition: 
    opacity 0.5s cubic-bezier(0.65, 0.05, 0.36, 1), transform 0.5s  ease-in-out, background 0.5s ease-in-out;
}

`;
