import ChargeStatus from './ChargeStatus';
import styled from 'styled-components'
import { memo } from 'react';
import { useCookies } from 'react-cookie';
import { FaSignOutAlt } from 'react-icons/fa';
import { usePinUserStore } from 'store';
import { defaultUserImage, formattedDate, formattedPoint, JRAUM_PATH } from 'constant';
import { useOrderStore } from 'store/modal';

//          component: 회원 정보 박스 컴포넌트              //
const UserInfoBox = () => {

    //      state: 핀 회원 정보         //
    const name = usePinUserStore(state => state.pinUser?.nickname || state.pinUser?.name || '');
    //     state: 핀회원 프로필 상태          //
    const image = usePinUserStore(state => state.pinUser?.profileImage || defaultUserImage);
    //      state: 결제 방식         //
    const payment = usePinUserStore(state => state.payment);

    //      render: 회원 정보 박스 렌더링           //
    return (
        <UserInfoBoxE>
            {payment === '포인트결제' ?
                <>
                    <ChargeStatus />
                    <ProfileImage src={image} alt="" />
                    <UserInfo>
                        <UserName>{name}</UserName>
                        <UserPoint>
                            <Price />
                        </UserPoint>
                    </UserInfo>
                </>
                :
                <Today>{formattedDate(new Date())}</Today>
            }
            <IconE />
        </UserInfoBoxE>
    )
}

//          component: 회원 현재 포인트 컴포넌트            //
const Price = () => {
    //      state: 핀 회원 정보         //
    const point = usePinUserStore(state => state.pinUser?.point!);
    //          render: 회원 현재 포인트 렌더링            //
    return (<>{formattedPoint(point)}{" "}원</>)
}

//          component: 리셋 아이콘 컴포넌트            //
const IconE = memo(() => {

    //      state: 쿠키 상태            //
    const [, setCookie] = useCookies(['pinToken']);
    //      function: 결제 방식 설정하는 함수         //
    const setPayment = usePinUserStore.getState().setPayment;
    //      function: 핀회원 정보 reset 처리 함수         //
    const resetPinUser = usePinUserStore.getState().resetPinUser;
    //      function: 주문 리스트 초기화 함수         //
    const resetOrderList = useOrderStore.getState().resetOrderList;
    //      event handler: 처음으로 시작하기 함수            //
    const onCLickGoBackToStart = () => {
        resetPinUser();  // 핀회원 정보 리셋
        setPayment('');  // 결제 방식 초기화
        resetOrderList(); // 주문 리스트 초기화
        setCookie('pinToken', '', { expires: new Date(0), path: JRAUM_PATH() }); // 쿠키 삭제
    };
    //          render: 리셋 아이콘 렌더링            //
    return (
        <Icon onClick={onCLickGoBackToStart}>
            <ResetButton size={24} style={{ color: '#FFF' }} />
        </Icon>
    );
});



export default memo(UserInfoBox)

const UserInfoBoxE = styled.div`
    display:flex;
    align-items: center;
    gap:12px;    
    @media (max-width: 768px) {
        gap: 8px;    
    }
`

const ProfileImage = styled.img`
    border-radius: 50%;
    object-fit: cover;
    width: 42px;
    height: 42px;

    @media (max-width: 768px) {
    width:36px;    
    height:36px;    
    }
`

const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`

const UserName = styled.div`
    font-size: 16px;

    @media (max-width: 768px) {
    font-size: 14px;
    }
`

const UserPoint = styled.div`
    font-size: 14px;

    @media (max-width: 768px) {
    font-size: 12px;
    }
`

const ResetButton = styled(FaSignOutAlt)`
    display:flex;
    padding: 8px;
    
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        padding: 4px;
    }
`
const Icon = styled.div`
    
`

const Today = styled.div`
    font-size: 24px;

    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        font-size: 14px;
    }
`