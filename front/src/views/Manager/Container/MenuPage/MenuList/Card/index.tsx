import styled from 'styled-components';
import { memo } from 'react'
import { MenuPageItem } from 'types/interface';
import { formattedPoint } from 'constant';
import { useMenuPageStore } from 'store/manager';
import { useBlackModalStore } from 'store/modal';

//          component: 메뉴 카드 컴포넌트               //
const Card = ({ menu, index }: { menu: MenuPageItem, index: number }) => {

    //          render: 메뉴 카드 렌더링              //
    return (
        <CardE>
            <SequenceE menu={menu} index={index} />
            <Divider />
            <CardBodyE menu={menu} />
        </CardE>
    )
};
export default memo(Card);


//              component: 순서 컴포넌트                    //
const SequenceE = ({ index }: { menu: MenuPageItem, index: number }) => {
    //              render: 순서 런데링                    //
    return (<Sequence>{index}</Sequence>)
}
//              component: 카드 내용 컴포넌트                    //
const CardBodyE = ({ menu }: { menu: MenuPageItem }) => {

    //              function: 모달 여는 함수                //
    const openModal = useBlackModalStore.getState().openModal;
    //              function: 화이트 모달 설정 함수             //
    const setWhiteModal = useBlackModalStore.getState().setWhiteModal;
    //              function: 메뉴 수정 정보 설정 함수              //
    const setEditMenu = useMenuPageStore.getState().setEditMenu;
    //              function: 메뉴 추가 모달을 여는 함수            //
    const menuEditModal = () => { openModal(); setWhiteModal("메뉴수정"); setEditMenu(menu); };

    //              render: 카드 내용 런데링                    //
    return (
        <>
            <MenuImage src={menu.image} />
            <MenuName>{menu.name}</MenuName>
            <MenuPrice>{formattedPoint(menu.price)}원</MenuPrice>
            <MenuEdit onClick={menuEditModal}>편집</MenuEdit>
        </>
    )
}


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