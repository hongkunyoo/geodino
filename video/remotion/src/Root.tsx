import React from "react";
import { Composition, Folder } from "remotion";
import { BeatSync } from "./BeatSync";
import { ConceptA, ConceptB } from "./Concepts";
import { DURATION, FPS, HEIGHT, WIDTH, fontsReady, type Provider } from "./theme";

void fontsReady;

const providers: Provider[] = ["fal", "higgsfield", "runway"];

/** 후보 6개: 콘셉트 A·B × 서비스 3개 (video/storyboard.md) */
export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="A-problem-story">
      {providers.map((p) => (
        <Composition
          key={p}
          id={`A-${p}`}
          component={ConceptA}
          defaultProps={{ provider: p }}
          durationInFrames={DURATION}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      ))}
    </Folder>
    <Folder name="B-cooking">
      {providers.map((p) => (
        <Composition
          key={p}
          id={`B-${p}`}
          component={ConceptB}
          defaultProps={{ provider: p }}
          durationInFrames={DURATION}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      ))}
    </Folder>
    {/* 박자 맞춤 모션그래픽 테스트 (검토용, 사이트 미사용) */}
    <Folder name="C-beat-sync">
      <Composition id="C-beat-fal" component={BeatSync} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
    </Folder>
  </>
);
