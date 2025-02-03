import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface YoutubeSoundStore {
    videoId: string;
    isPlaying: boolean;
    setVideoId: (videoId: string) => void;
    setIsPlaying: (play: boolean) => void;
    togglePlaying: () => void;
    ttsGain: number;
    setTtsGain: (volume: number) => void;
}

// Zustand 상태 생성
const useYoutubeSoundStore = create<YoutubeSoundStore>()(
    devtools((set) => ({
        videoId: 'PmqJZHWm7JA',
        ttsGain: 50,
        isPlaying: false,
        setVideoId: (videoId) => set({ videoId: videoId }),
        setIsPlaying: (play) => set({ isPlaying: play }),
        setTtsGain: (volume) => set({ ttsGain: volume }),
        togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying})),
    }))
);

export default useYoutubeSoundStore;
