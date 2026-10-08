import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/** 사이트 디자인 토큰과 같은 값 (src/styles/tokens.css, docs/brand.md) */
export const color = {
  bg: "#ffffff",
  surface: "#f6f8f6",
  ink: "#17191c",
  inkMuted: "#5a615d",
  line: "#e2e6e3",
  lineStrong: "#848b87",
  green50: "#eef7f0",
  green100: "#ddf2e3",
  green700: "#18723e",
  bot: "#2b2f36",
};

export const FONT = "Pretendard";

const weights = [
  ["Regular", "400"],
  ["SemiBold", "600"],
  ["Bold", "700"],
  ["ExtraBold", "800"],
] as const;

export const fontsReady = Promise.all(
  weights.map(([name, weight]) =>
    loadFont({ family: FONT, url: staticFile(`fonts/Pretendard-${name}.woff2`), weight }),
  ),
);

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION = 30 * FPS;

export type Provider = "fal" | "higgsfield" | "runway";
