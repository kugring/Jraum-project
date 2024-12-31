import orderDetailOption from "./order-detail-option.interface";

export default interface OrderDetail {

    orderDetailId: number,
    menuId: number,
    name: string,
    image: string,
    category: string,
    temperature: string,
    price: number,
    status: number,
    sequence: number,
    quantity: number,
    espressoShot: number,
    totalPrice: number,
    options: orderDetailOption[], 
}

