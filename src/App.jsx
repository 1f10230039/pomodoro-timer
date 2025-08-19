import React from "react";
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
  font-size: 2rem;
`;

const PhaseDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  height: 1.8rem;
  color: #e74c3c;
`;

const TimerContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
`;

const ProgressRing = styled.svg`
  width: 200px;
  height: 200px;
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
  font-size: 3.5rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const SetsDisplay = styled.div`
  font-size: 1.2rem;
  margin: 20px 0;
  height: 1.5rem;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

export default function App() {
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
        <TimerText>25:00</TimerText>
      </TimerContainer>
      <SetsDisplay>Set: 1 / 4</SetsDisplay>
      <InputGroup>
        <label htmlFor="sets-input">ポモドーロ数：</label>
        <input
          type="number"
          id="sets-input"
          defaultValue="4"
          style={{ width: "50px" }}
        />
      </InputGroup>
      <ButtonGroup>
        <button>スタート</button>
        <button style={{ display: "none" }}>サウンド停止</button>
      </ButtonGroup>
    </AppContainer>
  );
}
