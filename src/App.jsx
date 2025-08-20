import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

// --- スタイル定義 ---
const AppContainer = styled.div`
  background-color: #2c3e50;
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
  color: #e74c3c;
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
`;

const ProgressCircle = styled.circle`
  transition:
    stroke-dashoffset 0.5s linear,
    stroke 0.5s linear;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;

  &.break-time {
    stroke: #2ecc71;
  }
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

const WORK_MINUTES = 25;
const BEWAK_MINUTES = 5;

export default function App() {
  // 残り秒数を管理するstate
  const [secondsLeft, setSecondsLeft] = useState(WORK_MINUTES * 60);

  // タイマーが動いているか止まっているか管理するstate
  const [isActive, setIsActive] = useState(false);

  // 集中時間か、休憩時間かを管理するstate
  const [isWorkPhase, setIsWorkPhase] = useState(true);

  // 合計セット数を管理するstate
  const [totalSets, setTotalSets] = useState(2);

  // 現在のセット数を管理するstate
  const [currentSet, setCurrentSet] = useState(1);

  // タイマーのロジック
  useEffect(() => {
    let interval = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(seconds => seconds - 1);
      }, 1000);
      // タイマーが0になったとき
    } else if (isActive && secondsLeft === 0) {
      // 集中状態が終わったとき
      if (isWorkPhase) {
        setIsWorkPhase(false);
        setSecondsLeft(BEWAK_MINUTES * 60);
      } else {
        // 次のセットはあるか
        if (currentSet < totalSets) {
          setCurrentSet(prev => prev + 1);
          setIsWorkPhase(true);
          setSecondsLeft(WORK_MINUTES * 60);
        } else {
          // 全セット終了
          setIsActive(false);
        }
      }
    }

    // クリーンアップ関数
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, isWorkPhase, currentSet, totalSets]);

  // 表示用の計算
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  // イベントハンドラ
  const handleStartClick = () => {
    setIsActive(!isActive);
  };

  const handleResetClick = () => {
    setIsActive(false);
    setIsWorkPhase(false);
    setCurrentSet(1);
    setSecondsLeft(WORK_MINUTES * 60);
  };

  return (
    <AppContainer>
      <Title>ポモドーロタイマー</Title>
      <PhaseDisplay>{isWorkPhase ? "Focus Time" : "Break Time"}</PhaseDisplay>
      <TimerContainer>
        <ProgressRing viewBox="0 0 120 120">
          <circle
            stroke="#34495e"
            strokeWidth="8"
            fill="transparent"
            r="52"
            cx="60"
            cy="60"
          />
          <ProgressCircle
            stroke="#e74c3c"
            strokeWidth="8"
            fill="transparent"
            r="52"
            cx="60"
            cy="60"
            className={!isWorkPhase ? "break-time" : ""}
          />
        </ProgressRing>
        <TimerText>{`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}</TimerText>
      </TimerContainer>
      <SetsDisplay>
        Set: {currentSet} / {totalSets}
      </SetsDisplay>
      <InputGroup>
        <label htmlFor="sets-input">ポモドーロ数：</label>
        <StyledInput
          onChange={e => setTotalSets(Number(e.target.value))}
          type="number"
          id="sets-input"
          defaultValue="4"
        />
      </InputGroup>
      <ButtonGroup>
        <StyledButton onClick={handleStartClick}>
          {isActive ? "一時停止" : "スタート"}
        </StyledButton>
        <StyledButton onClick={handleResetClick}>リセット</StyledButton>
        <StyledButton style={{ display: "none" }}>サウンド停止</StyledButton>
      </ButtonGroup>
    </AppContainer>
  );
}
