import {  User } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface PostPinCheckManagerResponseDto extends ResponseDto {
    user: User;
    token: string;
    expirationTime: number;
}