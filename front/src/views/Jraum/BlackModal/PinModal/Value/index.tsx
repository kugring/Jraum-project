
import { postPinCheckRequest } from 'apis';
import { PostPinCheckRequestDto } from 'apis/request/auth';
import { ResponseDto } from 'apis/response';
import { PostPinCheckResponseDto } from 'apis/response/auth';
import { JRAUM_PATH } from 'constant';
import { memo, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import useBlackModalStore from 'store/modal/black-modal.store';
import usePinUserStore from 'store/pin-user.store'


//          component: 입력 n번째 문자 컴포넌트             //
const Value = ({ index }: { index: number }) => {

    //      state: 핀 상태          //
    const pinChar = usePinUserStore(state => state.pin.charAt(index))
    //      state: 핀이 4자리가 되면 렌더링 되게 하기          //
    const completed = usePinUserStore(state => state.pin.length === 4 && index === 3);
    //      state: 핀 상태          //
    const pin = usePinUserStore.getState().pin;
    //          state: 핀 번호 상태          //
    const setPin = usePinUserStore.getState().setPin;
    //          state: 쿠키 상태            //
    const [, setCookie] = useCookies(['pinToken']);

    //      function: 결제 방식 설정 함수         //
    const setPayment = usePinUserStore(state => state.setPayment);
    //          function: 블랙 모달을 닫는 함수           //
    const closeModal = useBlackModalStore.getState().closeModal;
    //          function: 핀회원 저장하는 함수            //
    const setPinUser = usePinUserStore.getState().setPinUser;
    //          function: 메세지 문장 변경하는 함수수          //
    const setMessage = usePinUserStore.getState().setMessage;
    //          function: 4자리수가 완성되면 실행하는 함수          //
    const handleComplete = (completedPin: string) => {
        const requestBody: PostPinCheckRequestDto = { pin: completedPin }
        postPinCheckRequest(requestBody).then(postPinCheckResponse);

    }
    //          function: get MenuOption Resposne 처리 함수           //
    const postPinCheckResponse = (responseBody: PostPinCheckResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert("데이터베이스 오류입니다.");
        if (code === 'NMN') alert("존재하지 않는 메뉴 입니다.");
        if (code === 'PF') {
            setMessage('다시 입력해주세요^^') // 메세지가 사라짐 {300} + 메세지가 보임 {300} + 메세지 유지 {600} == 1200ms 
            setTimeout(() => setMessage('* 초기번호: 전화번호 뒷자리 *'), 1200)
        }
        if (code !== 'SU') return;

        // 해당 Dto에서 데이터를 가져와서 options를 추출해와서 const로 담는다.
        const { user, token, expirationTime } = responseBody as PostPinCheckResponseDto;
        // 핀회원 정보를 저장함 
        setPinUser(user);
        // 결제 방식 설정
        setPayment('포인트결제')

        // 핀 토근을 저장하고 /jraum안에서만 사용이 가능한 토큰이다.
        const now = new Date().getTime();
        const expires = new Date(now + expirationTime * 1000)

        // 블랙 모달이 다 내려가고 토큰 값을 저장하기! 그레야 리렌더링이 발생하지 않는다.
        setTimeout(() => setCookie('pinToken', token, { expires, path: JRAUM_PATH() }), 500)
        closeModal()
    }


    //          effect: 핀 번호가 4자리가 되면 실행되는 설정        //
    useEffect(() => {
        if (index === 3 && completed) {
            handleComplete(pin)
            setTimeout(() => setPin(''), 1200); // 요소가 사라지니 문제가 없다.
            //   1200ms로 지정한 이유는 번호가 뚱! 하고 사라지는것이 아니라 천천히 메세지가 다 보이게 하고 사라지게 하기 위함이다.
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [completed]);  // 의존성 배열에 pin을 추가하여, pin 값이 변경될 때마다 useEffect가 실행되도록 함

    //      render: 입력 n번째 문자 컴포넌트            //
    return (
        <>
            {pinChar}
        </>
    )
}

export default memo(Value);

