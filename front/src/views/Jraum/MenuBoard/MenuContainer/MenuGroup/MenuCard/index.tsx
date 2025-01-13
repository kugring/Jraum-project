import { getMenuOptionRequest } from 'apis';
import { ResponseDto } from 'apis/response';
import { GetMenuOptionResponseDto } from 'apis/response/menu';
import { buttonOptions, countOptions, formattedPoint, optionCategories } from 'constant';
import { memo } from 'react';
import useBlackModalStore from 'store/modal/black-modal.store';
import useOrderItemStore from 'store/modal/order-list-item.store';
import styled from 'styled-components';
import { MenuInfo, OptionListItem, OrderOption } from 'types/interface';

//          interface: 메뉴카드 Props          //
interface MenuCardProps {
    menuId: number;
    image: string;
    name: string;
    price: number;
    temperature: string;
}

//          component: 메뉴 카드 컴포넌트           //
const MenuCard = ({ menuId, image, name, price, temperature }: MenuCardProps) => {

    //          function: MenuInfoStore Set 함수 (전역변수)           //
    const setMenuInfo = useOrderItemStore(state => state.setMenuInfo);
    //          function: 화이트 모달 설정 함수 (전역변수)           //
    const setWhiteModal = useBlackModalStore(state => state.setWhiteModal);
    //          function: BlackModal Open 함수 (전역변수)           //
    const openModal = useBlackModalStore(state => state.openModal);
    //          function: 메뉴 ID 설정하는 함수 (전역변수)            //
    const setMenuId = useOrderItemStore(state => state.setMenuId);
    //          function: 메뉴 ID 설정하는 함수 (전역변수)            //
    const setShowOption = useOrderItemStore(state => state.setShowOption);
    //          function: 주문 아이템 리셋하는 함수 (전역변수)            //
    const resetOrderItem = useOrderItemStore(state => state.resetOrderItem);
    //      function: 주문 아이템에 옵션을 추가하는 함수           //
    const addOptions = useOrderItemStore((state) => state.addOptions);
    //          function: MenuBlackModalStore로 데이터 저장하는 함수         //
    const menuModalOpen = () => {
        getMenuOptionRequest(menuId).then(getMenuOptionResponse);
    }
    //          function: get MenuOption Resposne 처리 함수           //
    const getMenuOptionResponse = (responseBody: GetMenuOptionResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert("데이터베이스 오류입니다.");
        if (code === 'NMN') alert("존재하지 않는 메뉴 입니다.");
        if (code !== 'SU') return;
        if (code === 'SU') {
            // 해당 Dto에서 데이터를 가져와서 options를 추출해와서 const로 담는다.
            const { options } = responseBody as GetMenuOptionResponseDto;
            // 메뉴 모달에서 useEffect로 처리하지 않고 시작될때 부터 데이터 설정하고 시작해야 렌더링이 덜하다.
            const menuInfoData = newMenuInfo(menuId, name, price, image, temperature, options, sortedCategories(options));
            resetOrderItem();
            setShowOption(sortedCategories(options)[0])
            defaultOptionSetting(options);
            setMenuInfo(menuInfoData);
            setMenuId(menuId);
            setWhiteModal('메뉴')

            // 데이터 설정이 끝난 후 모달 열기
            if (menuInfoData) {
                setTimeout(() => openModal(), 0);
            }
        }
    }
    //      function: new MenuInfo 객체 생성           //
    const newMenuInfo = (menuId: number, name: string, price: number, image: string, temperature: string, options: OptionListItem[], sortedOptionCategory: string[]): MenuInfo => {
        return { menuId, name, price, image, temperature, options, sortedOptionCategory };
    };
    //      function: 선택된 메뉴의 옵션의 중복 제거된 옵선 카테고리들 정리해주는 함수          //
    const sortedCategories = (options: OptionListItem[]) => {
        // 중복된 카테고리를 제거하고 고유 카테고리만 추출
        const uniqueCategories = Array.from(new Set(options.map(option => option.category)));

        // optionCategories 순서에 따라 정렬
        return uniqueCategories.sort((a, b) => {
            const aIndex = optionCategories.indexOf(a);
            const bIndex = optionCategories.indexOf(b);

            // a와 b가 optionCategories에 없을 경우
            if (aIndex === -1 && bIndex === -1) return 0;
            if (aIndex === -1) return 1;  // b는 optionCategories에 있지만 a는 없음
            if (bIndex === -1) return -1; // a는 optionCategories에 있지만 b는 없음

            // 둘 다 optionCategories에 있을 경우, 인덱스 비교로 정렬
            return aIndex - bIndex;
        });
    };

    //      function: 처음 렌더링 시 각 카테고리별 디폴트 설정 해주는 함수      //
    const defaultOptionSetting = (options: OptionListItem[]) => {
        // 기본 옵션 생성
        const buttonOptionList = sortedCategories(options).filter(item => buttonOptions.includes(item));
        const countOptionList = sortedCategories(options).filter(item => countOptions.includes(item));

        // options를 미리 필터링하여 반복적으로 사용
        const filteredOptions = (category: string) =>
            options?.filter(item => item.category === category) || [];

        // 버튼 옵션을 처리: 필터링 후 옵션 선택
        const newDefaultButtonOptions = buttonOptionList
            .map(category => {
                const orderOptions = filteredOptions(category);
                return orderOptions.length > 0
                    ? { optionId: orderOptions[0].optionId, quantity: 1 }
                    : null;
            })
            .filter(Boolean) as OrderOption[]; // null 제거 후 타입 단언

        // 카운트 옵션 처리: 필터링 후 옵션 매핑
        const newDefaultCountOptions = countOptionList
            .flatMap(category => {
                const orderOptions = filteredOptions(category);
                return orderOptions.map(orderOption => ({
                    optionId: orderOption.optionId, // orderId를 optionId로 변경
                    quantity: 0
                }));
            }) as OrderOption[]; // 타입 단언: 평탄화 후 OrderOption[] 타입으로 처리

        // 상태 업데이트
        addOptions([...newDefaultButtonOptions, ...newDefaultCountOptions]);

    }

    //          render: 메뉴 카드 컴포넌트 렌더링           // 
    return (
        <Card onClick={menuModalOpen}>
            <Image src={image} alt={'메뉴 이미지'} />
            <InfoBox>
                <MenuName>{name}</MenuName>
                <MenuPrice>{formattedPoint(price)}원</MenuPrice>
            </InfoBox>
            <Temperature>{temperature}</Temperature>
        </Card>
    )
}

export default memo(MenuCard);

const Card = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 180px;    
    @media (max-width: 768px) {
        width: 150px;
    }
`

const InfoBox = styled.div`
    display: flex;
    flex-direction: column;
    padding: 8px 0 8px 2px;
    gap: 2px;
`

const Image = styled.img`
    width: 180px;
    height: 180px;
    border-radius: 15px;
    box-shadow: 3px 3px 3px 0px #BDAEA6;
    /* box-shadow: -3px -3px 3px 0px #FFFFFA, 3px 3px 3px 0px #BDAEA6; */
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        width: 150px;
        height: 150px;
        border-radius: 10px;
    }
`

const MenuName = styled.div`
    font-size: 22px;
    color: var(--brickOrange);
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        font-size: 18px;
    }
`

const MenuPrice = styled.div`
    font-size: 24px;
    letter-spacing: 0.5px;
    color: var(--copperBrown);
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        font-size: 20px;
    }
`

const Temperature = styled.div`
    position: absolute;
    top:10px;
    left: 10px;
    align-self: baseline;
    padding: 2px 4px;
    font-size: 16px;
    border-radius: 4px;
    color: #fff;
    font-weight:400;
    background-color: ${(props) => (props.children === "HOT" ? "#E7727A " : "#5C76D1")};
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        font-size: 12px;    
    }
`;