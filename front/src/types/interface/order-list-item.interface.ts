import MenuInfo from "./menu-data.interface";
import OrderOption from "./order-option.interface";

export default interface OrderListItem {
  menuId: number;
  quantity: number;
  options: OrderOption[];
  menuInfo: MenuInfo;
}
