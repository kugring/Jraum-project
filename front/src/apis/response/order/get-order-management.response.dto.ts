import { OrderManagement } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface GetOrderManagementResponseDto extends ResponseDto {
    orders: OrderManagement[];
}