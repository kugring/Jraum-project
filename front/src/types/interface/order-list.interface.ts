import OrderDetail from "./order-detail.interface";

export default interface OrderList {
    orderId: number;
    name: string;
    point: number;
    status: string;
    office: string;
    position: string;
    payMethod: string;
    createdAt: Date;  // Date 객체로 변경
    updatedAt: Date;  // Date 객체로 변경
    totalPrice: number;
    profileImage: string;
    totalQuantity: number;
    orderDetails: OrderDetail[];
}
