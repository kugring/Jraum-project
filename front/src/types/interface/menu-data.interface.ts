import OptionListItem from "./menu-option-list-item.interface";

export default interface MenuInfo {
    menuId: number;
    name: string;
    image: string;
    price: number;
    temperature: string;
    options: OptionListItem[];
    sortedOptionCategory: string[];
}