import { staffOptionId } from "constant";
import { OrderListItem, OrderOption } from "types/interface";
import { create } from "zustand";

interface OrderStore {
  orderList: OrderListItem[]; // 주문 리스트 상태
  cashName: string;
  waitingNum: number;
  incMQty: (menuId: number, options: OrderOption[]) => void;
  decMQty: (menuId: number, options: OrderOption[]) => void;
  setCashName: (cashName: string) => void;
  getQuantity: (menuId: number, options: OrderOption[]) => number | 0; // 수량 조회
  addOrderItem: (orderItem: OrderListItem) => void; // 주문 항목 추가
  setOrderList: (newOrderList: OrderListItem[]) => void; // 주문 리스트 설정
  getOrderItem: (menuId: number, options: OrderOption[]) => OrderListItem | undefined; // 추가된 함수
  setWaitingNum: (waitingNum: number) => void;
  getTotalPrice: () => number;
  resetOrderList: () => void; // 주문 리스트 초기화
  updateOrderItem: (orderItem: OrderListItem, updatedItem: OrderListItem) => void; // 주문 항목 업데이트
  removeOrderItem: (menuId: number, options: OrderOption[]) => void; // 주문 항목 제거
  filterZeroOptions: () => OrderListItem[];
  getOrderListLength: () => number | 0;
  hasStaffDiscount: () => boolean; // 교역자 할인 여부 확인 함수 추가
}

const useOrderStore = create<OrderStore>((set, get) => ({
  orderList: [],
  waitingNum: 0,
  cashName: '',

  // 현금결제 이름 설정
  setCashName: (cashName) => set({ cashName: cashName }),

  // 대기 팀 개수 설정
  setWaitingNum: (waitingNum) => set({ waitingNum: waitingNum }),

  // 수량 증가
  incMQty: (menuId, options) => set((state) => ({
    orderList: state.orderList.map((item) =>
      item.menuId === menuId && JSON.stringify(item.options) === JSON.stringify(options)
        ? { ...item, quantity: item.quantity < 50 ? item.quantity + 1 : 50 }
        : item
    )
  })),

  // 수량 감소
  decMQty: (menuId, options) => set((state) => ({
    orderList: state.orderList.map((item) =>
      item.menuId === menuId && JSON.stringify(item.options) === JSON.stringify(options)
        ? { ...item, quantity: item.quantity > 0 ? item.quantity - 1 : 0 }
        : item
    )
  })),

  // 주문 리스트 전체 설정
  setOrderList: (newOrderList) => set({ orderList: newOrderList }),

  // 주문 항목 추가 (중복 시 quantity 증가)
  addOrderItem: (orderItem) =>
    set((state) => {
      const existingIndex = state.orderList.findIndex((item) => {
        const sortedItemOptions = JSON.stringify(item.options.sort((a, b) => a.optionId - b.optionId));
        const sortedOrderItemOptions = JSON.stringify(orderItem.options.sort((a, b) => a.optionId - b.optionId));

        return (
          item.menuId === orderItem.menuId &&
          sortedItemOptions === sortedOrderItemOptions
        );
      });

      if (existingIndex !== -1) {
        const updatedOrderList = [...state.orderList];
        updatedOrderList[existingIndex].quantity += orderItem.quantity;
        return { orderList: updatedOrderList };
      }

      return { orderList: [...state.orderList, orderItem] };
    }),

  // 주문 항목 업데이트 (menuId와 options 조합으로 찾기)
  updateOrderItem: (orderItem, updatedItem) =>
    set((state) => ({
      orderList: state.orderList.map((item) =>
        item.menuId === orderItem.menuId && JSON.stringify(item.options) === JSON.stringify(orderItem.options)
          ? updatedItem
          : item
      ),
    })),

  // 주문 항목 제거 (menuId와 options 조합으로 찾기)
  removeOrderItem: (menuId, options) =>
    set((state) => ({
      orderList: state.orderList.filter(
        (item) => item.menuId !== menuId || JSON.stringify(item.options) !== JSON.stringify(options)
      ),
    })),

  // 주문 리스트 초기화
  resetOrderList: () =>
    set(() => ({
      orderList: [],
    })),

  // 주문 항목의 수량 조회
  getQuantity: (menuId, options) => {
    const foundItem = get().orderList.find(
      (item) => item.menuId === menuId && JSON.stringify(item.options) === JSON.stringify(options)
    );
    return foundItem ? foundItem.quantity : 0;
  },

  // 주문의 개수 조회
  getOrderListLength: () => { return get().orderList.length },

  // 주문 항목 찾기
  getOrderItem: (menuId, options) => {
    return get().orderList.find(
      (item) =>
        item.menuId === menuId && JSON.stringify(item.options) === JSON.stringify(options)
    );
  },
  // 총 가격 계산
  getTotalPrice: () => {
    return get().orderList.reduce((total, orderItem) => {
      // 교역자 옵션이 있는 경우 해당 주문 항목의 가격을 0으로 설정
      const hasStaffOption = orderItem.options.some(option => option.optionId === staffOptionId);
      if (hasStaffOption) {
        return total;
      }

      const menuPrice = orderItem.menuInfo?.price || 0;
      const menuQuantity = orderItem.quantity || 0;

      // 옵션 가격 계산
      const menuOptions = orderItem.menuInfo?.options || [];
      const orderOptions = orderItem.options || [];

      const optionsTotal = orderOptions.reduce((optTotal, orderOption) => {
        const optionInfo = menuOptions.find(
          (menuOption) => menuOption.optionId === orderOption.optionId
        );
        const optionPrice = optionInfo ? optionInfo.price * orderOption.quantity : 0;
        return optTotal + optionPrice;
      }, 0);

      const itemTotal = (menuPrice + optionsTotal) * menuQuantity;
      return total + itemTotal;
    }, 0);
  },

  // 교역자 할인이 적용된 주문이 있는지 확인
  hasStaffDiscount: () => {
    return get().orderList.some(orderItem => 
      orderItem.options.some(option => option.optionId === staffOptionId)
    );
  },

  // 옵션 수량이 0인 항목 제거하고, 업데이트된 orderList를 반환
  filterZeroOptions: () => {
    const updatedOrderList = get().orderList.map((orderItem) => ({
      ...orderItem,
      options: orderItem.options.filter((option) => option.quantity > 0),
    }));

    set({ orderList: updatedOrderList });
    return updatedOrderList;
  },
}));

export default useOrderStore;
