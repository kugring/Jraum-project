import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface YoutubeSoundStore {
    videoId: string;
    isPlaying: boolean;
    setVideoId: (videoId: string) => void;
    setIsPlaying: (play: boolean) => void;
    togglePlaying: () => void;
}

// Zustand 상태 생성
const useYoutubeSoundStore = create<YoutubeSoundStore>()(
    devtools((set) => ({
        videoId: 'e2B0f04mq7w',
        isPlaying: false,
        setVideoId: (videoId) => set({ videoId: videoId }),
        setIsPlaying: (play) => set({ isPlaying: play }),
        togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying})),
    }))
);

export default useYoutubeSoundStore;
