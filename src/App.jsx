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

export default function App() {
  // 残り秒数を管理するstate
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);

  // タイマーが動いているか止まっているか管理するstate
  const [isActive, setIsActive] = useState(false);

  // 計算
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  // タイマーのロジック
  useEffect(() => {
    let interval = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(seconds => seconds - 1);
      }, 1000);
    }

    // クリーンアップ関数
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  return (
    <AppContainer>
      <Title>ポモドーロタイマー</Title>
      <PhaseDisplay>Focus Time</PhaseDisplay>
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
          />
        </ProgressRing>
        <TimerText>{`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}</TimerText>
      </TimerContainer>
      <SetsDisplay>Set: 1 / 4</SetsDisplay>
      <InputGroup>
        <label htmlFor="sets-input">ポモドーロ数：</label>
        <StyledInput type="number" id="sets-input" defaultValue="4" />
      </InputGroup>
      <ButtonGroup>
        <StyledButton onClick={() => setIsActive(!isActive)}>
          {isActive ? "一時停止" : "スタート"}
        </StyledButton>
        <StyledButton style={{ display: "none" }}>サウンド停止</StyledButton>
      </ButtonGroup>
    </AppContainer>
  );
}
