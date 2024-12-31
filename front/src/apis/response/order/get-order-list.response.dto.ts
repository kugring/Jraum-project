import { OrderList } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface GetOrderListResponseDto extends ResponseDto {
    orders: OrderList[];
}