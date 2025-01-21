import React, { useEffect, useRef, useState } from "react";

interface YouTubePlayerProps {
    videoId: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId }) => {
    const playerRef = useRef<YT.Player | null>(null);
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
                        autoplay: 1, // 자동 재생 활성화
                        mute: 1, // 음소거 활성화
                        controls: 0,
                        loop: 1,
                        modestbranding: 1,
                        playlist: videoId,
                    },
                    events: {
                        onReady: () => {
                            setIsPlaying(true); // 준비 완료 후 상태 업데이트
                        },
                    },
                });
            };

            document.body.appendChild(script);
        };

        if (!window.YT) {
            loadYouTubeAPI();
        } else if (window.YT && window.YT.Player) {
            window.onYouTubeIframeAPIReady?.();
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [videoId]);

    const handleUnmute = () => {
        if (playerRef.current) {
            playerRef.current.unMute();
            setIsPlaying(true);
        }
    };

    return (
        <>
            <div id="youtube-player" style={{ display: "none" }} /> {/* 숨김 처리 */}
            {!isPlaying && <button onClick={handleUnmute}>음소거 해제</button>}
        </>
    );
};

export default YouTubePlayer;
