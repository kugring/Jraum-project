import styled from "styled-components";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { ResponseDto } from "apis/response";
import { useQueryClient } from "@tanstack/react-query";
import { useMenuPageStore } from "store/manager";
import { patchMenuSuquenceRequest } from "apis";
import { patchMenuSuquenceRequestDto } from "apis/request/menu";
import { GetMenuPageResponseDto, PatchMenuSequenceResponseDto } from "apis/response/menu";


//                  component: 메뉴 순서를 저장하는 버튼 컴포넌트                    //
const SequenceSave = () => {

    //              state: 리액트 쿼리 상태                 //
    const queryClient = useQueryClient();
    //              state: 메뉴 순서 상태                 //
    const menuSequence = useMenuPageStore(state => state.menuSequence);
    //              state: 쿠키 상태                //
    const [cookies,] = useCookies(['managerToken']);
    //              state: 메누 순서 변경할 값 존재 여부                //
    const active = useMenuPageStore.getState().menuSequence.length > 0;

    //              event handler: 메뉴 순서 저장                   //
    const onClickSuquenceSave = () => {
        if (!cookies.managerToken) return;
        const requestBody: patchMenuSuquenceRequestDto = { menuSequence: menuSequence };
        patchMenuSuquenceRequest(requestBody, cookies.managerToken).then(patchMenuSuquenceResponse)
    }

    //          function: 메뉴 순서 수정 처리 결과 확인 함수            //
    const patchMenuSuquenceResponse = (responseBody: PatchMenuSequenceResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMN') alert('존재하지 않는 메뉴입니다.');
        if (code === 'NMG') alert('존재하지 않는 관리자입니다.');
        if (code !== 'SU') return;

        const menuList = useMenuPageStore.getState().updateMenuListBySequence(); // 정렬된 menuList 얻기
        const category = useMenuPageStore.getState().category;


        queryClient.setQueryData(['menuListQ', category], (oldData: GetMenuPageResponseDto | undefined) => {
            if (!oldData) return undefined;
            // 기존 menuList를 정렬된 menuList로 대체
            const updatedData = {
                ...oldData,
                menuList: menuList // 이전값을 정렬된 menuList로 대체
            };
            return updatedData;
        });

        if (useMenuPageStore.getState().menuSequence.length > 0) {
            toast.success('메뉴의 순서가 수정되었습니다.', {
                autoClose: 500,
                position: "top-center",
                closeOnClick: true, // 클릭 시 바로 사라짐
            pauseOnHover: false
        });
        }
        useMenuPageStore.getState().setEditSequence(false);
        useMenuPageStore.getState().resetMenuSequence(); // 메뉴 시퀀스 리셋
    }



    //                  render: 메뉴 순서를 저장하는 버튼 렌더링                    //
    return (
        <SaveButton $active={active} onClick={onClickSuquenceSave}>순서 저장</SaveButton>
    )
}

export default SequenceSave;


const SaveButton = styled.div<{ $active: boolean }>`
    flex-shrink: 0;
    padding: 4px 6px;
    margin-right: 12px;
    font-size: 14px;
    border-radius: 4px;

    color: #FFF;
    border: 2px solid #FFF;
    background-color: ${({ $active }) => $active ? "var(--coralPink)" : "var(--goldenPeach)"} ;

    transition: all 300ms;
`