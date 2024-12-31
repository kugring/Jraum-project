import styled from 'styled-components';
import { OptionListItem } from 'types/interface';
import OptionQuantityBox from './OptionQuantityBox';
import { memo } from 'react';

//          interface: 옵션 카운트 형식 박스 프롭스          //
interface OptionCountBoxProps {
    options: OptionListItem[];
}

//          component: 옵션 카운트 형식 박스 컴포넌트            //
const OptionCountBox = ({ options }: OptionCountBoxProps) => {
    //          render: 옵션 카운트 형식 박스 렌더링            //
    return (
        <CountBox>
            {options.map((option) => (
                <OptionQuantityBox key={option.optionId} option={option} />
            ))}
        </CountBox>
    )
}

export default memo(OptionCountBox);


const CountBox = styled.div`
  display: flex;
  flex-direction: column;
`