import Container from 'layouts/Container';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import OAuth from 'views/Authentication/OAuth';
import SignIn from 'views/Authentication/SignIn';
import SignUp from 'views/Authentication/SignUp';
import Jraum from 'views/Jraum';
import Main from 'views/Main';
import Manager from 'views/Manager';
import MenuPage from 'views/Manager/Container/MenuPage';
import UserPage from 'views/Manager/Container/UserPage';
import PointPage from 'views/Manager/Container/PointPage';
import OrderPage from 'views/Manager/Container/OrderPage';


function App() {

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