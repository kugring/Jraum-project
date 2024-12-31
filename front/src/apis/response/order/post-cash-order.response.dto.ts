import { OrderManagement } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface PostCashOrderResponseDto extends ResponseDto {
    order: OrderManagement,
    cashName: string,
    waitingNum: number
}