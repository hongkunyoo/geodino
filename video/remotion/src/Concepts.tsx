import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { AnswerCard, Caption, Clip, EndCard, Green, LogoBadge, QuestionBubble } from "./components";
import { DURATION, FPS, type Provider } from "./theme";

const s = (sec: number) => Math.round(sec * FPS);

const Music: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <Audio
      src={staticFile("music/bgm.mp3")}
      volume={(f) =>
        interpolate(f, [0, 15, durationInFrames - 30, durationInFrames], [0, 0.55, 0.55, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};

/** 콘셉트 A — 사장님 문제 스토리 (video/storyboard.md) */
export const ConceptA: React.FC<{ provider: Provider }> = ({ provider }) => (
  <AbsoluteFill style={{ backgroundColor: "#fff" }}>
    <Sequence name="A1 질문" durationInFrames={s(5)}>
      <Clip provider={provider} shot="K1" seconds={5} />
      <QuestionBubble
        text="분당에서 종합소득세 잘하는 세무사 추천해줘"
        style={{ left: 200, top: 150, width: 860, minHeight: 260 }}
      />
      <Caption lines={["손님이 AI에게 추천을 물었습니다"]} />
    </Sequence>

    <Sequence name="A2a 예시 답변" from={s(5)} durationInFrames={s(3.5)}>
      <AnswerCard />
      <Caption lines={[<>그런데 답변에 <Green>우리 비즈니스</Green>가 없습니다</>]} />
    </Sequence>

    <Sequence name="A2b 걱정하는 공룡" from={s(8.5)} durationInFrames={s(3.5)}>
      <Clip provider={provider} shot="K2" seconds={5} />
      <Caption lines={["우리 정보가 AI에게 잘 전달되지 않고 있다는 뜻입니다"]} />
    </Sequence>

    <Sequence name="A3 AI는 웹을 읽는다" from={s(12)} durationInFrames={s(7)}>
      <Clip provider={provider} shot="K3" seconds={7} />
      <Caption
        lines={["손님은 이제 검색창뿐 아니라 AI에게도 묻습니다", "AI는 웹에 정리된 정보로 답을 만듭니다"]}
        at={[0, 3.5]}
      />
    </Sequence>

    <Sequence name="A4 GeoDino가 정리" from={s(19)} durationInFrames={s(7)}>
      <Clip provider={provider} shot="K4" seconds={7} />
      <Caption
        lines={[<><Green>GeoDino</Green>가 흩어진 정보를 AI가 읽기 좋게 정리합니다</>]}
        chips={["진단", "정리", "다시 확인"]}
      />
    </Sequence>

    <Sequence name="A5 엔딩" from={s(26)} durationInFrames={s(4)}>
      <EndCard />
    </Sequence>

    <Sequence name="로고" durationInFrames={s(26)}>
      <LogoBadge />
    </Sequence>
    <Music />
  </AbsoluteFill>
);

/** 콘셉트 B — 요리 비유 (video/storyboard.md) */
export const ConceptB: React.FC<{ provider: Provider }> = ({ provider }) => (
  <AbsoluteFill style={{ backgroundColor: "#fff" }}>
    <Sequence name="B1 흩어진 정보" durationInFrames={s(8)}>
      <Clip provider={provider} shot="K5" seconds={8} />
      <Caption
        lines={["블로그, 지도, 카페… 정보가 여기저기 흩어져 있으면", "AI는 우리 비즈니스를 소화하기 어렵습니다"]}
        at={[0, 4]}
      />
    </Sequence>

    <Sequence name="B2 손질하는 공룡" from={s(8)} durationInFrames={s(8)}>
      <Clip provider={provider} shot="K6" seconds={8} />
      <Caption
        lines={[<><Green>GeoDino</Green>가 잘게 잘게 손질하고 정리합니다</>]}
        chips={["주력 분야", "지역", "비용", "자주 묻는 질문"]}
      />
    </Sequence>

    <Sequence name="B3 한입에" from={s(16)} durationInFrames={s(8)}>
      <Clip provider={provider} shot="K7" seconds={8} />
      <Caption
        lines={["AI가 한입에 이해하도록,", <><Green>GeoDino</Green>가 요리해 드립니다</>]}
        at={[0, 3.5]}
      />
    </Sequence>

    <Sequence name="B4 엔딩" from={s(24)} durationInFrames={s(6)}>
      <EndCard tagline="진단하고, 정리하고, 다시 확인합니다" />
    </Sequence>

    <Sequence name="로고" durationInFrames={s(24)}>
      <LogoBadge />
    </Sequence>
    <Music />
  </AbsoluteFill>
);

export const TOTAL = DURATION;
