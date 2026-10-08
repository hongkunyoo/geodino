import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import beatsData from "./beats.json";
import { Green, LogoBadge } from "./components";
import { color, FONT, FPS } from "./theme";

/**
 * 콘셉트 C — 박자에 맞춘 모션그래픽 (검토용 테스트, 사이트 미사용)
 * 음악: fal ElevenLabs Music 120 BPM (video/assets/music/beat-120-30s.mp3)
 * 박자: scripts/detect-beats.mjs → src/beats.json. 장면 전환은 마디 첫 박, 등장은 박마다.
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const BEAT_FRAMES = beatsData.beats.map((t) => Math.round(t * FPS));
const FIRST_DOWN = Math.max(0, beatsData.beats.indexOf(beatsData.downbeats[0]));

/** i번째 박의 프레임 (박이 모자라면 120 BPM으로 이어서 계산) */
const beatF = (i: number) => BEAT_FRAMES[i] ?? BEAT_FRAMES[BEAT_FRAMES.length - 1] + (i - BEAT_FRAMES.length + 1) * 15;
/** b번째 마디 첫 박의 프레임 */
const barF = (b: number) => beatF(FIRST_DOWN + b * 4);
/** 마디 b의 n번째 박 (0~3) */
const bb = (b: number, n: number) => beatF(FIRST_DOWN + b * 4 + n);

/** 가장 최근 박에서 튀었다가 줄어드는 값 (1 → 0) */
const pulse = (f: number, len = 10) => {
  let last = -1;
  for (const bf of BEAT_FRAMES) {
    if (bf <= f) last = bf;
    else break;
  }
  if (last < 0) return 0;
  const d = f - last;
  return d > len ? 0 : (1 - d / len) ** 2;
};
/** 지금까지 지난 박 수 (좌우 번갈아 흔들기 등에 사용) */
const beatCount = (f: number) => BEAT_FRAMES.filter((bf) => bf <= f).length;

/** at 프레임에 튀어나오며 등장 (0 → 1, 살짝 넘쳤다가 자리 잡음) */
const pop = (f: number, at: number, len = 9) =>
  interpolate(f, [at, at + len], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
const appear = (f: number, at: number, len = 6) => interpolate(f, [at, at + len], [0, 1], clamp);

const popStyle = (f: number, at: number): React.CSSProperties => {
  const p = pop(f, at);
  return { opacity: appear(f, at, 4), scale: String(0.4 + 0.6 * p) };
};

const text = (size: number, weight = 800): React.CSSProperties => ({
  fontFamily: FONT,
  fontSize: size,
  fontWeight: weight,
  color: color.ink,
  letterSpacing: "-0.02em",
  lineHeight: 1.25,
  wordBreak: "keep-all",
});

const dotGrid = (f: number): React.CSSProperties => ({
  backgroundImage: `radial-gradient(${color.line} ${3 + 2 * pulse(f)}px, transparent 0)`,
  backgroundSize: "48px 48px",
});

// ── 장면 1: 질문 (마디 0~1) ─────────────────────────────
const QUESTION = ["분당에서", "종합소득세", "잘하는", "세무사", "추천해줘"];

const SceneQuestion: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ backgroundColor: color.bg, ...dotGrid(f) }}>
    <div style={{ position: "absolute", left: 160, top: 210, ...text(44, 700), color: color.green700, ...popStyle(f, bb(0, 0)) }}>
      손님이 AI에게 물었습니다
    </div>
    <div
      style={{
        position: "absolute",
        left: 160,
        top: 300,
        width: 1060,
        minHeight: 330,
        padding: "48px 56px",
        borderRadius: 56,
        border: `6px solid ${color.ink}`,
        backgroundColor: color.bg,
        display: "flex",
        flexWrap: "wrap",
        alignContent: "center",
        gap: "8px 24px",
        ...popStyle(f, bb(0, 0)),
      }}
    >
      {QUESTION.map((w, i) => (
        <span key={w} style={{ ...text(84), display: "inline-block", ...popStyle(f, bb(0, 1 + i)) }}>
          {w}
        </span>
      ))}
    </div>
    <Img
      src={staticFile("img/ai-bot.webp")}
      style={{
        position: "absolute",
        left: 1310,
        top: 300,
        width: 420,
        translate: `0px ${-22 * pulse(f, 12)}px`,
        ...popStyle(f, bb(0, 0)),
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 1640,
        top: 230,
        ...text(150),
        color: color.green700,
        rotate: `${beatCount(f) % 2 ? 10 : -10}deg`,
        ...popStyle(f, bb(1, 2)),
      }}
    >
      ?
    </div>
  </AbsoluteFill>
);

// ── 장면 2: 예시 답변 (마디 2~3, 빌드업) ─────────────────
const ANSWERS = [
  ["○○세무회계", "개인사업자 종합소득세, 기장"],
  ["△△세무사무소", "법인 세무, 양도·상속 상담"],
  ["□□택스", "프리랜서·1인 사업자 신고"],
];

const SceneAnswer: React.FC<{ f: number }> = ({ f }) => {
  // 마디 3의 박마다 한 단계씩 확대되며 긴장감을 만든다
  const step = [0, 1, 2, 3].filter((n) => f >= bb(3, n)).length;
  const shake = step > 0 ? (beatCount(f) % 2 ? 1 : -1) * step * 2.5 * pulse(f, 6) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: color.surface, justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          width: 1260,
          padding: "70px 72px 56px",
          borderRadius: 40,
          border: `5px solid ${color.ink}`,
          backgroundColor: color.bg,
          display: "flex",
          flexDirection: "column",
          gap: 26,
          scale: String(1 + step * 0.035),
          translate: `${shake}px 0px`,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: -26,
            left: 60,
            ...text(30, 700),
            padding: "4px 22px",
            border: `3px solid ${color.ink}`,
            borderRadius: 999,
            backgroundColor: color.bg,
          }}
        >
          예시 화면
        </span>
        <div
          style={{
            alignSelf: "flex-end",
            ...text(36, 700),
            padding: "14px 30px",
            borderRadius: "30px 30px 6px 30px",
            backgroundColor: color.surface,
          }}
        >
          분당에서 종합소득세 잘하는 세무사 추천해줘
        </div>
        {ANSWERS.map(([name, note], i) => (
          <div
            key={name}
            style={{
              ...text(40, 600),
              opacity: appear(f, bb(2, i), 4),
              translate: `${interpolate(pop(f, bb(2, i)), [0, 1], [120, 0])}px 0px`,
            }}
          >
            {i + 1}. <b>{name}</b> — {note}
          </div>
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "16px 24px",
            borderRadius: 22,
            border: `4px dashed ${step >= 4 ? color.green700 : color.lineStrong}`,
            ...text(44),
            ...popStyle(f, bb(3, 0)),
          }}
        >
          <Img src={staticFile("img/geo-dino.webp")} style={{ width: 84, translate: `0px ${-10 * pulse(f)}px` }} />
          <span>
            우리 비즈니스는 답변에{" "}
            <span style={{ color: step >= 2 ? color.green700 : color.ink, fontSize: 44 + step * 6 }}>없어요</span>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── 장면 3: 흩어진 정보 (마디 4~5, 드롭) ─────────────────
const CHIPS: [string, number, number, number][] = [
  ["블로그", 230, 330, -8],
  ["지도", 1480, 300, 6],
  ["카페", 330, 640, 5],
  ["SNS", 1530, 640, -6],
  ["홈페이지", 640, 820, -4],
  ["리뷰", 1180, 840, 7],
  ["전화번호", 120, 860, 4],
  ["주소", 1660, 860, -5],
];

const SceneScattered: React.FC<{ f: number }> = ({ f }) => {
  const second = f >= barF(5);
  const flash = interpolate(f, [barF(4), barF(4) + 8], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: color.bg, ...dotGrid(f) }}>
      <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center", ...text(76) }}>
        <span key={second ? "b" : "a"} style={{ display: "inline-block", ...popStyle(f, second ? barF(5) : barF(4)) }}>
          {second ? (
            <>
              AI는 우리 비즈니스를 <Green>이해하기 어렵습니다</Green>
            </>
          ) : (
            "정보가 여기저기 흩어져 있으면"
          )}
        </span>
      </div>
      {CHIPS.map(([label, x, y, r], i) => (
        <div
          key={label}
          style={{
            position: "absolute",
            left: x,
            top: y,
            rotate: `${r}deg`,
            padding: "18px 38px",
            borderRadius: 999,
            border: `4px solid ${color.ink}`,
            backgroundColor: i % 2 ? color.green50 : color.bg,
            ...text(46, 700),
            ...popStyle(f, beatF(FIRST_DOWN + 16 + i)),
            scale: String(pop(f, beatF(FIRST_DOWN + 16 + i)) * (1 + 0.08 * pulse(f, 8))),
          }}
        >
          {label}
        </div>
      ))}
      <Img
        src={staticFile("img/ai-bot.webp")}
        style={{
          position: "absolute",
          left: 760,
          top: 330,
          width: 400,
          rotate: `${(beatCount(f) % 2 ? 1 : -1) * 9}deg`,
          translate: `0px ${-16 * pulse(f)}px`,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: color.green700, opacity: flash * 0.9 }} />
    </AbsoluteFill>
  );
};

// ── 장면 4: 손질하고 정리 (마디 6~7) ─────────────────────
const ROWS = ["주력 분야", "지역", "비용", "자주 묻는 질문"];

const SceneChop: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ backgroundColor: color.surface }}>
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 150,
        width: 900,
        borderRadius: 36,
        overflow: "hidden",
        border: `5px solid ${color.ink}`,
        translate: `0px ${14 * pulse(f, 6)}px`,
        ...popStyle(f, barF(6)),
      }}
    >
      <Img src={staticFile("img/K6.jpg")} style={{ width: "100%", display: "block" }} />
    </div>
    <div
      style={{
        position: "absolute",
        left: 1110,
        top: 150,
        width: 690,
        padding: "40px 44px",
        borderRadius: 36,
        border: `5px solid ${color.ink}`,
        backgroundColor: color.bg,
        display: "flex",
        flexDirection: "column",
        gap: 22,
        ...popStyle(f, bb(6, 1)),
      }}
    >
      <div style={{ ...text(40), color: color.green700 }}>정리된 비즈니스 정보</div>
      {ROWS.map((r, i) => {
        const at = beatF(FIRST_DOWN + 26 + i); // 마디 6의 셋째 박부터 한 박에 한 줄
        return (
          <div key={r} style={{ display: "flex", alignItems: "center", gap: 18, ...text(44, 700), ...popStyle(f, at) }}>
            <span
              style={{
                width: 52,
                height: 52,
                borderRadius: 999,
                backgroundColor: color.green700,
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
              }}
            >
              ✓
            </span>
            {r}
          </div>
        );
      })}
    </div>
    <div style={{ position: "absolute", bottom: 110, width: "100%", textAlign: "center", ...text(64) }}>
      <span style={{ display: "inline-block", ...popStyle(f, barF(6)) }}>
        <Green>GeoDino</Green>가 잘게 잘게 손질하고 정리합니다
      </span>
    </div>
  </AbsoluteFill>
);

// ── 장면 5: 진단 → 정리 → 다시 확인 (마디 8~10) ───────────
const STEPS = [
  { word: "진단", sub: "손님 질문으로 AI에게 직접 물어봅니다", img: "img/ai-bot.webp" },
  { word: "정리", sub: "AI가 읽기 좋게 비즈니스 정보를 정리합니다", img: "img/geo-dino.webp" },
  { word: "다시 확인", sub: "3개월 뒤 같은 질문으로 비교합니다", img: "img/dino-thumbsup.webp" },
];

const SceneSteps: React.FC<{ f: number }> = ({ f }) => {
  const i = Math.min(2, [9, 10].filter((b) => f >= barF(b)).length);
  const s = STEPS[i];
  const bar = 8 + i;
  return (
    <AbsoluteFill style={{ backgroundColor: i === 1 ? color.green50 : color.bg }}>
      <div style={{ position: "absolute", left: 180, top: 230, display: "flex", alignItems: "center", gap: 48 }}>
        <div
          key={`n${i}`}
          style={{
            width: 200,
            height: 200,
            borderRadius: 999,
            backgroundColor: color.green700,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...text(120),
            ...popStyle(f, barF(bar)),
            scale: String(pop(f, barF(bar)) * (1 + 0.06 * pulse(f, 8))),
          }}
        >
          <span style={{ color: "#fff" }}>{i + 1}</span>
        </div>
        <div key={`w${i}`} style={{ ...text(180), ...popStyle(f, barF(bar)) }}>
          {s.word}
        </div>
      </div>
      <div key={`s${i}`} style={{ position: "absolute", left: 190, top: 500, ...text(56, 700), color: color.inkMuted, ...popStyle(f, bb(bar, 1)) }}>
        {s.sub}
      </div>
      <Img
        key={`i${i}`}
        src={staticFile(s.img)}
        style={{
          position: "absolute",
          right: 170,
          top: 200,
          width: 440,
          translate: `0px ${-18 * pulse(f, 10)}px`,
          ...popStyle(f, bb(bar, 2)),
        }}
      />
      {/* 진행 표시: 단계마다 하나씩 채워진다 */}
      <div style={{ position: "absolute", left: 190, bottom: 170, display: "flex", gap: 24, alignItems: "center" }}>
        {STEPS.map((st, k) => (
          <React.Fragment key={st.word}>
            <div
              style={{
                ...text(40, 700),
                padding: "12px 34px",
                borderRadius: 999,
                border: `4px solid ${k <= i ? color.green700 : color.line}`,
                backgroundColor: k < i || (k === i && f >= bb(bar, 3)) ? color.green700 : color.bg,
                color: k < i || (k === i && f >= bb(bar, 3)) ? "#fff" : k === i ? color.green700 : color.lineStrong,
                scale: String(k === i && f >= bb(bar, 3) ? 1 + 0.12 * pulse(f, 8) : 1),
              }}
            >
              {st.word}
            </div>
            {k < 2 && <span style={{ ...text(40), color: color.lineStrong }}>→</span>}
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── 장면 6: 캐치프레이즈 (마디 11~12) ───────────────────
const LINE1 = ["AI가", "한입에", "이해하도록,"];
const LINE2: [string, boolean][] = [
  ["GeoDino가", true],
  ["요리해", false],
  ["드립니다", false],
];

const SceneCatch: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ backgroundColor: color.bg, ...dotGrid(f), alignItems: "center" }}>
    <div
      style={{
        marginTop: 90,
        width: 760,
        borderRadius: 36,
        overflow: "hidden",
        border: `5px solid ${color.ink}`,
        translate: `0px ${-12 * pulse(f, 10)}px`,
        ...popStyle(f, barF(11)),
      }}
    >
      <Img src={staticFile("img/K7.jpg")} style={{ width: "100%", display: "block" }} />
    </div>
    <div style={{ marginTop: 50, display: "flex", gap: 28, ...text(100) }}>
      {LINE1.map((w, i) => (
        <span key={w} style={{ display: "inline-block", ...popStyle(f, bb(11, i)) }}>
          {w}
        </span>
      ))}
    </div>
    <div style={{ marginTop: 10, display: "flex", gap: 28, ...text(100) }}>
      {LINE2.map(([w, green], i) => (
        <span key={w} style={{ display: "inline-block", color: green ? color.green700 : color.ink, ...popStyle(f, bb(12, i)) }}>
          {w}
        </span>
      ))}
    </div>
  </AbsoluteFill>
);

// ── 장면 7: 엔딩 CTA (마디 13~14) ───────────────────────
const SceneEnd: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ backgroundColor: color.bg, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 80 }}>
    <Img
      src={staticFile("img/dino-thumbsup.webp")}
      style={{ width: 480, translate: `0px ${-16 * pulse(f, 10)}px`, ...popStyle(f, barF(13)) }}
    />
    <div style={{ display: "flex", flexDirection: "column", gap: 30, maxWidth: 1000 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, ...text(56), ...popStyle(f, bb(13, 1)) }}>
        <Img src={staticFile("img/logo.png")} style={{ width: 76, height: 76 }} />
        GeoDino
      </div>
      <div style={{ ...text(64), ...popStyle(f, bb(13, 2)) }}>
        우리 비즈니스가 AI에게
        <br />
        어떻게 보이는지 확인해 보세요
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 28, ...popStyle(f, barF(14)) }}>
        <span
          style={{
            ...text(48),
            color: "#fff",
            backgroundColor: color.green700,
            padding: "22px 52px",
            borderRadius: 999,
            scale: String(1 + 0.07 * pulse(f, 9)),
          }}
        >
          무료 AI 노출 진단
        </span>
        <span style={{ ...text(42, 700), color: color.inkMuted }}>geodino.io</span>
      </div>
    </div>
  </AbsoluteFill>
);

// ── 장면 전환: 마디 첫 박에 맞춰 초록 막이 지나간다 ─────────
const Wipe: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  if (f < at - 6 || f > at + 6) return null;
  const x = interpolate(f, [at - 6, at, at + 6], [-100, 0, 100], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return <AbsoluteFill style={{ backgroundColor: color.green700, translate: `${x}% 0px` }} />;
};

const SCENES: { from: number; C: React.FC<{ f: number }> }[] = [
  { from: 0, C: SceneQuestion },
  { from: 2, C: SceneAnswer },
  { from: 4, C: SceneScattered },
  { from: 6, C: SceneChop },
  { from: 8, C: SceneSteps },
  { from: 11, C: SceneCatch },
  { from: 13, C: SceneEnd },
];

export const BeatSync: React.FC = () => {
  const f = useCurrentFrame();
  const idx = SCENES.reduce((acc, s, i) => (f >= (s.from === 0 ? 0 : barF(s.from)) ? i : acc), 0);
  const { C } = SCENES[idx];
  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      <C f={f} />
      {idx < SCENES.length - 1 && <LogoBadge />}
      {/* 드롭(마디 4)은 섬광, 나머지 장면 전환은 초록 막 */}
      {SCENES.slice(1)
        .filter((s) => s.from !== 4)
        .map((s) => (
          <Wipe key={s.from} f={f} at={barF(s.from)} />
        ))}
      <Audio src={staticFile("music/beat-120-30s.mp3")} />
    </AbsoluteFill>
  );
};
