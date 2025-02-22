import { staffOptionId } from "constant";
import { MenuInfo, OrderListItem, OrderOption } from "types/interface";
import { create } from "zustand";

interface OrderItemStore {
  orderItem: OrderListItem;
  showOption: string;
  edit: boolean;
  incMQty: () => void;
  decMQty: () => void;
  setEdit: (isEdit: boolean) => void;
  incOpQty: (optionId: number) => void;
  decOpQty: (optionId: number) => void;
  setMenuId: (menuId: number) => void;
  addOption: (orderOption: OrderOption) => void;
  addOptions: (orderOptions: OrderOption[]) => void;
  setMenuInfo: (menuInfo: MenuInfo) => void;
  removeOption: (optionId: number) => void;
  setOrderItem: (orderItem: OrderListItem) => void;
  setShowOption: (optionDetail: string) => void;
  getTotalPrice: () => number;
  resetOrderItem: () => void;
  hasStaffDiscount: () => boolean;
}

const useOrderItemStore = create<OrderItemStore>((set, get) => ({
  // 주문 상태
  orderItem: {
    menuId: 0,
    quantity: 1,
    options: [],
    menuInfo: {
      menuId: 0,
      name: '',
      image: '',
      price: 0,
      temperature: '',
      options: [],
      sortedOptionCategory: []
    },
    staff: 0
  },
  showOption: "",
  edit: false,

  // 수량 증가
  incMQty: () => set((state) => ({ orderItem: { ...state.orderItem, quantity: state.orderItem.quantity + 1 } })),

  // 수량 감소
  decMQty: () => set((state) => ({ orderItem: { ...state.orderItem, quantity: state.orderItem.quantity > 1 ? state.orderItem.quantity - 1 : 1 } })),

  // 옵션 증가
  incOpQty: (optionId) => set((state) => ({ orderItem: { ...state.orderItem, options: state.orderItem.options.map((option) => (option.optionId === optionId ? { ...option, quantity: option.quantity < 5 ? option.quantity + 1 : 5 } : option)) } })),

  // 옵션 증가
  decOpQty: (optionId) => set((state) => ({ orderItem: { ...state.orderItem, options: state.orderItem.options.map((option) => (option.optionId === optionId ? { ...option, quantity: option.quantity > 0 ? option.quantity - 1 : 0 } : option)) } })),

  // 메뉴 Id 설정
  setEdit: (isEdit: boolean) => set(() => ({ edit: isEdit })),

  // 메뉴 Id 설정
  setMenuId: (menuId) => set((state) => ({ orderItem: { ...state.orderItem, menuId: menuId } })),

  // 옵션 개별 추가
  addOption: (orderOption) => set((state) => ({ orderItem: { ...state.orderItem, options: [...state.orderItem.options, orderOption] } })),

  // 옵션 통채로 추가
  addOptions: (orderOptions) => set((state) => ({ orderItem: { ...state.orderItem, options: [...state.orderItem.options, ...orderOptions] } })),

  // 메뉴 정보 설정
  setMenuInfo: (menuInfo) => set((state) => ({ orderItem: { ...state.orderItem, menuInfo: menuInfo } })),

  // 옵션 제거
  removeOption: (optionId: number) => set((state) => ({ orderItem: { ...state.orderItem, options: state.orderItem.options.filter((option) => option.optionId !== optionId) } })),

  // 주문 아이템 설정
  setOrderItem: (orderItem) => set({ orderItem: orderItem }),

  // 보여지는 옵션
  setShowOption: (optionDetail: string) => set(() => ({ showOption: optionDetail })),

  // 주문 정보 초기화
  resetOrderItem: () => set((state) => ({ ...state, orderItem: { menuId: 0, quantity: 1, options: [], menuInfo: { menuId: 0, name: '', image: '', price: 0, temperature: '', options: [], sortedOptionCategory: [] }, staff: 0 } })),

  getTotalPrice: () => {
    const { orderItem } = get();
    const { menuInfo, quantity, options } = orderItem;

    // 메뉴 가격
    const menuPrice = menuInfo?.price || 0;
    const menuQuantity = quantity || 0;

    // 옵션 가격 계산
    const menuOptions = menuInfo?.options || [];
    const orderOptions = options || [];

    const optionTotalPrice = orderOptions.reduce((sum, orderOption) => {
      const matchingMenuOption = menuOptions.find(
        (menuOption) => menuOption.optionId === orderOption.optionId
      );

      // 교역자 옵션(optionId: 100 -> constant에 상수로 지정되어있음)이 있는 경우 전체 가격을 0으로 설정
      if (orderOption.optionId === staffOptionId) {
        return 0;
      }

      if (matchingMenuOption) {
        return sum + matchingMenuOption.price * orderOption.quantity;
      }
      return sum;
    }, 0);

    return (menuPrice + optionTotalPrice) * menuQuantity;
  },

  // 교역자 할인 여부 확인 함수 추가
  hasStaffDiscount: () => {
    const { orderItem } = get();
    return orderItem.options.some(option => option.optionId === staffOptionId);
  },

}));

export default useOrderItemStore;
