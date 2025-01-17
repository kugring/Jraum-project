import styled from 'styled-components';
import { MenuPageItem } from 'types/interface';
import { FaCaretLeft } from "react-icons/fa6";
import { useMenuPageStore } from 'store/manager';
import { memo, useEffect, useRef } from 'react'

//          component: 메뉴 카드 컴포넌트               //
const SequenceCard = ({ menu, index }: { menu: MenuPageItem, index: number }) => {

    //          render: 메뉴 카드 렌더링              //
    return (
        <CardE>
            <IndexE menu={menu} index={index} />
            <SequenceE menu={menu} sequence={menu.sequence} />
            <CardBodyE menu={menu} />
        </CardE>
    )
};
export default memo(SequenceCard);


//              component: 순서 컴포넌트                    //
const IndexE = ({ menu, index }: { menu: MenuPageItem, index: number }) => {

    //              state: 처음 렌더링 상태                 //
    const first = useRef(true);

    //              function: 달라진 순서를 저장하는 함수               //
    const appendEditSequence = () => {

        const appendMenuSequence = useMenuPageStore.getState().appendMenuSequence;
        const removeMenuSequence = useMenuPageStore.getState().removeMenuSequence;
        if (menu.sequence === index) {
            removeMenuSequence(menu.menuId)
        } else {
            appendMenuSequence(menu.menuId, index);
        }
    }

    //          effect: 달라진 순서를 확인하는 이펙트               //
    useEffect(() => {
        if (first.current) {
            first.current = false;
            return; // 아무것도 반환하지 않음 (void)
        }
        appendEditSequence();
    }, [index]);

    //              render: 순서 런데링                    //
    return (<Index>{index}</Index>)
}

//              component: 순서 컴포넌트                    //
const SequenceE = memo(({ sequence }: { menu: MenuPageItem, sequence: number }) => {
    //              render: 순서 런데링                    //
    return (
        <>
            <FaCaretLeft size={12} color='var(--mochaBrown)' />
            <Sequence>{sequence}</Sequence>
        </>
    )
})
//              component: 카드 내용 컴포넌트                    //
const CardBodyE = memo(({ menu }: { menu: MenuPageItem }) => {

    //              render: 카드 내용 런데링                    //
    return (
        <CardBody>
            <MenuImage src={menu.image} />
            <MenuName>{menu.name}</MenuName>
        </CardBody>
    )
});


const CardE = styled.div`
    flex: 1;
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

const Index = styled.div`
    flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 15px;
  height: 12px;
  font-size: 12px;
  color: var(--copperRed);
`

const Sequence = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding-right: 12px;
    width: 15px;
    height: 12px;
    font-size: 12px;
    color: var(--antiqueCream);
`


const CardBody = styled.div`
  flex: 10;
  display: flex;
  align-items: center;
  gap: 6px;
`

const MenuImage = styled.img`
  width: 18px;
  height: 18px;
  border-radius: 2px;
`

const MenuName = styled.div`
  font-size: 14px;
  color: var(--brickOrange);
`

