import OptionButtonBox from './OptionButtonBox';
import useOrderItemStore from 'store/modal/order-list-item.store';
import { memo } from 'react';
import { buttonOptions, countOptions } from 'constant';
import OptionCountBox from './OptionCountBox';


//          component: 옵션 박스 컴포넌트           //
const OptionBox = () => {

    //          state: 선택된 옵션의 카테고리 상태              //
    const showOption = useOrderItemStore(state => state.showOption)
    //      state: 메뉴 옵션들     //
    const filterOptions = useOrderItemStore.getState().orderItem.menuInfo?.options?.filter(item => item.category === showOption);


    //          render: 옵션 버튼 렌더링            //
    return (
        <>
            {buttonOptions.includes(showOption) && (
                <OptionButtonBox />
            )}
            {countOptions.includes(showOption) && (
                <OptionCountBox options={filterOptions} />
            )}
        </>
    )
}
export default memo(OptionBox); 
