import ResponseDto from '../response.dto';
import PointChargeDetail from 'types/interface/point-charge-detail.interface';

export default interface GetPointChargeListResponseDto extends ResponseDto {
    chargeList: PointChargeDetail[];
}

