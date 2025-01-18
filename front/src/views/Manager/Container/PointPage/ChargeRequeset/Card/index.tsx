import styled from 'styled-components'
import { fromNow } from 'helpers/dayjs'
import { useCookies } from 'react-cookie'
import { ResponseDto } from 'apis/response'
import { useWebSocketStore } from 'store';
import { ToastContainer, toast } from 'react-toastify';
import { ChargeRequestListItem } from 'types/interface'
import { usePointChargeRequestStore } from 'store/manager';
import { defaultUserImage, formattedPoint } from 'constant'
import { patchPointChargeApprovalRequest, patchPointChargeDeclineRequest } from 'apis'
import { PatchPointChargeApprovalRequestDto, PatchPointChargeDeclineRequestDto } from 'apis/request/pointCharge'
import { PatchPointChargeApprovalResponseDto, PatchPointChargeDeclineResponseDto } from 'apis/response/pointCharge'
import 'react-toastify/dist/ReactToastify.css';

//              component: 포인트 충전 요청 컴포넌트                    //
const Card = ({ request }: { request: ChargeRequestListItem }) => {

    //          state: 쿠키 상태              //
    const [cookies] = useCookies();
    //          state: 웹소켓 상태            //
    const { manager } = useWebSocketStore.getState();
    //            state: 포인트 요청 목록             //
    const removeChargeRequest = usePointChargeRequestStore.getState().removeChargeRequest;

    //          function: 포인트 충전 승인하는 함수             //
    const pointChargeApproval = () => {
        const requestBody: PatchPointChargeApprovalRequestDto = {
            pointChargeId: request.pointChargeId
        }
        patchPointChargeApprovalRequest(requestBody, cookies.managerToken).then(patchPointChargeApprovalResponse)
    }

    //          function: 포인트 충전 요청 승인 데이터 처리 함수            //
    const patchPointChargeApprovalResponse = (responseBody: PatchPointChargeApprovalResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMG') alert('유효하지 않은 관리자입니다.');
        if (code !== 'SU') return;

        manager?.sendMessage('/send/pointCharge/requestOk', { pointChargeId: request.pointChargeId, status: "승인" }); // 메시지 전송
        toast.success('충전이 승인되었습니다.', {
            autoClose: 500,
            position: "top-center",
            closeOnClick: true, // 클릭 시 바로 사라짐
            pauseOnHover: false
          });
        removeChargeRequest(request);
    }
    //          function: 포인트 충전 거절하는 함수             //
    const pointChargeDecline = () => {
        const requestBody: PatchPointChargeDeclineRequestDto = {
            pointChargeId: request.pointChargeId
        }
        patchPointChargeDeclineRequest(requestBody, cookies.managerToken).then(patchPointChargeDeclineResponse)
    }

    //          function: 포인트 충전 요청 거절 데이터 처리 함수            //
    const patchPointChargeDeclineResponse = (responseBody: PatchPointChargeDeclineResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMG') alert('유효하지 않은 관리자입니다.');
        if (code !== 'SU') return;

        manager?.sendMessage('/send/pointCharge/requestOk', { pointChargeId: request.pointChargeId, status: "거절" }); // 메시지 전송
        toast.warn('충전이 거절되었습니다.', {
            autoClose: 500,
            position: "top-center",
            closeOnClick: true, // 클릭 시 바로 사라짐
            pauseOnHover: false
          });
        removeChargeRequest(request);
    }


    //              render: 포인트 충전 요청 렌더링                 //
    return (
        <CardE>
            <CardContent>
                <UserInfo>
                    <ProfileImage src={defaultUserImage ? defaultUserImage : request.profileImage}></ProfileImage>
                    <UserInfoRight>
                        <UserName>{request.name}</UserName>
                        <UserPosition>{request.office === "단체" ? "단체" : request.position + "/" + request.office}</UserPosition>
                    </UserInfoRight>
                </UserInfo>
                <CardRight>
                    <CardRightTop>
                        <CardDate>{fromNow(request.createdAt)}</CardDate>
                        <CardTitle>충전 요청</CardTitle>
                    </CardRightTop>
                    <ChargePoint>{formattedPoint(request.chargePoint)}원</ChargePoint>
                </CardRight>
            </CardContent>
            <Buttons>
                <Cancel onClick={pointChargeDecline}>거절</Cancel>
                <Approve onClick={pointChargeApproval}>승인</Approve>
            </Buttons>
        </CardE>

    )
}

export default Card

const CardE = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: 8px;
  gap: 8px;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #EABEAB;
  background: #FFF;
`

const CardContent = styled.div`
  display: flex;
  padding: 0px 3px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`

const UserInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`

const ProfileImage = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 2px;
`

const UserInfoRight = styled.div`
  display: flex;
  padding: 6px 0px 4px 0px;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
`

const UserName = styled.div`
  color: var(--brickOrange);
  font-size: 16px;
`

const UserPosition = styled.div`
  color: var(--copperBrown);
  font-size: 10px;
`

const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  align-self: stretch;
`

const CardRightTop = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`

const CardTitle = styled.div`
  color: #FFF;
  padding: 4px;
  font-size: 10px;
  border-radius: 4px;
  background: var(--orange);
`

const CardDate = styled.div`
  flex: 1;
  color: #AFAFAF;
  text-align: right;
  font-size: 10px;
`

const ChargePoint = styled.div`
  color: var(--lightBrown);
  font-size: 16px;
`

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  align-self: stretch;
`

const Cancel = styled.div`
  display : flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  flex: 1;
  border-radius: 4px;
  color: #ABABAB;
  border: 0.2px solid #ABABAB;
  background: #FFF;
`

const Approve = styled.div`
  display : flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  flex: 1;
  border-radius: 4px;
  border-radius: 4px;
  color: #FFF;
  background: var(--orange, #FC8D08);
`