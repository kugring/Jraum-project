import styled from 'styled-components'
import useDebounced from 'hooks/useDebounced';
import { IoSearch } from 'react-icons/io5'
import { memo, useEffect, useState } from 'react'



//              component: 주문자 이름 검색 필터 컴포넌트              //
const SearchFilter = ({setSearchName} : {setSearchName: (name: string) => void}) => {

    //         state: 이름 상태       //
    const [value, seValue] = useState('');

;
    //          function: 이름 입력에 대한 디바운드 설정 함수           //
    const debouncedName = useDebounced(value, 500);

    //          effect: 이름 입력에 대한 디바운드 설정 함수가 변경되면 이름 변경 함수 호출          //
    useEffect(() => {
        setSearchName(debouncedName)
    }, [debouncedName, setSearchName])

    //          render: 주문자 이름 검색 필터 컴포넌트 렌더링             //
    return (
        <SearchFilterE>
            <Input value={value} onChange={(e) => seValue(e.target.value)} placeholder={'이름 또는 번호를 입력해주세요'}></Input>
            <IoSearch size={20} color={"var(--orange)"} />
        </SearchFilterE>
    )
}

export default memo(SearchFilter);


const SearchFilterE = styled.div`
    display: flex;
    padding: 8px 12px;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
    background: #FFF;
`

const Input = styled.input`
    flex: 1;
    color: var(--copperBrown);
    outLine: none;
    border: none;
    padding: none;
    font-size: 16px;
    font-family: "ONE Mobile POP";

    &::placeholder {
        color: var(--antiqueCream);    // placeholder 색상 설정
        font-size: 14px;    // placeholder 폰트 크기 설정
        font-family: "ONE Mobile POP";  // 원하는 폰트 적용 (선택 사항)
    }
`