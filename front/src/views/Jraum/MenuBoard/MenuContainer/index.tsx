import styled from 'styled-components';
import MenuGroup from './MenuGroup';
import { ResponseDto } from 'apis/response';
import { MenuListItem } from 'types/interface';
import { menuCategories } from 'constant';
import { getActionMenuRequest } from 'apis';
import GetActiveMenuListResponseDto from 'apis/response/menu/get-menu-list.response.dto';
import { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from 'react';
import useMenuCategoryScrollStore from 'store/menu-category-scroll.store';

//          component: 메뉴 컨테이너 컴포넌트           //
const MenuContainer = forwardRef((_, ref) => {

    //          state: 메뉴 리스트 상태         //
    const [menuList, setMenuList] = useState<MenuListItem[]>([]);
    //          state: 메뉴 그룹 참조 상태          //
    const menuGroupRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    //          state: 메뉴 컨테이너 참조 상태          //
    const containerRef = useRef<HTMLDivElement | null>(null); // Container의 ref 추가

    //          function: 부모 컴포넌트에서도 함수를 사용 가능하게 하는 use!          //
    useImperativeHandle(ref, () => ({
        scrollToCategory: (category: string) => {
            const targetRef = menuGroupRefs.current[category];
            if (targetRef) {
                targetRef.scrollIntoView({ behavior: 'smooth' });
            }
        },
    }));

    //          function: 백엔드에서 받은 결과로 화면에 구현하는 함수           //
    const getActiveMenuListResponse = (responseBody: GetActiveMenuListResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code !== 'SU') return;

        const { menuList } = responseBody as GetActiveMenuListResponseDto;
        setMenuList(menuList);
    };

    //          function: 활동 카테고리 설정하는 함수           //
    const setScrollCategory = useMenuCategoryScrollStore(state => state.setScrollCategory);

    //          effect: 인털섹션 옵저버로 화면의 스크롤 상태 이펙트         //
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setScrollCategory(entry.target.getAttribute('data-category') || '');
                    }
                });
            },
            {
                root: containerRef.current, // MenuContainer의 최상위 요소를 기준으로 설정
                threshold: [0, 1],             // 요소가 root에 10% 보이면 감지
                rootMargin: '-80% 0px 0px 0px', // 상단에 닿는 것을 기준으로 설정
            }
        );

        Object.values(menuGroupRefs.current).forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [menuList, setScrollCategory]);

    const filterMenuList = (category: string) => menuList.filter((menu) => menu.category === category);

    //          effect: 메뉴 리스트들을 불러와서 화면에 보여주는 이펙트         //
    useEffect(() => {
        getActionMenuRequest().then(getActiveMenuListResponse);
    }, []);


    //          render: 메뉴 컨테이너 렌더링            //
    return (
        <Container ref={containerRef}>
            {menuCategories.map((category) => (
                <MenuGroup
                    key={category}
                    category={category}
                    menuList={filterMenuList(category)}
                    ref={(el) => (menuGroupRefs.current[category] = el)}
                />
            ))}
        </Container>
    );
});

export default memo(MenuContainer);

const Container = styled.div`
    flex: 1;
    overflow-y: scroll;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
    /* 반응형 스타일 적용 */
    @media (max-width: 768px) {
        flex-shrink: 0;
        width: 100%;
    }
`;

