import styled from 'styled-components';
import { memo } from 'react';
import useOrderStore from 'store/modal/order-list.store';
import { buttonOptions, formattedPoint, optionCategories } from 'constant';
import OrderCardCount from './OrderCardCount';
import { OrderListItem, OrderOption } from 'types/interface';

//      interface: 주문 아이템 박스 프롭스       //
interface OrderItemBoxProps {
  tem: string;
  name: string;
  price: number;
  image: string;
  menuId: number;
  options: OrderOption[];
}

//      component: 주문 아이템 박스 컴포넌트          //
const OrderItemBox = ({ name, image, price, menuId, tem, options }: OrderItemBoxProps) => {




  //      render: 주문 아이템 박스 컴포넌트         //
  return (
    <OrderItemBoxE>
      <InfoBox>
        <Img src={image} alt='이미지' />
        <Info>
          <Name>{name}</Name>
          <Price price={price} menuId={menuId} options={options} />
        </Info>
      </InfoBox>
      <OrderCardCount menuId={menuId} options={options} />
      <OptionBadges menuId={menuId} options={options} tem={tem} />
    </OrderItemBoxE>
  );
};
export default memo(OrderItemBox, (prevProps, nextProps) => { return prevProps.menuId === nextProps.menuId });

//      component: 옵션 뱃지들 컴포넌트       //
const OptionBadges = ({menuId, options, tem}: {menuId: number, options: OrderOption[], tem: string}) => {

  //      state: 주문 아이템 옵션들 상태        //
  const getOrderItem = useOrderStore(state => state.getOrderItem)
  const orderItem = getOrderItem(menuId, options);

  //        function: 필요한 옵션만 필터하는 함수         //
  const processAndSortOptions = (orderItem: OrderListItem) => {
    // 주문 항목과 메뉴 옵션이 없으면 빈 배열 반환
    if (!orderItem.menuInfo || !orderItem.menuInfo.options) {
      return [];
    }

    const orderOptions = orderItem.options; // 주문 옵션 상태
    const menuOptions = orderItem.menuInfo.options; // 메뉴 옵션 상태

    // 옵션 데이터 결합 및 필터링
    const combinedAndFilteredOptions = orderOptions
      .map((orderOption) => {
        const menuOption = menuOptions.find(
          (menuOption) => menuOption.optionId === orderOption.optionId
        );

        // 메뉴 옵션이 존재하지 않을 경우 null로 처리
        if (!menuOption) {
          return null;
        }

        return {
          detail: menuOption.detail,
          category: menuOption.category,
          type: menuOption.type,
          quantity: orderOption.quantity,
        };
      })
      .filter(
        (option) =>
          option !== null &&
          (option!.type !== "count" || option!.quantity > 0) &&
          option!.detail !== "보통" &&
          option!.detail !== "보통컵" &&
          option!.detail !== "뜨거움" &&
          option!.detail !== "기본" &&
          option!.detail !== "없음"
      );

    // 카테고리 기준 정렬
    const categoryOrder = new Map(optionCategories.map((category, index) => [category, index]));
    return combinedAndFilteredOptions.sort((a, b) => {
      const indexA = categoryOrder.get(a!.category) ?? Infinity;
      const indexB = categoryOrder.get(b!.category) ?? Infinity;
      return indexA - indexB;
    });
  };
  //      state: 뱃지로 표기될 옵션들       //
  const menuOptions = processAndSortOptions(orderItem!);


  //      render: 옵션 뱃지들 렌더링       //
  return (
    <OptionBadgesE>
      <Badge $category={tem}>{tem}</Badge>
      {menuOptions.map((item) => (
        <Badge key={item?.detail} $category={item?.category!}>
          { buttonOptions.includes(item?.category!) ? 
            item?.detail
            :
            item?.detail +' '+ item?.quantity 
          }
        </Badge>
      ))}
    </OptionBadgesE>
  )
}


//      component: 주문 아이템 가격 컴포넌트        //
const Price = ({ price, menuId, options }: { price: number, menuId: number, options: OrderOption[] }) => {


  //      state: 주문 아이템 옵션들 상태        //
  const getOrderItem = useOrderStore(state => state.getOrderItem)
  const orderItem = getOrderItem(menuId, options);

  //      state: 주문 아이템 옵션들의 합계 결제 금액        //
  const optionsPrice = orderItem!.options.reduce((optionTotal, option) => {
    const optionInfo = orderItem!.menuInfo.options.find(opt => opt.optionId === option.optionId);
    const optionPrice = optionInfo ? optionInfo.price : 0; // 옵션 가격
    return optionTotal + (optionPrice * option.quantity);
  }, 0);

  //          state: 주문의 최종 결제 금액 상태            //
  const OrderItemPirce = (price + optionsPrice) * orderItem!.quantity;


  //      render: 주문 아이템 가격 렌더링       //
  return (
    <PriceE>{formattedPoint(OrderItemPirce)}원</PriceE>
  )
}

// 스타일드 컴포넌트
const OrderItemBoxE = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 12px;
  margin-bottom: 5px;
  border-radius: 8px;
  border: 2px solid var(--sunsetPeach);
  box-sizing: border-box;
  background: #FFF5EE;
  box-shadow: 5px 5px 5px 0px #C4A08C;
  scroll-snap-align: start;
    
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
      height: 52px;
     padding: 8px;
  }
`;

const InfoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Img = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 6px;
`;

const Name = styled.div`
  font-size: 16px;
  color: var(--brickOrange);
    
  /* 반응형 스타일 적용 */
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const PriceE = styled.div`
  font-size: 14px;
  color: var(--copperBrown);
  
  /* 반응형 스타일 적용 */
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const OptionBadgesE = styled.div`
  position: absolute;
  top: -20%;
  left: 3%;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Badge = styled.div<{$category: string}>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px 4px;
  font-size: 12px;
  white-space: nowrap;
  color: #FFF;
  border-radius: 5px;
  background-color: ${(props) => {
  switch (props.$category) {
    case "HOT":
      return "var(--hot)";
    case "COLD":
      return "var(--cold)";
    case "온도":
      return "var(--hot)";
    case "얼음":
      return "var(--cold)";
    case "컵크기":
      return "var(--orange)";
    default:
      return "var(--goldenOrange)";
  }
}};
`;
