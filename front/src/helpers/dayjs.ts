
import utc from 'dayjs/plugin/utc'; // 추가
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'

dayjs.locale('ko') // day
dayjs.extend(utc); // 추가
dayjs.extend(timezone);
dayjs.extend(relativeTime)

export function fromNow(time: string | Date) {
    return dayjs(time)
        .tz('Asia/Seoul') // 한국 시간대로 변환
        .fromNow(); // 현재까지의 지나간 날짜와 시간을 보여준다.
}

export function formatTime(time: string | Date, format = 'YYYY-MM-DD h:mm A') {
    return dayjs(time).format(format); // 이건 아직 사용 안해봤다
}


