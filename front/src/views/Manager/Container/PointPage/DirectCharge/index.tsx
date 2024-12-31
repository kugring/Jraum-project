import Card from './Card';
import styled from 'styled-components'
import SearchFilter from './SearchFilter';
import { useCookies } from 'react-cookie';
import { ResponseDto } from 'apis/response';
import { useEffect } from 'react';
import { getSortedUserRequest } from 'apis';
import { GetSortedUserResponseDto } from 'apis/response/user';
import usePointDirectChargeStore from 'store/manager/point-direct-charge.store';

//              component: 포인트 작접 충전 컴포넌트                  //
const DirectCharge = () => {


    //          state: 쿠키 상태            //
    const [cookies,] = useCookies(['managerToken']);
    //          state: 끝 상태            //
    const end = usePointDirectChargeStore(state => state.end);
    //          state: 정렬 기준            //
    const sort = usePointDirectChargeStore(state => state.sort);
    //          state: 회원들 상태          //
    const users = usePointDirectChargeStore(state => state.users);
    //          state: 이름 검색 상태           //
    const name = usePointDirectChargeStore(state => state.name);
    //          state: 페이지와 로딩 상태 관리         //
    const isLoading = usePointDirectChargeStore.getState().isLoading;
    //          state: 페이지 상태 관리         //
    const page = usePointDirectChargeStore(state => state.page);
    //          state: 페이지당 제한한 수          //
    const limit = usePointDirectChargeStore.getState().limited;

    //          function: 회원 목록 전역함수                //
    const setEnd = usePointDirectChargeStore.getState().setEnd;
    const setPage = usePointDirectChargeStore.getState().setPage;
    const setSort = usePointDirectChargeStore.getState().setSort;
    const setUsers = usePointDirectChargeStore.getState().setUsers;
    const resetUsers = usePointDirectChargeStore.getState().resetUsers;
    const setIsLoading = usePointDirectChargeStore.getState().setIsLoading;
    const setName = usePointDirectChargeStore(state => state.setName);



    //          function: 정렬된 회원 목록 가져오는 함수           //
    const getSortedUser = () => {

        const SORT_MAPPING: Record<string, string> = {
            "최근": "updatedAt",
            "이름": "name",
            "등록": "createdAt",
            "번호": "pin",
        };
        const sorted = SORT_MAPPING[sort] || "";
        getSortedUserRequest(cookies.managerToken, page, limit, name, sorted).then(getSortedUserResponse)
    }


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


    //          function: 스크롤 이벤트 핸들러          //
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (users.length === 0) return;
        if (isLoading) return;
        if (scrollTop + clientHeight >= scrollHeight - 1 && !isLoading) {
            setIsLoading(true);
            setPage(page + 1)
        }
    };

    //          function: 정렬 클릭 이벤트 핸드러               //
    const onSortClickHandler = (sort: string) => {
        setSort(sort);
        setEnd(false);
        setPage(0);
    }

    //          effect: 이름, 상태, 날짜가 변경되면 페이지 리셋하고 다시 불러오기       //
    useEffect(() => {
        setPage(0);
        resetUsers();
        getSortedUser();
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, sort]);

    //          effect: 이름, 상태, 날짜가 변경되면 페이지 리셋하고 다시 불러오기       //
    useEffect(() => {
        if (page === 0) {
            return;
        } else {
            getSortedUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    //          effect: 언마운트 될때만 실행되는 이펙트             //
    useEffect(() => () => {setSort("최근"); setPage(0);setEnd(false);}, [setSort, setPage, setEnd]);


    //              render: 포인트 직접 충전 렌더링                 //
    return (
        <DirectChargeE>
            <Filter>
                <ButtonFilter>
                    <Squance $select={sort === "최근"} onClick={() => onSortClickHandler("최근")}>최근</Squance>
                    <Squance $select={sort === "이름"} onClick={() => onSortClickHandler("이름")}>이름</Squance>
                    <Squance $select={sort === "등록"} onClick={() => onSortClickHandler("등록")}>등록</Squance>
                    <Squance $select={sort === "번호"} onClick={() => onSortClickHandler("번호")}>번호</Squance>
                </ButtonFilter>
                <SearchFilter setSearchName={setName} />
            </Filter>
            <CardBox onScroll={handleScroll}>
                {users.map((user) => (
                    <Card key={user.userId} user={user} />
                ))}
                {!end && isLoading && <div>Loading...</div>}
                {end && <div>끝</div>}
            </CardBox>
        </DirectChargeE>
    )
}

export default DirectCharge

const DirectChargeE = styled.div`
  display: flex;
  flex-direction: column;
  width: 320px;
  height: 100%;
  gap: 8px;
  padding-top: 18px;
  margin: 0 auto;
  box-sizing: border-box;
`

const Filter = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 8px;
`

const ButtonFilter = styled.div`
    display: flex;
    gap: 12px;
    width: 100%;
`

const Squance = styled.div<{ $select: boolean }>`
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 36px;
    padding: 6px 12px;
    border-radius: 8px;
    box-sizing: border-box;
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

const CardBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    width: 100%;
    min-height: 10px;
    height: 100%;
    gap: 2px;
    padding-bottom: 18px;
    border-radius: 8px;
    overflow: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        display: none;
    }
`;