import styled from 'styled-components'
import { isEqual } from 'lodash'
import { SortedUser } from 'types/interface'
import { memo, useState } from 'react'
import { useUserPageStore } from 'store/manager'
import { useBlackModalStore } from 'store/modal'
import { defaultUserImage, formattedDate, formattedPoint } from 'constant'

//              component: 회원 목록 카드 컴포넌트                  //
const Card = ({ user }: { user: SortedUser }) => {

    //              state: 하단 정보 공개 상태                  //
    const [show, setShow] = useState<boolean>(false);
    //          state: 정렬 기준            //
    const sort = useUserPageStore.getState().sort;
    //              function: 블랙 모달 여는 함수               //
    const openModal = useBlackModalStore.getState().openModal;
    //              function: 화이트 모달 설정하는 함수               //
    const setWhiteModal = useBlackModalStore.getState().setWhiteModal;
    //              function: 수정할 회원 정보를 설정하는 함수              //
    const setEditUser = useUserPageStore.getState().setEditUser;
    //              function: 회원 정보 수정하는 함수               //
    const editUserModal = () => {
        setEditUser(user);
        setWhiteModal("회원수정")
        openModal();
    }

    //              subComponent: 카드 탑 서브컴포넌트                  //
    const CardTopE = () => {
        return (
            <CardTop onClick={() => setShow(!show)}>
                <UserInfo>
                    <ProfileImage src={user.profileImage ? user.profileImage : defaultUserImage}></ProfileImage>
                    <Info>
                        <UserName>{user.name}</UserName>
                        <Position>{user.position} / {user.office}</Position>
                    </Info>
                </UserInfo>
                <CardTopRight>
                    <UserType>{user.office !== "단체" ? "개인 회원" : "단체 회원"}</UserType>
                    <CurrentPoint>
                        {sort === "번호순" ? `핀: ${user.pin}` : `${formattedPoint(user.point)}원`}
                    </CurrentPoint>
                </CardTopRight>
            </CardTop>
        )
    }
    //              subComponent: 카드 바텀 서브컴포넌트                  //
    const CardBottomE = () => {
        return (
            <>
                <OrderDate>
                    <YYYYMMDD>{formattedDate(user.createdAt)}</YYYYMMDD>
                    <Pin>
                        {sort !== "번호순" ? `핀: ${user.pin}` : `${formattedPoint(user.point)}원`}
                    </Pin>
                </OrderDate>
                <OrderInfoBox>
                    <InfoHeader>
                        <InfoTitle>정보</InfoTitle>
                        <InfoContent>내용</InfoContent>
                    </InfoHeader>
                    <InfoBody>
                        <InfoRow>
                            <InfoTitle>닉네임</InfoTitle>
                            <InfoContent>{user.nickname ? user.nickname : "없음"}</InfoContent>
                        </InfoRow>
                        <InfoRow>
                            <InfoTitle>전화번호</InfoTitle>
                            <InfoContent>{user.phoneNumer ? user.phoneNumer : "없음"}</InfoContent>
                        </InfoRow>
                    </InfoBody>
                </OrderInfoBox>
                <TotalOrderInfo>
                    <TotalTitle>주문량</TotalTitle>
                    <TotalPrice onClick={() => console.log(user.totalSpent)}>{formattedPoint(user.totalSpent)}원</TotalPrice>
                </TotalOrderInfo>
                <Buttons>
                    <Cancel onClick={() => setShow(false)}>닫기</Cancel>
                    <Completed onClick={editUserModal}>정보 수정</Completed>
                </Buttons>
            </>
        )
    }

    //              render: 회원 목록 카드 렌더링               //
    return (
        <CardE>
            <CardTopE />
            <CardBottom $show={show}>
                <CardBottomE />
            </CardBottom>
        </CardE>
    )
}

export default memo(Card, (prevProps, nextProps) => isEqual(prevProps.user.userId, nextProps.user.userId));


const CardE = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
    border-radius: 6px;
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
    border-radius: 4px;
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

const CardBottom = styled.div<{ $show: boolean }>`
  overflow: hidden;
  transition: max-height 0.7s ease-in-out; /* 애니메이션 설정 */

  ${({ $show }) =>
        $show
            ? `
        max-height: 500px; /* 컨텐츠가 보여질 때의 최대 높이 설정 */
      `
            : `
        max-height: 0; /* 숨겨질 때 */
      `}
`;

const UserType = styled.div`
    display: flex;
    flex-direction: column;
    padding: 4px;
    color: #FFF;
    font-size: 10px;
    border-radius: 2px;
    background: var(--orange);
`

const CurrentPoint = styled.div`
        color: var(--lightBrown);
        font-size: 12px;
`

const Pin = styled.div`
    color: #9C9C9C;
    font-size: 10px;
`

const OrderDate = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
`

const YYYYMMDD = styled.div`
    color: #9C9C9C;
    font-size: 10px;
`


const OrderInfoBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    padding: 10px 4px;
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
    font-size: 12px;
    gap: 8px;
`

const InfoRow = styled.div`
    display: flex;
`

const InfoTitle = styled.div`
    flex: 2;
    text-align: start;
`


const InfoContent = styled.div`
    flex: 4;
    text-align: end;
`

const TotalOrderInfo = styled.div`
    display: flex;
    color: var(--brickOrange);
    font-size: 14px;
    padding: 12px 4px;
`

const TotalTitle = styled.div`
    text-align: start;
`

const TotalPrice = styled.div`
    flex: 1;
    width: 72px;
    text-align: end;
`

const Buttons = styled.div`
    display: flex;
    gap: 12px;
    color: #FFF;
    font-size: 18px;
`

const Cancel = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    padding: 10px 12px;
    border-radius: 4px;
    background: var(--goldenSun);
`

const Completed = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 12px;
    border-radius: 4px;
    background: var(--orange);
`