import { getPointChargePendingRequest } from 'apis'
import { ResponseDto } from 'apis/response'
import { GetPointChargePendingResponseDto } from 'apis/response/pointCharge'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import styled from 'styled-components'
import Card from './Card'
import usePointChargeRequestStore from 'store/manager/point-charge-request.store'

//              component: 충전 요청 컴포넌트                   //
const ChargeRequest = () => {

    //          state: 쿠키 상태              //
    const [cookies] = useCookies();
    //            state: 포인트 요청 목록             //
    const chargeRequests = usePointChargeRequestStore(state => state.chargeRequests)
    const setChargeRequests = usePointChargeRequestStore.getState().setChargeRequests;

    //          function: 포인트 충전 요청 데이터 처리 함수            //
    const getPointChargePendingResponse = (responseBody: GetPointChargePendingResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMN') alert('존재하지 않는 메뉴입니다.');
        if (code !== 'SU') return;
        const { pointChargeList } = responseBody as GetPointChargePendingResponseDto;
        setChargeRequests(pointChargeList)
    }
    //          function: 포인트 충전 요청 데이터 가져오는 함수           //
    const getChargeRequests = () => {
        if (!cookies.managerToken) return;
        getPointChargePendingRequest(cookies.managerToken).then(getPointChargePendingResponse)
    }


    //          effect:주문 요청 목록을 가져오는 이펙트             //
    useEffect(() => {
        getChargeRequests();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //              render: 충전 요청 렌더링                //
    return (
        <ChargeRequestE>
            {chargeRequests.map((request) => (
                <Card key={request.pointChargeId} request={request} />
            ))}
            {chargeRequests.length === 0 &&
                <Message>요청 없음</Message>
            }
        </ChargeRequestE>
    )
}

export default ChargeRequest



const ChargeRequestE = styled.div`
  display: flex;
  flex-direction: column;
  width: 320px;
  padding-top: 18px;
  margin: 0 auto;
  gap: 8px;
`

const Message = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 150px;
    font-size: 24px;
    color: var(--amberBrown);
`
