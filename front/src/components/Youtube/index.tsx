import React, { useEffect, useRef } from "react";
import useYoutubeSoundStore from "store/youtube-sound.store";


const YouTubePlayer = () => {

    const videoID = useYoutubeSoundStore(state => state.videoId)
    const isPlaying = useYoutubeSoundStore(state => state.isPlaying)
    const setIsPlaying = useYoutubeSoundStore(state => state.setIsPlaying)


    const playerRef = useRef<YT.Player | null>(null); // YouTube Player의 참조를 저장


    useEffect(() => {
        const loadYouTubeAPI = () => {
            const script = document.createElement("script");
            script.src = "https://www.youtube.com/iframe_api";
            script.async = true;

            window.onYouTubeIframeAPIReady = () => {
                playerRef.current = new window.YT.Player("youtube-player", {
                    videoId: videoID,
                    playerVars: {
                        autoplay: 1,
                        controls: 0,
                        loop: 1,
                        modestbranding: 1,
                        playlist: videoID, // 반복 재생 설정
                    },
                    events: {
                        onReady: () => {
                            setIsPlaying(true); // 플레이어 준비 완료 후 상태 업데이트
                        },
                    },
                });
            };

            document.body.appendChild(script);
        };

        if (!window.YT) {
            loadYouTubeAPI(); // API가 없으면 로드
        } else if (window.YT && window.YT.Player) {
            window.onYouTubeIframeAPIReady?.(); // API가 이미 로드된 경우 초기화
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy(); // 컴포넌트 언마운트 시 YouTube Player 정리
            }
        };
    }, [videoID]);



    useEffect(() => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.pauseVideo();
            } else {
                playerRef.current.playVideo();
            }
        };
    }, [isPlaying]);

    return (
        <div>
            <div id="youtube-player" style={{ display: "none" }} /> {/* 숨김 처리 */}
        </div>
    );
};

export default YouTubePlayer;
