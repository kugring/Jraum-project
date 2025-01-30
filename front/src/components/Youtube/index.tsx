import styled from "styled-components";
import { MdArrowDropDown } from "react-icons/md";
import { useYoutubeSoundStore } from "store";
import { useEffect, useRef, useState } from "react";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";

//          component: 유튜브 음악 재생 컴포넌트               //
const YouTubePlayer = () => {

    //              state: 유튜브 음악 재생 상태          //
    const { videoId, isPlaying, setVideoId, setIsPlaying } = useYoutubeSoundStore();
    //              state: 유튜브 플레이어 준비 상태          //
    const [readyPlay, setReadyPlay] = useState(false);
    //              state: 유튜브 플레이어          //
    const playerRef = useRef<YT.Player | null>(null);
    //              state: 드롭다운 열림/닫힘 상태          //
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 상태 초기화
    //              state: 드롭다운 컨테이너를 참조하기 위한 참조          //
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    //              object: 유튜브 음악 리스트          //
    const videoList: { [key: string]: string } = {
        "신나는 재즈CCM": "PmqJZHWm7JA",
        "조용한 재즈CCM": "wUvomTzKygs",
        "신나는 위러브": "fMF3KPJ1CoU",
    };

    //              effect: 유튜브 플레이어 로드          //
    useEffect(() => {
        const loadYouTubeAPI = () => {
            const script = document.createElement("script");
            script.src = "https://www.youtube.com/iframe_api";
            script.async = true;

            window.onYouTubeIframeAPIReady = () => {
                playerRef.current = new window.YT.Player("youtube-player", {
                    videoId: videoId,
                    playerVars: {
                        autoplay: 0, // 자동 재생을 막음
                        controls: 0,
                        loop: 1,
                        modestbranding: 1,
                        playlist: videoId,
                    },
                    events: {
                        onReady: () => {
                            setReadyPlay(true); // 플레이어 준비 완료 후 상태 업데이트
                            // 비디오 준비가 되면, isPlaying이 true일 때만 비디오를 재생
                            if (isPlaying) {
                                playerRef.current?.playVideo();
                            }
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
    }, []); // 첫 번째 로딩 시에만 실행

    //              effect: 유튜브 음악 재생 상태 변경          //
    useEffect(() => {
        if (playerRef.current && videoId) {
            // videoID가 변경될 때 자동으로 재생되지 않도록 isPlaying 상태 확인 후 재생
            if (isPlaying) {
                playerRef.current.playVideo(); // 비디오 재생
            } else {
                playerRef.current.pauseVideo(); // 비디오 일시 정지
            }
        }
    }, [isPlaying]); // videoID나 isPlaying이 변경될 때마다 실행

    //              effect: 유튜브 음악 변경          //
    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.loadVideoById(videoId); // 비디오 로드
            playerRef.current.pauseVideo(); // 비디오 일시 정지
            setIsPlaying(false); // 플레이를 멈춤 초기화
        }
    }, [videoId]); // isPlaying 상태 변경 시 실행


    // 드롭다운 열기/닫기 핸들러
    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev); // 이전 상태 반전
    };

    //              function: 유튜브 음악 변경 함수          //
    const handleSelect = (key: string) => {
        setVideoId(videoList[key]);
    };

    //              function: 유튜브 음악 재생 버튼 함수          //
    const onCLickPlay = () => {
        const onCLickPlay = useYoutubeSoundStore.getState().togglePlaying;
        onCLickPlay();
    };

    //              effect: 드롭다운 영역 바깥을 클릭했을 때 닫히는 효과 추가               //
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isDropdownOpen && !dropdownRef.current?.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    //              render: 유튜브 음악 재생 컴포넌트          //
    return (
        <YouTubePlayerE>
            <DropdownContainer onClick={() => toggleDropdown()} ref={dropdownRef}>
                <DropdownHeader>
                    <SelectCCM>
                        {Object.keys(videoList).find((key) => videoList[key] === videoId) || "음악 선택"}
                    </SelectCCM>
                    <MdArrowDropDown size={20} />
                </DropdownHeader>
                {isDropdownOpen && (
                    <DropdownList>
                        {Object.entries(videoList).map(([key, value]) => (
                            <DropdownItem key={key} onClick={() => handleSelect(key)}>
                                {key}
                            </DropdownItem>
                        ))}
                    </DropdownList>
                )}
            </DropdownContainer>
            <div id="youtube-player" style={{ display: "none" }} />
            <MusicButton $show={readyPlay} $active={isPlaying} onClick={() => onCLickPlay()}>
                {isPlaying ? <ImCheckboxChecked size={14} /> : <ImCheckboxUnchecked size={14} />}음악 재생
            </MusicButton>
        </YouTubePlayerE>
    );
};

export default YouTubePlayer;

const YouTubePlayerE = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 12px;
  color: var(--copperBrown);
`;

const DropdownContainer = styled.div`
  position: relative;
    width: 160px;
`;

const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  gap: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
`;

const SelectCCM = styled.div`
    flex: 1;
    font-size: 14px;
`;

const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const DropdownItem = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const MusicButton = styled.div<{ $show: boolean; $active: boolean }>`
  display: ${({ $show }) => ($show ? "flex" : "none")};
  opacity: ${({ $active }) => ($active ? "1" : "0.7")};
  font-size: 14px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  color: var(--copperBrown);
`;
