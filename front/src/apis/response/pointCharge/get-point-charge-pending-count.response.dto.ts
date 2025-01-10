import ResponseDto from '../response.dto';

export default interface GetPointChargeStatusResponseDto extends ResponseDto {
    pointChargeId: number;
    status: string;
}

