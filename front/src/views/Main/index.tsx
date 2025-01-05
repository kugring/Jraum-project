import React, { useState } from 'react'
import { useCookies } from 'react-cookie';

export default function Main() {
  const [cookiesDeleted, setCookiesDeleted] = useState(false);

  const deleteAllCookies = () => {
      const cookies = document.cookie.split(";");

      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const equalIndex = cookie.indexOf("=");
          const name = equalIndex > -1 ? cookie.substr(0, equalIndex).trim() : cookie.trim();
          document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      }

      setCookiesDeleted(true); // 쿠키 삭제 상태를 업데이트합니다.
  };

  const [cookies, , setCookie] = useCookies();
  
  const onLoOutButtonClick = () => {
    console.log(cookies);
    
    setCookie("asdf");

  }

  const token = cookies.accessToken;

  const naver_url = "https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=NRWiYcgY9qyLkmUUTDDM&client_secret=inHhMBvUit&access_token=" + token + "&service_provider=NAVER"
  console.log(token)



  return (
    <div id='test-wrapper'>
      <a onClick={onLoOutButtonClick} href="https://kauth.kakao.com/oauth/logout?client_id=df0b9dae023bac0e67bca6b81c663d04&logout_redirect_uri=httplocalhost:3000/auth/sign-in">카카오톡 로그아웃</a>
      <a onClick={onLoOutButtonClick} href={naver_url}>네이버 로그아웃</a>
      <div>
          <button onClick={deleteAllCookies}>
              모든 쿠키 삭제
          </button>
          {cookiesDeleted && <p>모든 쿠키가 삭제되었습니다.</p>}
      </div>
    </div>
  );

}

