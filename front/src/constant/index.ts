export const MAIN_PATH = () => '/';
export const AUTH_PATH = () => '/auth';
export const USER_PATH = (userEmail: string) => `/user/${userEmail}`;
export const JRAUM_PATH = () => '/jraum';
export const BOARD_PATH = () => '/board';
export const SEARCH_PATH = (searchWord: string) => `/search/${searchWord}`;
export const MANAGER_PATH = () => '/jraum/manager';
export const BOARD_WRITE_PATH = () => 'write';
export const BOARD_UPDATE_PATH = (boardNumber: string | number) => `update/${boardNumber}`;
export const BOARD_DETAIL_PATH = (boardNumber: string | number) => `detail/${boardNumber}`;

// export const TEST_DOMAIN = '125.139.38.74'; // 이건 우리집 고유 IP
// export const TEST_DOMAIN = '172.30.1.74'; // 이건 내 컴퓨터
// export const TEST_DOMAIN = '54.221.169.225'; // 이건 ec2 ip임
export const TEST_DOMAIN = 'https://api.hyunam.site'; // 도메인으로 접근!
// export const TEST_DOMAIN = 'http://localhost:4000'; // 도메인으로 접근!



export const defaultUserImage = "https://i.pinimg.com/736x/7d/d7/49/7dd749ba968cd0f2716d988a592f461e.jpg";
export const defaultMenuImage = "https://i.pinimg.com/736x/1f/f8/50/1ff850b60fa266f70f2a21f9755aa8ae.jpg";

export const menuCategories = ["커피", "논커피", "차", "음료수"];

export const optionSelectList = ['온도', '얼음', '컵크기', '샷조절', '샷추가', "농도", '설탕시럽', '바닐라시럽', '카라멜시럽', '초콜릿시럽', '아이스크림'];

export const optionCategories = ["온도", "얼음", "컵크기", "샷조절", "샷추가", "아이스크림", "농도", "시럽"];

export const buttonOptions = ["온도", "얼음", "컵크기", "샷조절", "샷추가", "농도", "아이스크림"]

export const countOptions = ["시럽"]


// 원 단위로 포맷
export const formattedPoint = (point: number) => {
  return new Intl.NumberFormat("ko-KR").format(point);
};

// yyyy-mm-dd 형식으로 포맷
export const formattedDate = (date: Date) => {
    // date가 string일 수 있으므로, Date 객체로 변환
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
        // date가 유효하지 않은 경우 (잘못된 날짜 형식일 경우)
        return "Invalid Date";
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');  // 월은 0부터 시작하므로 +1
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
}


export const formatTime = (date: any) => {
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
      return "Invalid Time";
  }

  let hours = dateObj.getHours();
  let minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? '오후' : '오전';  // 오전/오후 구분
  hours = hours % 12;  // 12시간 형식으로 변경
  hours = hours ? hours : 12;  // 0을 12로 변경

  return `${period} ${hours}:${minutes}`;
};


// yyyy-mm-dd 형식으로 포맷
// export const formattedDate = (date: Date) => {
//     return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
// } 
