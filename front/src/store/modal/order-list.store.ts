import { OrderListItem, OrderOption } from "types/interface";
import { create } from "zustand";

interface OrderStore {
  orderList: OrderListItem[]; // 주문 리스트 상태
  cashName: string;
  waitingNum: number;
  setCashName: (cashName: string) => void;
  setWaitingNum: (waitingNum: number) => void;
  incMQty: (menuId: number, options: OrderOption[]) => void;
  decMQty: (menuId: number, options: OrderOption[]) => void;
  setOrderList: (newOrderList: OrderListItem[]) => void; // 주문 리스트 설정
  addOrderItem: (orderItem: OrderListItem) => void; // 주문 항목 추가
  resetOrderList: () => void; // 주문 리스트 초기화
  updateOrderItem: (orderItem: OrderListItem, updatedItem: OrderListItem) => void; // 주문 항목 업데이트
  removeOrderItem: (menuId: number, options: OrderOption[]) => void; // 주문 항목 제거
  getQuantity: (menuId: number, options: OrderOption[]) => number | 0; // 수량 조회
  getOrderListLength: () => number | 0;
  getOrderItem: (menuId: number, options: OrderOption[]) => OrderListItem | undefined; // 추가된 함수
  getTotalPrice: () => number;
  filterZeroOptions: () => OrderListItem[];
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
        // 각 options 배열을 정렬하여 비교  
        const sortedItemOptions = JSON.stringify(item.options.sort((a, b) => a.optionId - b.optionId));
        const sortedOrderItemOptions = JSON.stringify(orderItem.options.sort((a, b) => a.optionId - b.optionId));

        return item.menuId === orderItem.menuId && sortedItemOptions === sortedOrderItemOptions;
      });

      if (existingIndex !== -1) {
        // 기존 항목이 있다면 quantity 증가
        const updatedOrderList = [...state.orderList];
        updatedOrderList[existingIndex].quantity += orderItem.quantity;

        return {
          orderList: updatedOrderList,
        };
      }

      // 기존 항목이 없으면 새 항목 추가
      return {
        orderList: [...state.orderList, orderItem],
      };
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
      // 메뉴 가격과 수량이 undefined일 경우 기본값을 0으로 설정
      const menuPrice = orderItem.menuInfo?.price || 0;
      const menuQuantity = orderItem.quantity || 0;

      // 옵션 가격 계산
      const menuOptions = orderItem.menuInfo?.options || [];
      const orderOptions = orderItem.options || [];

      const optionsTotal = orderOptions.reduce((optTotal, orderOption) => {
        // 메뉴 옵션 중 일치하는 옵션 찾기
        const optionInfo = menuOptions.find(
          (menuOption) => menuOption.optionId === orderOption.optionId
        );

        // 옵션 정보가 존재할 경우 옵션 가격 * 옵션 수량
        const optionPrice = optionInfo ? optionInfo.price * orderOption.quantity : 0;
        return optTotal + optionPrice;
      }, 0);

      // (메뉴 개당 가격 + 옵션 총합 가격) * 메뉴 수량
      const itemTotal = (menuPrice + optionsTotal) * menuQuantity;

      return total + itemTotal;
    }, 0);
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
