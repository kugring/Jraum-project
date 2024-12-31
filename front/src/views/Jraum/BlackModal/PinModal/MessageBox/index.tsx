import { memo, useEffect, useRef, useState } from 'react';
import usePinUserStore from 'store/pin-user.store';
import styled from 'styled-components';

//          component: 메세지 박스 컴포넌트         //
const MessageBox = () => {
    //      state: 메세지 상태 (전역 변수)        //
    const message = usePinUserStore(state => state.message);
    //      state: 메세지 보여짐 상태          //
    const [show, setShow] = useState(true);
    //      state: 메세지 텍스트 상태          //
    const [messageText, setMessageText] = useState<string>('* 초기번호: 전화번호 뒷자리 *');

    // 처음 렌더링 여부를 추적하는 ref
    const isFirstRender = useRef(true);

    //      effect: 메세지 변경에 따른 효과         //
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        setShow(false);
        setTimeout(() => {
            setMessageText(message);
            setShow(true);
        }, 300);
    }, [message]);

    //          render: 메세지 박스 렌더링          //
    return (
        <MessageBoxE $show={show}>
            {messageText}
        </MessageBoxE>
    );
};

export default memo(MessageBox);

const MessageBoxE = styled.div<{$show: boolean}>`
  color: var(--copperOrange);
  padding: 8px 0 12px 0;
  font-size: 20px;

  opacity: ${({ $show }) => ($show ? '1' : '0')};
  transition: opacity 0.3s ease-in;
`;
