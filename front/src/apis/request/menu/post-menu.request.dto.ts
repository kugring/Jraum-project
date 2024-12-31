export default interface PostMenuRequestDto {
    name: string;
    image: string;
    price: number;
    status: number;
    options: string[];
    category: string;
    temperature: string;
    espressoShot: number;
}