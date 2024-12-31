import { SortedUser } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface GetSortedUserResponseDto extends ResponseDto {
    users: SortedUser[];
}

