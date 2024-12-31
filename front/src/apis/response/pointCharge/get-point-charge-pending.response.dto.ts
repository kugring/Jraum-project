import ChargeRequestListItem from 'types/interface/charge-request-list-item.interface';
import ResponseDto from '../response.dto';

export default interface GetPointChargePendingResponseDto extends ResponseDto {
    pointChargeList: ChargeRequestListItem[];
}

