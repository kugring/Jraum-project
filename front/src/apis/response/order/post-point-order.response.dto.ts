import { OrderManagement } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface PostPointOrderResponseDto extends ResponseDto{
    order: OrderManagement,
    balance: number,
    waitingNum: number,
}