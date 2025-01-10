import { Client, Message } from '@stomp/stompjs'; // STOMP 프로토콜을 지원하는 라이브러리
import SockJS from 'sockjs-client'; // SockJS를 사용해 WebSocket 연결 생성

/**
 * WebSocketManager
 * - WebSocket 연결을 관리하는 클래스입니다.
 * - 구독(subscription)과 메시지 전송(send)을 지원합니다.
 */
export class WebSocketManager {
  private client: Client | null = null; // WebSocket 연결 클라이언트 객체
  private subscriptions: Record<string, () => void> = {}; // 현재 활성화된 구독 정보를 저장

  constructor(private url: string) {
    // WebSocket 연결 주소를 인자로 받아 저장합니다.
    // 예: 'https://hyunam.site/ws'
  }

  /**
   * WebSocket 연결을 초기화하고 연결 성공/실패에 따라 콜백을 실행합니다.
   */
  connect(onConnect?: () => void, onDisconnect?: () => void) {
    const socket = new SockJS(this.url); // WebSocket 연결 생성
    this.client = new Client({
      webSocketFactory: () => socket, // SockJS를 통해 WebSocket 연결 설정
      onConnect: () => {
        console.log('WebSocket connected');
        if (onConnect) onConnect(); // 연결 성공 시 사용자 정의 콜백 실행
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
        if (onDisconnect) onDisconnect(); // 연결 종료 시 사용자 정의 콜백 실행
      },
    });
    this.client.activate(); // WebSocket 연결 활성화
  }

  /**
   * WebSocket 연결 해제 및 모든 구독 해제
   */
  disconnect() {
    if (this.client) {
      // 모든 구독 해제
      Object.values(this.subscriptions).forEach((unsubscribe) => unsubscribe());
      this.client.deactivate(); // WebSocket 비활성화
      this.client = null;
      console.log('WebSocket disconnected');
    }
  }

  /**
   * 특정 주제(destination)에 대해 구독을 설정합니다.
   * @param destination - 메시지를 수신할 경로 (예: '/receive/messages')
   * @param callback - 메시지가 도착했을 때 실행할 함수
   */
  subscribe(destination: string, callback: (msg: any) => void) {
    if (!this.client) {
      console.error('WebSocket client is not connected');
      return; // WebSocket이 연결되지 않은 경우 구독을 설정할 수 없습니다.
    }

    if (this.subscriptions[destination]) {
      console.warn(`Already subscribed to ${destination}`);
      return; // 이미 구독된 주제에 대해 중복 구독을 방지
    }

    // 구독 생성 및 메시지 도착 시 콜백 실행
    const subscription = this.client.subscribe(destination, (msg: Message) => {
      const body = msg.body ? JSON.parse(msg.body) : null; // 메시지를 JSON으로 파싱
      callback(body); // 파싱된 메시지를 콜백 함수로 전달
    });

    this.subscriptions[destination] = subscription.unsubscribe; // 구독 해제 함수 저장
    console.log(`Subscribed to ${destination}`);
  }

  /**
   * 특정 주제(destination)에 대한 구독을 해제합니다.
   * @param destination - 구독을 해제할 경로
   */
  unsubscribe(destination: string) {
    const unsubscribe = this.subscriptions[destination];
    if (unsubscribe) {
      unsubscribe(); // 구독 해제
      delete this.subscriptions[destination]; // 구독 정보 삭제
      console.log(`Unsubscribed from ${destination}`);
    } else {
      console.warn(`No subscription found for ${destination}`);
    }
  }

  /**
   * 특정 주제(destination)로 메시지를 전송합니다.
   * @param destination - 메시지를 보낼 경로 (예: '/send/send')
   * @param body - 전송할 데이터 객체
   */
  sendMessage(destination: string, body: object) {
    if (!this.client) {
      console.error('WebSocket client is not connected');
      return; // WebSocket이 연결되지 않은 경우 메시지 전송 불가
    }

    // 메시지 전송
    this.client.publish({
      destination,
      body: JSON.stringify(body), // 객체를 JSON 문자열로 변환
    });

    console.log(`Message sent to ${destination}`, body);
  }
}
