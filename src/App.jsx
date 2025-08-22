import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";

// スタイル定義
const AppContainer = styled.div`
  background-color: #313131;
  min-height: 100vh;
  display: grid;
  place-content: center;
  text-align: center;
  font-family: sans-serif;
  color: #ecf0f1;
`;

const Title = styled.h1`
  font-size: 3rem;
`;

const PhaseDisplay = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 30px;
  height: 1.8rem;
  color: ${props => (props.isWorkPhase ? "#2e89ff" : "#2ecc71")};
`;

const TimerContainer = styled.div`
  position: relative;
  width: 500px;
  height: 500px;
  margin: 0 auto;
`;

const ProgressRing = styled.svg`
  width: 500px;
  height: 500px;
  transform: rotate(-90deg) scaleY(-1);
`;

const ProgressCircle = styled.circle`
  transition: stroke-dashoffset 0.5s linear;
  stroke: ${props => (props.isWorkPhase ? "#2e89ff" : "#2ecc71")};
`;

const TimerText = styled.div`
  font-size: 7.5rem;
  position: absolute;
  top: 47.5%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const SetsDisplay = styled.div`
  font-size: 3rem;
  margin: 20px 0;
  height: 1.5rem;
`;

const InputGroup = styled.div`
  margin: 40px 0;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const StyledInput = styled.input`
  width: 60px;
  height: 60px;
  font-size: 2rem;
  text-align: center;
  border: 2px solid #ecf0f1;
  background-color: transparent;
  color: #ecf0f1;
  border-radius: 5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 50px;
`;

const StyledButton = styled.button`
  font-size: 1.5rem;
  padding: 10px 20px;
  border: 2px solid #ecf0f1;
  border-radius: 5px;
  background-color: transparent;
  color: #ecf0f1;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #ecf0f1;
    color: #2c3e50;
  }
`;

// 集中する時間を設定
const WORK_MINUTES = 25;

// 休憩時間を設定
const BREAK_MINUTES = 5;

export default function App() {
  // サウンドを管理
  const soundRef = useRef(new Audio("../public/sound/maou_bgm_acoustic07.mp3"));

  // 残り秒数を管理するstate
  const [secondsLeft, setSecondsLeft] = useState(WORK_MINUTES * 60);

  // タイマーが動いているか止まっているか管理するstate
  const [isActive, setIsActive] = useState(false);

  // 集中時間か、休憩時間かを管理するstate
  const [isWorkPhase, setIsWorkPhase] = useState(true);

  // 合計セット数を管理するstate
  const [totalSets, setTotalSets] = useState(3);

  // 現在のセット数を管理するstate
  const [currentSet, setCurrentSet] = useState(1);

  // サウンドの状態を管理するstate
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);

  // タイマーのロジック
  useEffect(() => {
    let interval = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(seconds => seconds - 1);
      }, 1000);
      // タイマーが0になったとき
    } else if (isActive && secondsLeft === 0) {
      // 音楽を鳴らしてボタンを表示
      soundRef.current.play();
      setIsSoundPlaying(true);
      // 集中状態が終わったとき
      if (isWorkPhase) {
        setIsWorkPhase(false);
        setSecondsLeft(BREAK_MINUTES * 60);
      } else {
        // 次のセットはあるか
        if (currentSet < totalSets) {
          setCurrentSet(prev => prev + 1);
          setIsWorkPhase(true);
          setSecondsLeft(WORK_MINUTES * 60);
        } else {
          // 全セット終了
          setCurrentSet(prev => prev + 1);
          setIsActive(false);
        }
      }
    }

    // クリーンアップ関数
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, isWorkPhase, currentSet, totalSets]);

  // 音楽が最後まで再生されたらボタンを隠すためのuseEffect
  useEffect(() => {
    const sound = soundRef.current;
    const handleSoundEnd = () => setIsSoundPlaying(false);
    sound.addEventListener("ended", handleSoundEnd);
    return () => {
      sound.removeEventListener("ended", handleSoundEnd);
    };
  }, []);

  // 表示用の計算
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  // タイマーが全部完了したかを判断する変数
  const isFinished = !isActive && currentSet > totalSets;

  // アニメーション用の計算
  const radius = 52;
  const circumference = radius * 2 * Math.PI;
  const totalDuration = (isWorkPhase ? WORK_MINUTES : BREAK_MINUTES) * 60;
  const progress = (secondsLeft / totalDuration) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // イベントハンドラ
  // スタートボタンの処理
  const handleStartClick = () => {
    // ユーザーの最初のクリックで、ブラウザの再生許可をもらうための儀式
    if (soundRef.current.paused) {
      soundRef.current.play().catch(() => {});
      soundRef.current.pause();
    }
    // 音楽ファイルをリロードして、ブラウザにこれから使うと再認識させる
    soundRef.current.load();
    setIsActive(!isActive);
  };

  // リセットボタンの処理
  const handleResetClick = () => {
    // リセット時にも、サウンドの状態をきれいにしておく
    soundRef.current.load();

    setIsActive(false);
    setIsWorkPhase(true);
    setCurrentSet(1);
    setSecondsLeft(WORK_MINUTES * 60);
    soundRef.current.pause();
    soundRef.current.currentTime = 0;
    setIsSoundPlaying(false);
  };

  // サウンド停止ボタンの処理
  const handleStopSoundClick = () => {
    soundRef.current.pause();
    soundRef.current.currentTime = 0;
    setIsSoundPlaying(false);
  };

  return (
    <AppContainer>
      <Title>ポモドーロタイマー</Title>
      <PhaseDisplay isWorkPhase={isWorkPhase}>
        {isFinished ? "完了!" : isWorkPhase ? "Focus Time" : "Break Time"}
      </PhaseDisplay>
      <TimerContainer>
        <ProgressRing viewBox="0 0 120 120">
          <circle
            stroke="#34495e"
            strokeWidth="8"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          <ProgressCircle
            isWorkPhase={isWorkPhase}
            strokeWidth="8"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </ProgressRing>
        <TimerText>
          {isFinished
            ? "終了"
            : `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
        </TimerText>
      </TimerContainer>
      <SetsDisplay>
        {isFinished ? "お疲れ様でした!" : `Set: ${currentSet} / ${totalSets}`}
      </SetsDisplay>
      {!isActive && (
        <InputGroup>
          <label htmlFor="sets-input">ポモドーロ数：</label>
          <StyledInput
            onChange={e => setTotalSets(Number(e.target.value))}
            disabled={isActive}
            type="number"
            id="sets-input"
            value={totalSets}
          />
        </InputGroup>
      )}
      <ButtonGroup>
        <StyledButton onClick={handleStartClick}>
          {isActive ? "一時停止" : "スタート"}
        </StyledButton>
        <StyledButton onClick={handleResetClick}>リセット</StyledButton>
        {isSoundPlaying && (
          <StyledButton onClick={handleStopSoundClick}>
            サウンド停止
          </StyledButton>
        )}
      </ButtonGroup>
    </AppContainer>
  );
}
