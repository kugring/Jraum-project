import { MenuPageItem } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface GetMenuPageResponseDto extends ResponseDto {
    menuList: MenuPageItem[];
}