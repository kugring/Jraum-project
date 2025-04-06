import { RouteObject } from 'react-router-dom';
import { PATH } from './paths';
import { PAGE_TITLES } from './titles';
import Container from 'layouts/Container';
import Main from 'views/Main';
import Jraum from 'views/Jraum';
import OAuth from 'views/Authentication/OAuth';
import SignIn from 'views/Authentication/SignIn';
import SignUp from 'views/Authentication/SignUp';
import Manager from 'views/Manager';
import MenuPage from 'views/Manager/Container/MenuPage';
import UserPage from 'views/Manager/Container/UserPage';
import PointPage from 'views/Manager/Container/PointPage';
import OrderPage from 'views/Manager/Container/OrderPage';

// 경로별 타이틀 매핑 함수
export const getPageTitle = (pathname: string): string => {
  if (pathname.startsWith('/jraum/manager')) {
    if (pathname.includes('/order')) return PAGE_TITLES.ORDER;
    if (pathname.includes('/point')) return PAGE_TITLES.POINT;
    if (pathname.includes('/user')) return PAGE_TITLES.USER;
    if (pathname.includes('/menu')) return PAGE_TITLES.MENU;
    return PAGE_TITLES.MANAGER;
  }
  if (pathname.startsWith('/jraum')) return PAGE_TITLES.JRAUM;
  if (pathname.startsWith('/auth')) {
    if (pathname.includes('sign-in')) return PAGE_TITLES.SIGN_IN;
    if (pathname.includes('sign-up')) return PAGE_TITLES.SIGN_UP;
    return PAGE_TITLES.DEFAULT;
  }
  if (pathname === '/main') return PAGE_TITLES.MAIN;
  return PAGE_TITLES.DEFAULT;
};

export const routes: RouteObject[] = [
  {
    path: PATH.ROOT,
    element: <Container />,
    children: [
      {
        index: true,
        element: <Jraum />,
      },
      {
        path: PATH.AUTH.ROOT,
        children: [
          { path: 'sign-up', element: <SignUp /> },
          { path: 'sign-in', element: <SignIn /> },
          { path: 'oauth-response/:token/:expirationTime', element: <OAuth /> },
        ],
      },
      {
        path: PATH.MAIN,
        element: <Main />,
      },
      {
        path: PATH.JRAUM.ROOT,
        children: [
          { index: true, element: <Jraum /> },
          {
            path: 'manager',
            element: <Manager />,
            children: [
              { index: true, element: <OrderPage /> },
              { path: 'order', element: <OrderPage /> },
              { path: 'point', element: <PointPage /> },
              { path: 'user', element: <UserPage /> },
              { path: 'menu', element: <MenuPage /> },
            ],
          },
        ],
      },
    ],
  },
]; 