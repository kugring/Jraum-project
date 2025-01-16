import Card from './Card';
import styled from 'styled-components'
import SearchFilter from './SearchFilter';
import { HiUserAdd } from "react-icons/hi";
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { ResponseDto } from 'apis/response';
import { useUserPageStore } from 'store/manager';
import { useBlackModalStore } from 'store/modal';
import { getSortedUserRequest } from 'apis';
import { GetSortedUserResponseDto } from 'apis/response/user';
import { useQuery } from '@tanstack/react-query';

//              component: 회원 페이지 컴포넌트                 //
const UserPage = () => {

    //                render: 회원 페이지 렌더링                  ..
    return (
        <UserPageE>
            <FilterE />
            <CardBoxE />
        </UserPageE>
    )
}
export default UserPage


//              subComponent: 회원 필터 컴포넌트                //
const FilterE = () => {

    //      function: 회원 모달 여는 함수       //
    const openModal = useBlackModalStore(state => state.openModal);
    //      function: 회원 모달 여는 함수       //
    const setWhiteModal = useBlackModalStore(state => state.setWhiteModal);
    //      function: 회원등록 모달 여는 함수      //
    const userAdd = () => {
        openModal()
        setWhiteModal("회원등록")
    }

    //              function: 정렬 클릭 이벤트 핸드러               //
    const onSortClickHandler = (sort: string) => {
        const setEnd = useUserPageStore.getState().setEnd;
        const setPage = useUserPageStore.getState().setPage;
        const setSort = useUserPageStore.getState().setSort;
        setSort(sort);
        setEnd(false);
        setPage(0);
    }
    //              function: 이름 설정 함수                //
    const setName = useUserPageStore(state => state.setName);

    //              subComponent: 장렬 버튼 컴포넌트                //
    const SquanceE = ({ Sort }: { Sort: string }) => { return (<Squance $select={useUserPageStore(state => state.sort === Sort)} onClick={() => onSortClickHandler(Sort)}>{Sort}</Squance>) }

    //              render: 회원 필터 렌더링                //
    return (
        <Filter>
            <ButtonFilter>
                <SquanceE Sort={"최근"} />
                <SquanceE Sort={"이름"} />
                <SquanceE Sort={"등록"} />
                <SquanceE Sort={"번호"} />
                <UserAdd onClick={userAdd} size={24} color={"#FFF"} />
            </ButtonFilter>
            <SearchFilter setSearchName={setName} />
        </Filter>
    )
}


//              subComponent: 회원 카드 박스 서브 컴포넌트                  //
const CardBoxE = () => {

    //          state: 쿠키 상태            //
    const [cookies,] = useCookies(['managerToken']);
    //          state: 끝 상태            //
    const end = useUserPageStore(state => state.end);
    //          state: 정렬 기준            //
    const sort = useUserPageStore(state => state.sort);
    //          state: 회원들 상태          //
    const users = useUserPageStore(state => state.users);
    //          state: 이름 검색 상태           //
    const name = useUserPageStore(state => state.name);
    //          state: 페이지와 로딩 상태 관리         //
    const isLoading = useUserPageStore.getState().isLoading;
    //          state: 페이지 상태 관리         //
    const page = useUserPageStore(state => state.page);
    //          state: 페이지당 제한한 수          //
    const limit = useUserPageStore.getState().limited;

    //          function: 회원원 목록 전역함수                //
    const setEnd = useUserPageStore.getState().setEnd;
    const setPage = useUserPageStore.getState().setPage;
    const setSort = useUserPageStore.getState().setSort;
    const setUsers = useUserPageStore.getState().setUsers;
    const resetUsers = useUserPageStore.getState().resetUsers;
    const setIsLoading = useUserPageStore.getState().setIsLoading;


    //          function: 회원 목록 불러오는 함수            //
    const { data: usersQ, isSuccess } = useQuery<GetSortedUserResponseDto>({
        queryKey: ['usuersQ', page, limit, name, sort],  // 의존성 배열에 상태를 추가하여 쿼리 실행
        queryFn: () => {
            const SORT_MAPPING: Record<string, string> = {
                "최근": "updatedAt",
                "이름": "name",
                "등록": "createdAt",
                "번호": "pin",
            };
            const sorted = SORT_MAPPING[sort] || "";
            return getSortedUserRequest(cookies.managerToken, page, limit, name, sorted);
        },
        staleTime: 1000 * 3, // 3초
    });


    //          function:  정렬된 회원 목록 처리 하는는 함수            //
    const getSortedUserResponse = (responseBody: GetSortedUserResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'NMG') alert('존재하지 않는 관리자입니다.');
        if (code !== 'SU') return;

        const { users } = responseBody as GetSortedUserResponseDto;
        setUsers(users);

        if (users.length !== 0) {
            setIsLoading(false);
        } else {
            setEnd(true);
        }
    }

    //          effect: 데이터 성공적으로 불러왔을 때 처리          //
    useEffect(() => {
        //          주문자 이름, 상태, 날짜가 변경될 때마다 기존 주문을 리셋하고 새로 데이터를 요청합니다.
        resetUsers(); // 기존 주문 목록을 리셋
        setPage(0); // 페이지 번호를 0으로 초기화
        setEnd(false); // 끝 상태를 false로 초기화
        setIsLoading(true); // 로딩 상태를 true로 설정

        // 데이터 요청을 위한 새로운 API 호출
        // setIsLoading 상태 변경 후 바로 getOrderListRequest를 호출합니다.
    }, [name, sort]); // name, status, date가 변경될 때마다 실행됩니다.

    //          effect: 데이터 불러오기 성공 시 처리          //
    useEffect(() => {
        if (isSuccess && usersQ) {
            getSortedUserResponse(usersQ);
        }
    }, [isSuccess, usersQ]);



    //          function: 스크롤 이벤트 핸들러          //
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {

        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (users.length === 0) return;
        if (isLoading) return;
        if (scrollTop + clientHeight >= scrollHeight - 20 && !isLoading) {
            setIsLoading(true);
            setPage(page + 1)
        }
    };


    //          effect: 언마운트 될때만 실행되는 이펙트             //
    useEffect(() => () => { setSort("최근"); setPage(0); setEnd(false); }, [setSort, setPage, setEnd]);

    //              render: 회원 카드 박스 렌더링                  //
    return (
        <CardBox onScroll={handleScroll}>
            {users.map((user) => (
                <Card key={user.userId} user={user} />
            ))}
            {!end && isLoading && <Message>Loading...</Message>}
            {end && <Message>--- 더이상 데이터 없음 ---</Message>}
        </CardBox>
    )
}






const UserPageE = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 320px;
    height: 100%;
    margin: 0 auto;
    gap: 8px;
    box-sizing: border-box;
    padding-top: 18px;
`

const Filter = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 8px;
`

const ButtonFilter = styled.div`
    display: flex;
    width: 100%;
    gap: 12px;
`

const Squance = styled.div<{ $select: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 16px;
    ${({ $select }) => $select ?
        `
        color: #FFF;
        background: var(--orange);
        `: `
        color: var(--copperBrown);
        background: #FFF;
        `
    }
`

const UserAdd = styled(HiUserAdd)`
    padding: 6px;
    margin-left: auto;
    border-radius: 8px;
    background: var(--orange);
`

const CardBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 4px;
    overflow: scroll;
    scrollbar-width: none;           /* Firefox */
    -ms-overflow-style: none; 
    &::-webkit-scrollbar {              // 크롬
    display: none;
    }
`

const Message = styled.div`
    color: var(--copperBrown);
    padding: 24px;
`