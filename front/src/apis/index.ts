import { TEST_DOMAIN } from 'constant';
import { ResponseDto } from './response';
import axios, { AxiosResponse } from 'axios';
import { PatchUserEditRequestDto } from './request/user';
import { PostPinCheckManagerRequestDto } from './request/manager';
import { PostPinCheckManagerResponseDto } from './response/manager';
import { GetSortedUserResponseDto, PatchUserEditResponseDto } from './response/user';
import { PatchMenuRequestDto, patchMenuSuquenceRequestDto, PostMenuRequestDto } from './request/menu';
import { PatchOrderApproveRequestDto, PatchOrderRefundRequestDto, PostCashOrderRequestDto, PostPointOrderRequestDto } from './request/order';
import { GetActiveMenuListResponseDto, GetMenuPageResponseDto, PatchMenuResponseDto, PatchMenuSequenceResponseDto, PostMenuResponseDto } from './response/menu';
import { PatchPointChargeApprovalRequestDto, PatchPointChargeDeclineRequestDto, PostPointChargeRequestDto, PostPointDirectChargeRequestDto } from './request/pointCharge';
import { GetOrderListResponseDto, GetOrderManagementResponseDto, PatchOrderApproveResponseDto, PatchOrderRefundResponseDto, PostCashOrderResponseDto, PostPointOrderResponseDto } from './response/order';
import { CheckCertificationRequestDto, EmailCertificationRequestDto, IdCheckRequestDto, JraumSignUpRequestDto, NicknameDpCheckRequestDto, PinDpCheckRequestDto, PostPinCheckRequestDto, SignInRequestDto, SignUpRequestDto } from './request/auth';
import { CheckCertificationResponseDto, EmailCertificationResponseDto, IdcheckResponseDto, JraumSignUpResponseDto, NicknameDpcheckResponseDto, PinDpcheckResponseDto, PostPinCheckResponseDto, SignInResponseDto, SignUpResponseDto } from './response/auth';
import { DeletePointChargeResponseDto, GetPointChargeListResponseDto, GetPointChargeStatusResponseDto, GetPointChargePendingResponseDto, PatchPointChargeApprovalResponseDto, PatchPointChargeDeclineResponseDto, PostPointChargeResponseDto, PostPointDirectChargeResponseDto } from './response/pointCharge';



const responseHandler = <T>(response: AxiosResponse<any, any>) => {

    const responseBody: T = response.data;
    return responseBody;
};

const errorHandler = (error: any) => {
    if (!error.response || !error.response.data) return null;
    const responseBody: ResponseDto = error.response.data;
    return responseBody;
}

// 헤더에 접근 권한의 토큰을 넣어주는 코드?
const authorization = (accessToken: string) => {
    return { headers: { Authorization: `Bearer ${accessToken}` } }
};

//  기존에는 포트를 적어줘야 했지는 https 통신으로 443으로 고정됨됨
// const DOMAIN = 'https://' + TEST_DOMAIN + ':4000';
const DOMAIN = TEST_DOMAIN;



const API_DOMAIN = `${DOMAIN}/api/v1`;




//              state: 사용자 권한                  //
export const SNS_SIGN_IN_URL = (type: 'kakao' | 'naver') => `${API_DOMAIN}/auth/oauth2/${type}`;
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
const JRAUM_SIGN_UP_URL = () => `${API_DOMAIN}/auth/jraum/sign-up`;
const ID_CHECK_URL = () => `${API_DOMAIN}/auth/id-check`;
const PIN_CHECK_URL = () => `${API_DOMAIN}/auth/pin/duplicate-check`;
const NICKNAME_CHECK_URL = () => `${API_DOMAIN}/auth/nickname/duplicate-check`;
const EMAIL_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/email-certification`;
const CHECK_CERTIFICATION_ULR = () => `${API_DOMAIN}/auth/check-certification`;
const PIN_CHECK_ULR = () => `${API_DOMAIN}/auth/pin-check`;
const PIN_CHECK_MANAGER_ULR = () => `${API_DOMAIN}/auth/pin-check/manager`;

export const signInRequest = async (requestBody: SignInRequestDto) => {
    const result = await axios.post(SIGN_IN_URL(), requestBody)
        .then(responseHandler<SignInResponseDto>)
        .catch(errorHandler)
    return result;
}

export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const result = await axios.post(SIGN_UP_URL(), requestBody)
        .then(responseHandler<SignUpResponseDto>)
        .catch(errorHandler)
    return result;
}

export const jraumSignUpRequest = async (requestBody: JraumSignUpRequestDto, accessToken: string) => {
    const result = await axios.post(JRAUM_SIGN_UP_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<JraumSignUpResponseDto>)
        .catch(errorHandler)
    return result;
}

export const idCheckRequest = async (requestBody: IdCheckRequestDto) => {
    const result = await axios.post(ID_CHECK_URL(), requestBody)
        .then(responseHandler<IdcheckResponseDto>)
        .catch(errorHandler)
    return result;
}

export const pinDpCheckRequest = async (requestBody: PinDpCheckRequestDto, accessToken: string) => {
    const result = await axios.post(PIN_CHECK_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PinDpcheckResponseDto>)
        .catch(errorHandler)
    return result;
}

export const nicknameDpCheckRequest = async (requestBody: NicknameDpCheckRequestDto, accessToken: string) => {
    const result = await axios.post(NICKNAME_CHECK_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<NicknameDpcheckResponseDto>)
        .catch(errorHandler)
    return result;
}

export const emailCertificationRequest = async (requestBody: EmailCertificationRequestDto) => {
    const result = await axios.post(EMAIL_CERTIFICATION_URL(), requestBody)
        .then(responseHandler<EmailCertificationResponseDto>)
        .catch(errorHandler)
    return result;
}

export const checkCertificationRequest = async (requestBody: CheckCertificationRequestDto) => {
    const result = await axios.post(CHECK_CERTIFICATION_ULR(), requestBody)
        .then(responseHandler<CheckCertificationResponseDto>)
        .catch(errorHandler)
    return result;
}

export const postPinCheckRequest = async (requestBody: PostPinCheckRequestDto) => {
    const result = await axios.post(PIN_CHECK_ULR(), requestBody)
        .then(responseHandler<PostPinCheckResponseDto>)
        .catch(errorHandler)
    return result;
}

export const postPinCheckManagerRequest = async (requestBody: PostPinCheckManagerRequestDto) => {
    const result = await axios.post(PIN_CHECK_MANAGER_ULR(), requestBody)
        .then(responseHandler<PostPinCheckManagerResponseDto>)
        .catch(errorHandler)
    return result;
}
















//              state: 사용자                  //
const GET_SORTED_USER_URL = (page: number, size: number, name?: string, sort?: string) => {
    let url = `${API_DOMAIN}/user/manager/sorted?page=${page}&size=${size}&sort=${sort}`;
    if (name) { url += `&name=${name}`; }
    return url;
};
const PATCH_USER_EDIT_URL = () => `${API_DOMAIN}/user/manager/edit`;

// export const getSortedUserRequest = async (accessToken: string, page: number = 0, size: number = 10, name?: string, sort?: string) => {
//     const result = await axios.get(GET_SORTED_USER_URL(page, size, name, sort), authorization(accessToken))
//         .then(responseHandler<GetSortedUserResponseDto>)
//         .catch(errorHandler)
//     return result;
// }
export const getSortedUserRequest = async (accessToken: string, page: number = 0, size: number = 10, name?: string, sort?: string) => {
    try {
        const result = await axios.get(GET_SORTED_USER_URL(page, size, name, sort), authorization(accessToken));
        return responseHandler<GetSortedUserResponseDto>(result);
    } catch (error) {
        // 에러를 React Query에서 관리하도록 그대로 던짐
        throw errorHandler(error);
    }
};

export const patchUserEditRequest = async (request: PatchUserEditRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_USER_EDIT_URL(), request, authorization(accessToken))
        .then(responseHandler<PatchUserEditResponseDto>)
        .catch(errorHandler)
    return result;
}



















//              state: 메뉴                  //
const GET_ACTION_MENU_URL = () => `${API_DOMAIN}/menu/active`;
const GET_MENU_PAGE_URL = (category: number | string) => `${API_DOMAIN}/menu/manager/menuPage/${category}`;
const POST_MENU_URL = () => `${API_DOMAIN}/menu`
const PATCH_MENU_URL = () => `${API_DOMAIN}/menu`
const PATCH_MENU_SEQUENCE_URL = () => `${API_DOMAIN}/menu/manager/menuPage/sequence`;

export const getActionMenuRequest = async () => {
    const result = await axios.get(GET_ACTION_MENU_URL())
        .then(responseHandler<GetActiveMenuListResponseDto>)
        .catch(errorHandler)
    return result;
}
export const getMenuPageRequest = async (category: number | string, accessToken: string) => {
    const result = await axios.get(GET_MENU_PAGE_URL(category), authorization(accessToken))
        .then(responseHandler<GetMenuPageResponseDto>)
        .catch(errorHandler)
    return result;
}
export const postMenuRequest = async (request: PostMenuRequestDto, accessToken: string) => {
    const result = await axios.post(POST_MENU_URL(), request, authorization(accessToken))
        .then(responseHandler<PostMenuResponseDto>)
        .catch(errorHandler)
    return result;
}
export const patchMenuRequest = async (request: PatchMenuRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_MENU_URL(), request, authorization(accessToken))
        .then(responseHandler<PatchMenuResponseDto>)
        .catch(errorHandler)
    return result;
}
export const patchMenuSuquenceRequest = async (requestBody: patchMenuSuquenceRequestDto, accessToken: string) => {

    const result = await axios.patch(PATCH_MENU_SEQUENCE_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PatchMenuSequenceResponseDto>)
        .catch(errorHandler)
    return result;
}























//              state: 옵션                  //
const GET_MENU_OPTION_URL = (menuId: number | string) => `${API_DOMAIN}/menu/${menuId}/option`;

export const getMenuOptionRequest = async (menuId: number | string) => {
    const result = await axios.get(GET_MENU_OPTION_URL(menuId))
        .then(responseHandler<GetActiveMenuListResponseDto>)
        .catch(errorHandler)
    return result;
}


















//              state: 포인트 충전                  //
const POST_POINT_CHARGE_URL = () => `${API_DOMAIN}/point/charge`;
const POST_POINT_DIRECT_CHARGE_URL = () => `${API_DOMAIN}/point/manager/charge/direct`;
const PATCH_POINT_CHARGE_APPROVAL_URL = () => `${API_DOMAIN}/point/approve`;
const PATCH_POINT_CHARGE_DECLINE_URL = () => `${API_DOMAIN}/point/decline`;
const GET_POINT_CHARGE_PENDING_URL = () => `${API_DOMAIN}/point/manager/charge/pending`;
const GET_POINT_CHARGE_STATUS_URL = () => `${API_DOMAIN}/point/charge/status`;
const DELETE_POINT_CHARGE_URL = (pointChargeId: number | string) => `${API_DOMAIN}/point/${pointChargeId}`;
const GET_POINT_CHARGE_List_URL = (page: number, size: number, name?: string, status?: string, date?: string) => {
    let url = `${API_DOMAIN}/point/manager/charge/list?page=${page}&size=${size}`;
    if (name) { url += `&name=${name}`; }
    if (status) { url += `&status=${status}`; }
    if (date) { url += `&date=${date}`; }
    return url;
};



export const postPointChargeRequest = async (requestBody: PostPointChargeRequestDto, accessToken: string) => {
    const result = await axios.post(POST_POINT_CHARGE_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PostPointChargeResponseDto>)
        .catch(errorHandler)
    return result;
}

export const postPointDirectChargeRequest = async (requestBody: PostPointDirectChargeRequestDto, accessToken: string) => {
    const result = await axios.post(POST_POINT_DIRECT_CHARGE_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PostPointDirectChargeResponseDto>)
        .catch(errorHandler)
    return result;
}

export const patchPointChargeApprovalRequest = async (requestBody: PatchPointChargeApprovalRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_POINT_CHARGE_APPROVAL_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PatchPointChargeApprovalResponseDto>)
        .catch(errorHandler)
    return result;
}

export const patchPointChargeDeclineRequest = async (requestBody: PatchPointChargeDeclineRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_POINT_CHARGE_DECLINE_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PatchPointChargeDeclineResponseDto>)
        .catch(errorHandler)
    return result;
}

// export const getPointChargeListRequest = async (accessToken: string, page: number = 0, size: number = 10, name?: string, status?: string, date?: string) => {
//     const result = await axios.get(GET_POINT_CHARGE_List_URL(page, size, name, status, date), authorization(accessToken))
//         .then(responseHandler<GetPointChargeListResponseDto>)
//         .catch(errorHandler)
//     return result;
// }

export const getPointChargeListRequest = async (accessToken: string, page: number = 0, size: number = 10, name?: string, status?: string, date?: string) => {
    try {
        const result = await axios.get(GET_POINT_CHARGE_List_URL(page, size, name, status, date), authorization(accessToken));
        return responseHandler<GetPointChargeListResponseDto>(result);
    } catch (error) {
        // 에러를 React Query에서 관리하도록 그대로 던짐
        throw errorHandler(error);
    }
};

export const getPointChargePendingRequest = async (accessToken: string) => {
    const result = await axios.get(GET_POINT_CHARGE_PENDING_URL(), authorization(accessToken))
        .then(responseHandler<GetPointChargePendingResponseDto>)
        .catch(errorHandler)
    return result;
}

export const getPointChargeStatusRequest = async (accessToken: string) => {
    const result = await axios.get(GET_POINT_CHARGE_STATUS_URL(), authorization(accessToken))
        .then(responseHandler<GetPointChargeStatusResponseDto>)
        .catch(errorHandler)
    return result;
}

export const deletePointChargeRequest = async (pointChargeId: number, accessToken: string) => {
    const result = await axios.delete(DELETE_POINT_CHARGE_URL(pointChargeId), authorization(accessToken))
        .then(responseHandler<DeletePointChargeResponseDto>)
        .catch(errorHandler)
    return result;
}












//              state: 주문                  //
const POST_CASH_ORDER_URL = () => `${API_DOMAIN}/order/payment/cash`;
const POST_POINT_ORDER_URL = () => `${API_DOMAIN}/order/payment/point`;
const GET_ORDER_MANAGEMENT_URL = () => `${API_DOMAIN}/order/manager/order-management`;
const PATCH_ORDER_APPROVE_URL = () => `${API_DOMAIN}/order/approve`;
const PATCH_ORDER_REFUND_URL = () => `${API_DOMAIN}/order/refund`;
const GET_ORDER_LIST_URL = (page: number, size: number, name?: string, status?: string, date?: string) => {
    let url = `${API_DOMAIN}/order/manager/order-list?page=${page}&size=${size}`;
    if (name) { url += `&name=${name}`; }
    if (status) { url += `&status=${status}`; }
    if (date) { url += `&date=${date}`; }
    return url;
};

export const postCashOrderRequest = async (requestBody: PostCashOrderRequestDto) => {
    const result = await axios.post(POST_CASH_ORDER_URL(), requestBody)
        .then(responseHandler<PostCashOrderResponseDto>)
        .catch(errorHandler)
    return result;
}

export const postPointOrderRequest = async (requestBody: PostPointOrderRequestDto, accessToken: string) => {
    const result = await axios.post(POST_POINT_ORDER_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PostPointOrderResponseDto>)
        .catch(errorHandler)
    return result;
}

// export const getOrderManagementRequest = async (accessToken: string) => {
//     const result = await axios.get(GET_ORDER_MANAGEMENT_URL(), authorization(accessToken))
//         .then(responseHandler<GetOrderManagementResponseDto>)
//         .catch(errorHandler)
//     return result;
// }

export const getOrderManagementRequest = async (accessToken: string): Promise<GetOrderManagementResponseDto> => {
    try {
        const response = await axios.get(GET_ORDER_MANAGEMENT_URL(), authorization(accessToken));
        return responseHandler<GetOrderManagementResponseDto>(response);
    } catch (error) {
        // 에러를 React Query에서 관리하도록 그대로 던짐
        throw errorHandler(error);
    }
};


// export const getOrderListRequest = async (accessToken: string, page: number = 0, size: number = 10, name?: string, status?: string, date?: string) => {
//     const result = await axios
//         .get(GET_ORDER_LIST_URL(page, size, name, status, date), authorization(accessToken))
//         .then(responseHandler<GetOrderListResponseDto>)
//         .catch(errorHandler);
//     return result;
// };

export const getOrderListRequest = async (accessToken: string, page: number = 0, size: number = 10, name?: string, status?: string, date?: string) => {
    try {
        const result = await axios.get(GET_ORDER_LIST_URL(page, size, name, status, date), authorization(accessToken));
        return responseHandler<GetOrderListResponseDto>(result);
    } catch (error) {
        // 에러를 React Query에서 관리하도록 그대로 던짐
        throw errorHandler(error);
    }
};

export const patchOrderApproveRequest = async (requestBody: PatchOrderApproveRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_ORDER_APPROVE_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PatchOrderApproveResponseDto>)
        .catch(errorHandler)
    return result;
}

export const patchOrderRefundRequest = async (requestBody: PatchOrderRefundRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_ORDER_REFUND_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PatchOrderRefundResponseDto>)
        .catch(errorHandler)
    return result;
}












//              state: 파일 업로드                  //
const FILE_DOMAIN = `${DOMAIN}/file`;
const FILE_UPLOAD_URL = () => `${FILE_DOMAIN}/upload`;

const multipartFormData = { headers: { 'Content-Type': 'multipart/form-data' } };

export const fileUploadRequest = async (data: FormData) => {
    const result = await axios.post(FILE_UPLOAD_URL(), data, multipartFormData)
        .then(response => {
            const responseBody: string = response.data;
            return responseBody;
        })
        .catch(error => {
            return null;
        })
    return result;
};
