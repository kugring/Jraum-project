export default interface PatchMenuRequestDto {
    name: string;
    image: string;
    price: number;
    status: number;
    menuId: number;
    options: string[];
    category: string;
    temperature: string;
    espressoShot: number;
}