import './App.css';
import { useEffect } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import { routes, getPageTitle } from './routes/routes';

//              component: 어플레키에션 컴포넌트                //
function App() {
    //              state: 주소 상태                //
    const location = useLocation();
    const element = useRoutes(routes);

    //              effect: 주소에 따른 타이틀 명 이펙트                //
    useEffect(() => {
      document.title = getPageTitle(location.pathname);
    }, [location.pathname]);

    //              render: 어플레키에션 렌더링                //
    return element;
}

export default App;