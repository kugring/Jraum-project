import { patchMenuSuquenceRequest } from 'apis';
import { patchMenuSuquenceRequestDto } from 'apis/request/menu';
import { ResponseDto } from 'apis/response';
import { PatchMenuSequenceResponseDto } from 'apis/response/menu';
import { formattedPoint } from 'constant';
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import useMenuPageStore from 'store/manager/menu-page.store';
import useBlackModalStore from 'store/modal/black-modal.store';
import styled from 'styled-components';
import { MenuPageItem } from 'types/interface';

//          component: 메뉴 카드 컴포넌트               //
const Card = ({ index }: { menu: MenuPageItem, index: number }) => {

    //          state: 쿠키 상태                //
    const [cookies,] = useCookies(["managerToken"]);
    //          state: 메뉴 상태            //
    const menu = useMenuPageStore(state => state.menuList[index-1])
    //          state: 순서 상태            //
    const [sequence, setSequence] = useState<number>(menu.sequence);


    //              function: 모달 여는 함수                //
    const openModal = useBlackModalStore.getState().openModal;
    //              function: 화이트 모달 설정 함수             //
    const setWhiteModal = useBlackModalStore.getState().setWhiteModal;
    //              function: 메뉴 수정 정보 설정 함수              //
    const setEditMenu = useMenuPageStore.getState().setEditMenu;
    //              function: 메뉴 추가 모달을 여는 함수            //
    const menuEditModal = () => { openModal(); setWhiteModal("메뉴수정"); setEditMenu(menu);};
    //          function: 메뉴 순서 수정하는 함수           //
    const editSequence = () => {
        if (!cookies.managerToken) return;
        const menuId = menu.menuId;
        const sequence = index;
        const requestBody: patchMenuSuquenceRequestDto = { menuId, sequence };
        patchMenuSuquenceRequest(requestBody, cookies.managerToken).then(patchMenuSuquenceResponse)
    }
    //          function: 메뉴 순서 수정 처리 결과 확인 함수            //
    const patchMenuSuquenceResponse = (responseBody: PatchMenuSequenceResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMN') alert('존재하지 않는 메뉴입니다.');
        if (code === 'NMG') alert('존재하지 않는 관리자입니다.');
        if (code !== 'SU') return;
        console.log(menu.name + ": " + menu.sequence + " -> " + index);
        //  순서값이 변동 되었을때 menu.sequence값을 DB에서 가져오지 않고 수정된 index값을 상태로 지닌다.
        setSequence(index);
    }

    //          effect: 달라진 순서를 확인하는 이펙트               //
    useEffect(() => {
        if (sequence !== index) {
            editSequence();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index]);

    //          render: 메뉴 카드 렌더링              //
    return (
        <CardE>
            <Sequence>{index}</Sequence>
            <Divider></Divider>
            <MenuImage src={menu.image} />
            <MenuName>{menu.name}</MenuName>
            <MenuPrice>{formattedPoint(menu.price)}원</MenuPrice>
            <MenuEdit onClick={menuEditModal}>편집</MenuEdit>
        </CardE>
    )
}
export default Card;



const CardE = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px;
  gap: 6px;
  border-radius: 4px;
  box-sizing: border-box;
  border: 0.4px solid var(--copperRed);
  background: #FFF;
`

const Sequence = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 15px;
  height: 12px;
  font-size: 12px;
  color: var(--copperRed);
`


const Divider = styled.div`
  display: flex;
  width: 1px ;
  height: 20px;
  border-left: 1px solid #c0c0c0;
`

const MenuImage = styled.img`
  width: 18px;
  height: 18px;
  border-radius: 2px;
`

const MenuName = styled.div`
  flex: 1;
  font-size: 14px;
  color: var(--brickOrange);
`

const MenuPrice = styled.div`
  color: var(--mochaBrown);
  font-size: 14px;
`

const MenuEdit = styled.div`
display: flex;
justify-content: center;
align-items: center;
height: 22px;
padding: 0px 8px;
border-radius: 4px;
background: var(--orange);
color: #FFF;
font-size: 14px;
`