import { defaultUserImage, formattedPoint } from 'constant'
import { fromNow } from 'helpers/dayjs'
import { isEqual } from 'lodash'
import { memo } from 'react'
import styled from 'styled-components'
import PointChargeDetail from 'types/interface/point-charge-detail.interface'

//              component: 포인트 충전 내역 카트 컴포넌트                 //
const Card = ({ chargeDetail }: { chargeDetail: PointChargeDetail }) => {

    //          state: 포지션 상태          //
    const position = [chargeDetail.division, chargeDetail.position].filter(Boolean).join(' / ') || '';

    //              render: 포인트 충전 내역 카드 렌더링                    //
    return (
        <CardE>
            <CardLeft>
                <ProfileImage src={defaultUserImage} />
                <UserInfo>
                    <Name>{chargeDetail.name}</Name>
                    <Position>{position}</Position>
                </UserInfo>
            </CardLeft>
            <ChargeInfo>
                <Info>
                    <ChargeDate>{fromNow(chargeDetail.updatedAt)}</ChargeDate>
                    <ChargeState>{chargeDetail.status}</ChargeState>
                </Info>
                <ChargePoint>{formattedPoint(chargeDetail.chargePoint)}원</ChargePoint>
            </ChargeInfo>
        </CardE>
    )
}

export default memo(Card, (prevProps, nextProps) => isEqual(prevProps.chargeDetail.pointChargeId, nextProps.chargeDetail.pointChargeId));

const CardE = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border-radius: 8px;
    border: 1px solid #EABEAB;
    background: #FFF;
`
const CardLeft = styled.div`
    display: flex;
    gap: 12px;
`
const ProfileImage = styled.img`
    width: 42px;
    height: 42px;
    border-radius: 6px;
`
const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    align-self: stretch;
    padding: 6px 0px 4px 0px;
`
const Name = styled.div`
    color: var(--brickOrange);
    font-size: 16px;
`
const Position = styled.div`
    color: var(--copperBrown);
    font-size: 10px;
`
const ChargeInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    padding-top: 2px;
    gap: 2px;
`
const Info = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`
const ChargeDate = styled.div`
    color: #AFAFAF;
    text-align: right;
    font-size: 12px;
`
const ChargeState = styled.div`
    padding: 2px 4px;
    border-radius: 4px;
    background: var(--orange);
    color: #FFF;
    font-size: 12px;
`
const ChargePoint = styled.div`
    color: var(--lightBrown);
    font-size: 16px;
`