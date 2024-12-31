import { MenuListItem } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface GetActiveMenuListResponseDto extends ResponseDto {
    menuList: MenuListItem[];
}