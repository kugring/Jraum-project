
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'

dayjs.extend(relativeTime)
dayjs.locale('ko') // dayjs에 있는 추가 확장자를 사용


export function fromNow(time: string | Date) {
    return dayjs(time).fromNow(); // 현재까지의 지나간 날짜와 시간을 보여준다.
}

export function formatTime(time: string | Date, format = 'YYYY-MM-DD h:mm A') {
    return dayjs(time).format(format); // 이건 아직 사용 안해봤다
}