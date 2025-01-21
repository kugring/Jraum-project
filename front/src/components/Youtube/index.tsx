import React, { useEffect, useRef, useState } from "react";

interface YouTubePlayerProps {
    videoId: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId }) => {
    const playerRef = useRef<YT.Player | null>(null); // YouTube Player의 참조를 저장
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const loadYouTubeAPI = () => {
            const script = document.createElement("script");
            script.src = "https://www.youtube.com/iframe_api";
            script.async = true;

            window.onYouTubeIframeAPIReady = () => {
                playerRef.current = new window.YT.Player("youtube-player", {
                    videoId: videoId,
                    playerVars: {
                        autoplay: 1,
                        controls: 0,
                        loop: 1,
                        modestbranding: 1,
                        playlist: videoId, // 반복 재생 설정
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
    }, [videoId]);

    const togglePlayPause = () => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.pauseVideo();
            } else {
                playerRef.current.playVideo();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <>
            <div id="youtube-player" style={{ display: "none" }} /> {/* 숨김 처리 */}
        </>
    );
};

export default YouTubePlayer;
