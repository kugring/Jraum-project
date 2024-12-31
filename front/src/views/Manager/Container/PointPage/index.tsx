import usePointPageStore from 'store/manager/point-page.store'
import ChargeRequest from './ChargeRequeset';
import ChargeList from './ChargeList';
import DirectCharge from './DirectCharge';
import { useEffect } from 'react';

//              component: 포인트 페이지 컴포넌트                   //
const PointPage = () => {

    //          state: 서브 페이지 상태               //
    const subPage = usePointPageStore(state => state.subPage);
    const setSubPage = usePointPageStore(state => state.setSubPage);

    //          effect: 언마운트 될때만 실행되는 이펙트             //
    useEffect(() => () => setSubPage("직접충전"), [setSubPage]);

    //              render: 포인트 페이지 렌더링                //
    return (
        <>
            {subPage === "직접충전" &&
                <DirectCharge />
            }
            {subPage === "충전요청" &&
                <ChargeRequest />
            }
            {subPage === "충전내역" &&
                <ChargeList />
            }
        </>
    )
}

export default PointPage
