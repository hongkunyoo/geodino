import { Video } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import durations from "./clip-durations.json";
import { color, FONT, type Provider } from "./theme";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** AI 클립을 장면 길이에 맞춰 속도를 조절해 꽉 채운다 */
export const Clip: React.FC<{ provider: Provider; shot: string; seconds: number }> = ({
  provider,
  shot,
  seconds,
}) => {
  const clipSeconds =
    (durations as Record<string, Record<string, number>>)[provider]?.[shot] ?? 5;
  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      <Video
        src={staticFile(`clips/${provider}/${shot}.mp4`)}
        playbackRate={Math.min(1, clipSeconds / seconds)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

/** 화면 아래 자막 상자. lines[i]는 at[i]초부터 바뀐다 */
export const Caption: React.FC<{
  lines: React.ReactNode[];
  at?: number[];
  chips?: string[];
}> = ({ lines, at = [0], chips }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const idx = Math.max(0, at.filter((s) => t >= s).length - 1);
  const start = at[idx] * fps;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 56 }}>
      <div
        style={{
          fontFamily: FONT,
          minWidth: 900,
          maxWidth: 1560,
          padding: "26px 48px",
          borderRadius: 28,
          border: `3px solid ${color.ink}`,
          backgroundColor: "rgba(255,255,255,0.96)",
          textAlign: "center",
          opacity: interpolate(frame, [0, 10, durationInFrames - 8, durationInFrames], [0, 1, 1, 0], clamp),
          translate: interpolate(frame, [0, 14], ["0px 24px", "0px 0px"], { ...clamp, easing: ease }),
        }}
      >
        <div
          key={idx}
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: color.ink,
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
            opacity: interpolate(frame, [start, start + 10], [0, 1], clamp),
          }}
        >
          {lines[idx]}
        </div>
        {chips && (
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 18 }}>
            {chips.map((c, i) => (
              <span
                key={c}
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  padding: "8px 24px",
                  borderRadius: 999,
                  backgroundColor: color.green50,
                  border: `2px solid ${color.green700}`,
                  color: color.green700,
                  opacity: interpolate(frame, [20 + i * 8, 30 + i * 8], [0, 1], clamp),
                  scale: interpolate(frame, [20 + i * 8, 30 + i * 8], [0.8, 1], { ...clamp, easing: ease }),
                }}
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const Green: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: color.green700 }}>{children}</span>
);

/** 왼쪽 위 작은 로고 (브랜드 표시) */
export const LogoBadge: React.FC = () => (
  <AbsoluteFill style={{ padding: 36, pointerEvents: "none" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 34,
        color: color.ink,
        backgroundColor: "rgba(255,255,255,0.9)",
        alignSelf: "flex-start",
        padding: "8px 20px 8px 10px",
        borderRadius: 999,
      }}
    >
      <Img src={staticFile("img/logo.png")} style={{ width: 48, height: 48 }} />
      GeoDino
    </div>
  </AbsoluteFill>
);

/** 손님 질문 말풍선: 글자가 한 글자씩 써진다 */
export const QuestionBubble: React.FC<{ text: string; style?: React.CSSProperties }> = ({
  text,
  style,
}) => {
  const frame = useCurrentFrame();
  const shown = Math.floor(interpolate(frame, [12, 12 + text.length * 2], [0, text.length], clamp));
  return (
    <div
      style={{
        position: "absolute",
        fontFamily: FONT,
        fontSize: 48,
        fontWeight: 700,
        lineHeight: 1.4,
        wordBreak: "keep-all",
        color: color.ink,
        backgroundColor: color.bg,
        border: `5px solid ${color.ink}`,
        borderRadius: 48,
        padding: "40px 48px",
        display: "flex",
        alignItems: "center",
        opacity: interpolate(frame, [0, 10], [0, 1], clamp),
        scale: interpolate(frame, [0, 14], [0.9, 1], { ...clamp, easing: ease }),
        ...style,
      }}
    >
      {text.slice(0, shown)}
      <span style={{ opacity: frame % 20 < 10 ? 1 : 0, color: color.green700 }}>|</span>
    </div>
  );
};

/** 사이트 히어로의 "예시 화면" AI 답변 카드와 같은 내용 (실제 답변·실제 업체 아님) */
export const AnswerCard: React.FC = () => {
  const frame = useCurrentFrame();
  const items = [
    ["○○세무회계", "개인사업자 종합소득세, 기장"],
    ["△△세무사무소", "법인 세무, 양도·상속 상담"],
    ["□□택스", "프리랜서·1인 사업자 신고"],
  ];
  const appear = (f: number) => ({
    opacity: interpolate(frame, [f, f + 8], [0, 1], clamp),
    translate: interpolate(frame, [f, f + 10], ["0px 16px", "0px 0px"], { ...clamp, easing: ease }),
  });
  return (
    <AbsoluteFill style={{ backgroundColor: color.surface, justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          width: 1180,
          fontFamily: FONT,
          backgroundColor: color.bg,
          border: `4px solid ${color.ink}`,
          borderRadius: 36,
          padding: "64px 64px 52px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
          marginTop: -120,
          ...appear(0),
        }}
      >
        <span
          style={{
            position: "absolute",
            top: -24,
            left: 56,
            fontSize: 28,
            fontWeight: 700,
            padding: "4px 20px",
            border: `2px solid ${color.ink}`,
            borderRadius: 999,
            backgroundColor: color.bg,
          }}
        >
          예시 화면
        </span>
        <div
          style={{
            alignSelf: "flex-end",
            fontSize: 34,
            fontWeight: 700,
            padding: "14px 28px",
            borderRadius: "28px 28px 6px 28px",
            backgroundColor: color.surface,
          }}
        >
          분당에서 종합소득세 잘하는 세무사 추천해줘
        </div>
        <div style={{ display: "flex", gap: 22, alignItems: "flex-start", ...appear(10) }}>
          <Img src={staticFile("img/ai-bot.webp")} style={{ width: 72, height: 72, objectFit: "contain" }} />
          <div style={{ fontSize: 32, lineHeight: 1.55 }}>
            분당에서 많이 언급되는 세무사무소를 정리했어요.
            {items.map(([name, note], i) => (
              <div key={name} style={{ ...appear(20 + i * 8) }}>
                {i + 1}. <b>{name}</b> — {note}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 34,
            fontWeight: 800,
            padding: "14px 22px",
            border: `3px dashed ${color.lineStrong}`,
            borderRadius: 20,
            ...appear(52),
          }}
        >
          <Img src={staticFile("img/geo-dino.webp")} style={{ width: 64, height: 64, objectFit: "contain" }} />
          우리 사무소는 답변에 없어요
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 마지막 CTA 화면 */
export const EndCard: React.FC<{ tagline?: string }> = ({ tagline }) => {
  const frame = useCurrentFrame();
  const appear = (f: number) => ({
    opacity: interpolate(frame, [f, f + 10], [0, 1], clamp),
    translate: interpolate(frame, [f, f + 14], ["0px 24px", "0px 0px"], { ...clamp, easing: ease }),
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: color.bg,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 80,
        fontFamily: FONT,
      }}
    >
      <Img
        src={staticFile("img/dino-thumbsup.webp")}
        style={{
          width: 460,
          height: 460,
          objectFit: "contain",
          ...appear(0),
          scale: interpolate(frame, [0, 16], [0.85, 1], { ...clamp, easing: Easing.spring({ damping: 12 }) }),
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 1000 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 52, fontWeight: 800, ...appear(4) }}>
          <Img src={staticFile("img/logo.png")} style={{ width: 72, height: 72 }} />
          GeoDino
        </div>
        {tagline && (
          <div style={{ fontSize: 40, fontWeight: 700, color: color.green700, ...appear(8) }}>{tagline}</div>
        )}
        <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.3, letterSpacing: "-0.02em", ...appear(12) }}>
          우리 비즈니스가 AI에게
          <br />
          어떻게 보이는지 확인해 보세요
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28, ...appear(22) }}>
          <span
            style={{
              fontSize: 44,
              fontWeight: 800,
              color: "#fff",
              backgroundColor: color.green700,
              padding: "20px 48px",
              borderRadius: 999,
            }}
          >
            무료 AI 노출 진단
          </span>
          <span style={{ fontSize: 40, fontWeight: 700, color: color.inkMuted }}>geodino.io</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
