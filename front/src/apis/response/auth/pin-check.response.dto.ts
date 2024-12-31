import { User } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface PostPinCheckResponseDto extends ResponseDto {
    user: User;
    token: string;
    expirationTime: number;
}