import OptionListItem from "./menu-option-list-item.interface";

export default interface MenuPageItem {
    name: string;
    image: string;
    price: number;
    menuId: number;
    status: number;
    category: string;
    sequence: number;
    temperature: string;
    espressoShot: number;
    options: OptionListItem[];
}
