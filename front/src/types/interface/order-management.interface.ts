import OrderDetail from "./order-detail.interface";

export default interface OrderManagement {
    name: string;
    division: string;
    orderId: number;
    hotCount: number;
    position: string;
    payMethod: string;
    coldCount: number;
    profileImage: string;
    totalQuantity: number;
    orderDetails: OrderDetail[]
}

