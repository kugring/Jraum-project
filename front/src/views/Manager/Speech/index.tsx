import React, { useState, useEffect } from "react";

const TTSComponent = () => {
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 상태의 타입을 명시적으로 지정
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]); // 음성 목록
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null); // 선택된 음성

  // 음성 목록 로드 및 선택
  useEffect(() => {
    const synth = window.speechSynthesis;

    // 음성 목록 로드
    const loadVoices = () => {



      const voiceList = synth.getVoices();
      setVoices(voiceList); // 음성 목록을 상태에 저장

      // 엣지 브라우저일 경우 Microsoft HyunsuMultilingual Online (Natural) 음성 선택
      const hyunsuVoice = voiceList.find(
        (voice) => voice.name === "Microsoft HyunsuMultilingual Online (Natural) - Korean (Korea)"
      );
      
      if (hyunsuVoice) {
        setSelectedVoice(hyunsuVoice); // 해당 음성을 선택
      }

      // 기본적으로 첫 번째 음성을 선택
      if (!selectedVoice && voiceList.length > 0) {
        setSelectedVoice(voiceList[0]); 
      }
    };

    // 음성 목록이 변경되면 음성 로드
    synth.onvoiceschanged = loadVoices;
    loadVoices();
  }, [selectedVoice]); // selectedVoice가 변경되면 다시 실행되도록 추가

  // TTS 처리
  const handleSpeak = () => {
    if (!text.trim() || !selectedVoice) return;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    console.log("selectedVoice: "+JSON.stringify(selectedVoice));
    
    utterance.voice = selectedVoice; // 선택된 목소리 사용
    utterance.lang = selectedVoice.lang; // 선택된 목소리의 언어 사용
    utterance.pitch = 1; // 톤
    utterance.rate = 1.2; // 속도
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synth.speak(utterance);
  };

  return (
    <div>
      <textarea
        placeholder="읽어줄 텍스트를 입력하세요"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <select
        value={selectedVoice?.name || ""}
        onChange={(e) =>
          setSelectedVoice(voices.find((v) => v.name === e.target.value) || null)
        }
        aria-label="Select voice"
      >
        {voices.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>
      <button onClick={handleSpeak} disabled={isSpeaking}>
        {isSpeaking ? "읽는 중..." : "읽기"}
      </button>
    </div>
  );
};

export default TTSComponent;
