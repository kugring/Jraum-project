import { WebSocketManager } from 'utils/WebSocketManager';
import { create } from 'zustand'; // 상태 관리를 위한 라이브러리

/**
 * WebSocket 상태 관리
 * - WebSocket 연결 상태를 관리하고, 연결 및 구독 작업을 수행합니다.
 */
type WebSocketState = {
  manager: WebSocketManager | null; // WebSocketManager 객체
  connected: boolean; // 현재 연결 상태
  initialize: (url: string) => void; // WebSocketManager 초기화
  connect: () => void; // WebSocket 연결
  disconnect: () => void; // WebSocket 연결 해제
};

const useWebSocketStore = create<WebSocketState>((set, get) => ({
  manager: null,
  connected: false,

  /**
   * WebSocketManager 초기화
   * @param url - WebSocket 서버 주소
   */
  initialize: (url: string) => {
    const manager = new WebSocketManager(url);
    set({ manager }); // 상태에 WebSocketManager 저장
  },

  /**
   * WebSocket 연결
   */
  connect: () => {
    const { manager } = get();
    if (!manager) {
      console.error('WebSocketManger가 초기화 되지 않았음');
      return;
    }

    // WebSocket 연결 및 상태 업데이트
    manager.connect(
      () => set({ connected: true }), // 연결 성공 시 상태 업데이트
      () => set({ connected: false }), // 연결 종료 시 상태 업데이트
    );
  },

  /**
   * WebSocket 연결 해제
   */
  disconnect: () => {
    const { manager } = get();
    if (manager) {
      manager.disconnect(); // WebSocketManager의 disconnect 호출
      set({ connected: false, manager: null }); // 상태 초기화
    }
  },
}));

export default useWebSocketStore;
