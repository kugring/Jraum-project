import styled from 'styled-components';
import useBlackModalStore from 'store/modal/black-modal.store';
import { memo, useEffect, useState } from 'react';
import MenuAdd from '../Container/MenuPage/MenuList/MenuModal/MenuAdd';
import MenuEdit from '../Container/MenuPage/MenuList/MenuModal/MenuEdit';
import UserAdd from '../Container/UserPage/UserModal/UserAdd';
import UserEdit from '../Container/UserPage/UserModal/UserEdit';
import CashPayModal from './CashPayModal';
import AlertModal from './AlertModal';


//        component: 모달 모음 컴포넌트       //
const BlackModal = () => {

    //    state: 블랙 모달 상태 (전역변수)      //
    const isModalOpen = useBlackModalStore(state => state.isModalOpen)
    const closeModal = useBlackModalStore(state => state.closeModal)
    //    state: 블랙 모달의 애니메이션 상태      //
    const [actionBlack, setActionBlack] = useState(false);
    //    state: 블랙 모달의 애니메이션 상태      //
    const [actionWhite, setActionWhite] = useState(false);
    //    state: 블랙 모달의 출현 상태      //
    const [show, setShow] = useState(false);
    //    state: 화이트 모달 전역상태     //
    const whiteModal = useBlackModalStore(state => state.whiteModal)
    //    state: 화이트 모달 상태     //
    const [white, setWhite] = useState<string>('');


    //      effect: 블랙 모달 애니메이션 적용 효과        //
    useEffect(() => {
        setWhite(whiteModal)
        if (isModalOpen) {
            if (isModalOpen !== show) {
                setShow(true);
                setTimeout(() => setActionBlack(true), 10)
                setTimeout(() => setActionWhite(true), 10)
            }
        } else {
            if (isModalOpen !== show) {
                setActionBlack(false);
                setActionWhite(false);
            }

            // 요소를 자체를 제거함 
            setTimeout(() => { setShow(false) }, 500)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalOpen, show]);


    //        function: 블랙 모달 외 영역 클릭시 모달 종료 함수        //
    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // 클릭된 대상이 modal 내의 자식 모달이 아니면 closeModal 실행
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    //        render: 모달 모음 렌더링        //
    return (
        <>
            {show && ( // 절대 지우지말것! 렌더링 순서를 위해서!!!
                <BlackModalE $actionBlack={actionBlack} $actionWhite={actionWhite} onClick={handleModalClick}>
                    {(() => {
                        switch (white) {
                            case '메뉴추가':
                                return <MenuAdd />;
                            case '메뉴수정':
                                return <MenuEdit />;
                            case '회원등록':
                                return <UserAdd />;
                            case '회원수정':
                                return <UserEdit />;
                            case '현금결제승인':
                                return <CashPayModal />;
                            case '안내창':
                                return <AlertModal />;
                            default:
                                return null; // 조건에 맞는 값이 없을 때는 아무것도 렌더링하지 않음
                        }
                    })()}
                </BlackModalE>
            )}
        </>
    );
};

export default memo(BlackModal);

const BlackModalE = styled.div<{ $actionBlack: boolean, $actionWhite: boolean }>`

  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 2;

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
