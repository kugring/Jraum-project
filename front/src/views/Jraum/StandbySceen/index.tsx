import { useEffect, useState } from 'react';
import usePinUserStore from 'store/pin-user.store';
import styled from 'styled-components'
import PaymentMethodBox from './PaymentMethodBox';
import BackgroundImage from 'assets/image/background-img.jpg'
import useYoutubeSoundStore from 'store/youtube-sound.store';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';


//          component: 대기 화면 컴포넌트               //
const StandbySceen = () => {

    //    state: 대기화면 애니메이션 상태      //
    const [action, setAction] = useState(true);
    //    state: 대기화면 출현 상태      //
    const [show, setShow] = useState(true);
    //      state: 결제 방식         //
    const payment = usePinUserStore(state => state.payment !== '');


    const isPlaying = useYoutubeSoundStore(state => state.isPlaying);


    //              function: 유튜브 음악 재생 버튼 함수          //
    const onCLickPlay = () => {
        const onCLickPlay = useYoutubeSoundStore.getState().togglePlaying;
        onCLickPlay()
    }


    //      effect: 대기화면 애니메이션 적용 효과        //
    useEffect(() => {
        if (payment) {
            if (payment === show) {
                setAction(false);
                setTimeout(() => setShow(false), 300)
            }
        } else {
            if (payment === show) {
                setShow(true);
                setTimeout(() => setAction(true), 10)
            }
        }
    }, [payment, show]);

    //          render: 대기 화면 렌더링            //
    return (
        <StandbySceenE $show={show} $action={action}>
            <PaymentMethodBox />
            <MusicButton $active={isPlaying}  onClick={onCLickPlay}>
                {!isPlaying ? <ImCheckboxChecked size={14} /> : <ImCheckboxUnchecked size={14} />}음악 재생
            </MusicButton>
        </StandbySceenE>
    )
}

export default StandbySceen


const StandbySceenE = styled.div<{ $show: boolean, $action: boolean }>`
    display: ${({ $show }) => $show ? 'flex' : 'none'};
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    color: #FFF;
    background-color: var(--lightCream);
    z-index: 1;
    opacity: ${({ $action }) => $action ? '1' : '0'}; 
    transition: opacity 0.3s ease-in-out;

    &::after{
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: 
        url(${BackgroundImage});
        background-size: contain;
        background-position: bottom;
        background-repeat: no-repeat;
        transition: background-color 0.5s ease-in-out;
        z-index: -1; /* 자식 요소 위로 올리지 않도록 */
    }
`

const MusicButton = styled.div<{ $active: boolean }>`
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    font-size: 14px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    color: var(--copperBrown);
    opacity: ${({ $active }) => $active ? "1" : "0.7"};
`