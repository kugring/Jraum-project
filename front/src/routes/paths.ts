// 애플리케이션의 모든 경로 상수 정의
export const PATH = {
  ROOT: '/',
  MAIN: '/main',
  AUTH: {
    ROOT: '/auth',
    SIGN_UP: '/auth/sign-up',
    SIGN_IN: '/auth/sign-in',
    OAUTH: '/auth/oauth-response/:token/:expirationTime',
  },
  JRAUM: {
    ROOT: '/jraum',
    MANAGER: {
      ROOT: '/jraum/manager',
      ORDER: '/jraum/manager/order',
      POINT: '/jraum/manager/point',
      USER: '/jraum/manager/user',
      MENU: '/jraum/manager/menu',
    },
  },
} as const; 