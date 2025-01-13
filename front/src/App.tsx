import './App.css';
import Main from 'views/Main';
import Jraum from 'views/Jraum';
import OAuth from 'views/Authentication/OAuth';
import SignIn from 'views/Authentication/SignIn';
import SignUp from 'views/Authentication/SignUp';
import Manager from 'views/Manager';
import MenuPage from 'views/Manager/Container/MenuPage';
import UserPage from 'views/Manager/Container/UserPage';
import Container from 'layouts/Container';
import PointPage from 'views/Manager/Container/PointPage';
import OrderPage from 'views/Manager/Container/OrderPage';
import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';


//              component: 어플레키에션 컴포넌트                //
function App() {

    //              state: 주소 상태                //
    const location = useLocation();

    //              effect: 주소에 따른 타이틀 명 이펙트                //
    useEffect(() => {
      // 경로에 따라 타이틀 설정
      if (location.pathname.startsWith('/jraum')) {
        document.title = '전주현암교회 J-raum'; // Jraum 관련 경로에 대한 타이틀
      } else if (location.pathname.startsWith('/auth')) {
        document.title = 'Authentication'; // 인증 관련 경로에 대한 타이틀
      } else if (location.pathname === '/main') {
        document.title = 'Main Page'; // 메인 페이지 타이틀
      } else {
        document.title = '전주현암교회'; // 기본 타이틀
      }
    }, [location.pathname]);

    //              render: 어플레키에션 렌더링                //
    return (
        <Routes>
            {/* 아직 메인이 준비되지 않아서 일단 제이라움으로 리다이렉트 */}
            <Route path='/' element={<Navigate to='jraum' replace />} />
            <Route element={<Container />}>
                <Route path='/auth'>
                    <Route path='sign-up' element={<SignUp />} />
                    <Route path='sign-in' element={<SignIn />} />
                    <Route path='oauth-response/:token/:expirationTime' element={<OAuth />} />
                </Route>
                {/* 메인 페이지 라우트 */}
                <Route path='main' element={<Main />} />

                {/* Jraum 라우트 */}
                <Route path='/jraum'>
                    <Route path='' element={<Jraum />} />
                    <Route path='manager' element={<Manager />}>
                        {/* 리다이렉트 처리 */}
                        <Route path='' element={<Navigate to='order' replace />} />
                        <Route path='order' element={<OrderPage />} />
                        <Route path='point' element={<PointPage />} />
                        <Route path='user' element={<UserPage />} />
                        <Route path='menu' element={<MenuPage />} />
                    </Route>
                </Route>
            </Route >
        </Routes>
    );
}

export default App;