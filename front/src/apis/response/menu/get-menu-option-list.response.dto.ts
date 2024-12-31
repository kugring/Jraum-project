import OptionListItem from 'types/interface/menu-option-list-item.interface';
import ResponseDto from '../response.dto';

export default interface GetMenuOptionResponseDto extends ResponseDto {
    options: OptionListItem[];
}