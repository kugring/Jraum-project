import styled from 'styled-components'
import { memo } from 'react';
import ChargeStatus from './ChargeStatus';
import usePinUserStore from 'store/pin-user.store';
import { FaSignOutAlt } from 'react-icons/fa';
import { defaultUserImage, formattedDate, formattedPoint } from 'constant';

//          component: 회원 정보 박스 컴포넌트              //
const UserInfoBox = () => {

    //      state: 핀 회원 정보         //
    const name = usePinUserStore(state => state.pinUser?.name);
    //      state: 핀 회원 정보         //
    const nickname = usePinUserStore(state => state.pinUser?.nickname);
    //     state: 핀회원 프로필 상태          //
    const image = usePinUserStore(state => state.pinUser?.profileImage ? state.pinUser?.profileImage : defaultUserImage);
    //      state: 결제 방식         //
    const payment = usePinUserStore(state => state.payment);
    //     state: 핀회원 닉네임 상태          //
    const userName = nickname ? nickname : name;

    //      function: 결제 방식 설정하는 함수         //
    const setPayment = usePinUserStore.getState().setPayment;
    //      function: 핀회원 정보 reset 처리 함수         //
    const resetPinUser = usePinUserStore.getState().resetPinUser;
    //      function: 처음으로 시작하기 함수            //
    const goBackToStart = () => {
        resetPinUser()
        setPayment('')
    }

    //      render: 회원 정보 박스 렌더링           //
    return (
        <>
            {/* 회원 정보 */}
            <UserInfoBoxE>
                {payment === '포인트결제' ?
                    <>
                        <ChargeStatus />
                        <ProfileImage src={image} alt="" />
                        <UserInfo>
                            <UserName>{userName}</UserName>
                            <UserPoint>

                                <Price />
                            </UserPoint>
                        </UserInfo>
                        <ResetButton onClick={goBackToStart} size={24} style={{ color: '#FFF' }} />
                    </>
                    :
                    <>
                        <Today>{formattedDate(new Date())}</Today>
                        <ResetButton onClick={goBackToStart} size={24} style={{ color: '#FFF' }} />
                    </>
                }
            </UserInfoBoxE>

        </>
    )
}

//          component: 회원 현재 포인트 컴포넌트            //
const Price = () => {

    //      state: 핀 회원 정보         //
    const point = usePinUserStore(state => state.pinUser?.point!);

    return (
        <>
            {formattedPoint(point)}{" "}원
        </>
    )
}

export default memo(UserInfoBox)

const UserInfoBoxE = styled.div`
    display:flex;
    align-items: center;
    gap:12px;    

    @media (max-width: 768px) {
    gap:8px;    
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
    font-size: 12px;
    }
`

const UserPoint = styled.div`
    font-size: 14px;

    @media (max-width: 768px) {
    font-size: 10px;
    }
`

const ResetButton = styled(FaSignOutAlt)`
    display:flex;
    padding: 8px 8px;
`

const Today = styled.div`
    font-size: 24px;
`