import styled from 'styled-components'
import useOrderItemStore from 'store/modal/order-list-item.store';
import { memo, useMemo } from 'react'
import { OptionListItem } from 'types/interface';

//          component: 버튼 형식의 옵션 박스 컴포넌트           //
const OptionButtonBox = () => {

    //          state: 선택된 옵션의 카테고리 상태              //
    const showOption = useOrderItemStore(state => state.showOption)
    //      state: 필터된 메뉴 옵션들     //
    const menuOptions = useOrderItemStore.getState().orderItem.menuInfo?.options?.filter(item => item.category === showOption);
    //          메모이제이션된 Label 컴포넌트 생성         //
    const labelMemo = useMemo(() => <Label>선택</Label>, []);  // Label은 한 번만 렌더링됨

    //          render: 버튼 형식의 옵션 렌더링         //
    return (
        <ButtonBox>
            {labelMemo}
            <Buttons>
                {menuOptions.map((menuOption) => (
                    <Button key={menuOption.detail} menuOption={menuOption}/>
                ))}
            </Buttons>
        </ButtonBox>
    )
}
export default memo(OptionButtonBox);


//          interface: 옵션버튼 프롭스          //
interface ButtonProps {
    menuOption: OptionListItem;
}

//              component: 옵션 버튼 형식 컴포넌트                  //
const Button = memo(({ menuOption }: ButtonProps) => {

    //          state: 선택된 옵션의 카테고리 상태              //
    const addOption = useOrderItemStore.getState().addOption;
    const removeOption = useOrderItemStore.getState().removeOption;
    //          state: 주문 옵션들 상태            //
    const orderOptionIdList = useOrderItemStore(state => state.orderItem.options).map(option => option.optionId);
    //      state: 필터된 메뉴 옵션들     //
    const menuOptions = useOrderItemStore.getState().orderItem.menuInfo?.options?.filter(item => item.category === useOrderItemStore.getState().showOption);

    //          function: 기존 옵션에서 현재 선택된 옵션 값을 제거하고 새로운 옵션 값으로 변경하는 함수          //
    const changeOption = (optionId: number) => {
        const orderOptionIdList = useOrderItemStore.getState().orderItem.options.map(option => option.optionId);
        const existedOptionId = menuOptions.find(option =>  orderOptionIdList.some(optionId => optionId === option.optionId))?.optionId || 0;
        // 이미 옵션 값이 존재하는 경우에는 리턴
        if(!orderOptionIdList.includes(optionId)){
            removeOption(existedOptionId);
            addOption({ optionId: optionId, quantity: 1 })
        }
    }


    //              render: 옵션 버튼 형식 렌더링                  //
    return (
        <ButtonE $select={orderOptionIdList.includes(menuOption.optionId)} onClick={() => changeOption(menuOption.optionId)}>
            {menuOption.detail}
        </ButtonE>
    )
})

const ButtonBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 120px;
  
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
    justify-content: start;
    height: 60px;
    gap: 14px;
    }
`

const Label = styled.div`
    width: 140px;
    text-align: center;
    font-size: 36px;
    color: var(--brickOrange);
  /* 반응형 스타일 적용 */
  @media (max-width: 768px) {
    width: 88px;
    font-size: 20px;
  }
`

const Buttons = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding-right: 12px;
    width: 363px;
    
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        flex: 1;
        width: auto;
        gap: 6px;
        padding-right: 6px;
    }
`

const ButtonE = styled.div<{ $select: boolean }>`
    flex:1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 0;
    font-size: 26px;
    border-radius: 10px;
    color: #FFF;
    border: 5px solid var(--coralPink);
    background-color: var(--coralOrange);
    opacity: ${({ $select }) => ($select ? '1' : '0.4')};
    
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        font-size: 12px;
        border-radius: 6px;
        padding: 8px 0;
        border: 2px solid var(--coralPink);
    }
`