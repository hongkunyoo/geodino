// 음악 파일에서 박자(beat)와 마디 첫 박(downbeat)을 찾아 JSON으로 저장한다.
// 사용: node scripts/detect-beats.mjs <음악> <출력.json> [마디 시작으로 알고 있는 초]
//   예: node scripts/detect-beats.mjs public/music/beat-120-30s.mp3 src/beats.json 8
//   세 번째 값을 주면 그 시각에 가장 가까운 박을 마디 첫 박으로 고정한다 (드롭 등 구간 시작을 알 때).
// 외부 라이브러리 없이 ffmpeg로 PCM을 받아 onset 강도 → 템포(자기상관) → 박 위치(위상) 순으로 계산한다.
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const [input, output, anchorArg] = process.argv.slice(2);
const SR = 22050;
const HOP = 256; // 약 11.6ms
const WIN = 1024;

const pcm = execFileSync("ffmpeg", ["-v", "error", "-i", input, "-ac", "1", "-ar", String(SR), "-f", "f32le", "-"], {
  maxBuffer: 1 << 28,
});
const samples = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.byteLength / 4);
const duration = samples.length / SR;

// 저음(킥) 대역과 전체 대역의 에너지 변화량(onset envelope)
// 저음 대역은 간단한 1차 저역 통과 필터(약 150Hz)로 근사한다.
const alpha = 1 - Math.exp((-2 * Math.PI * 150) / SR);
const low = new Float32Array(samples.length);
let y = 0;
for (let i = 0; i < samples.length; i++) {
  y += alpha * (samples[i] - y);
  low[i] = y;
}

const frames = Math.floor((samples.length - WIN) / HOP);
const energy = (buf, start) => {
  let s = 0;
  for (let i = start; i < start + WIN; i++) s += buf[i] * buf[i];
  return Math.log1p(1000 * s);
};
const onset = new Float32Array(frames);
const lowOnset = new Float32Array(frames);
let prevAll = 0;
let prevLow = 0;
for (let f = 0; f < frames; f++) {
  const a = energy(samples, f * HOP);
  const l = energy(low, f * HOP);
  onset[f] = Math.max(0, a - prevAll) + 2 * Math.max(0, l - prevLow);
  lowOnset[f] = Math.max(0, l - prevLow);
  prevAll = a;
  prevLow = l;
}

// 템포: 80~160 BPM 범위에서 자기상관이 가장 큰 주기
const fps = SR / HOP;
let best = { lag: 0, score: -1 };
for (let bpm = 80; bpm <= 160; bpm += 0.25) {
  const lag = (60 / bpm) * fps;
  let s = 0;
  for (let f = 0; f + lag * 4 < frames; f++) {
    const i1 = Math.round(f + lag);
    const i2 = Math.round(f + lag * 2);
    s += onset[f] * (onset[i1] + 0.5 * onset[i2]);
  }
  if (s > best.score) best = { lag, score: s, bpm };
}

// 위상: 박 격자 위 onset 합이 가장 큰 시작점
let phase = { off: 0, score: -1 };
for (let off = 0; off < best.lag; off += 0.25) {
  let s = 0;
  for (let t = off; t < frames; t += best.lag) s += onset[Math.round(t)] ?? 0;
  if (s > phase.score) phase = { off, score: s };
}

// 박마다 실제 onset 최댓값 근처(±40ms)로 미세 조정
const beats = [];
const snap = Math.round(0.04 * fps);
for (let t = phase.off; t < frames; t += best.lag) {
  const c = Math.round(t);
  let bi = c;
  for (let i = Math.max(0, c - snap); i <= Math.min(frames - 1, c + snap); i++) if (onset[i] > onset[bi]) bi = i;
  // 창 끝에 어택이 들어올 때 증가량이 가장 크므로 창 끝 기준으로 시간을 잡는다
  beats.push(Number(((bi * HOP + WIN - HOP / 2) / SR).toFixed(3)));
}

// 정밀 보정: 각 박 주변(±70ms)에서 5ms 단위 짧은 창의 에너지 급증 지점을 찾고,
// 일정한 템포라고 보고 최소제곱 직선(t = offset + period * i)으로 격자를 다시 만든다.
const SHORT = 110; // 5ms
const shortE = (t) => {
  const i = Math.round(t * SR);
  let e = 0;
  for (let j = i; j < i + SHORT && j < samples.length; j++) e += samples[j] * samples[j];
  return Math.log1p(1e4 * e);
};
const refined = beats.map((b) => {
  let bestT = b;
  let bestJump = -Infinity;
  for (let t = b - 0.07; t <= b + 0.07; t += SHORT / SR) {
    const jump = shortE(t) - shortE(t - 0.01);
    if (jump > bestJump) {
      bestJump = jump;
      bestT = t;
    }
  }
  return bestT;
});
const n = refined.length;
const mi = (n - 1) / 2;
const mt = refined.reduce((a, b) => a + b, 0) / n;
let num = 0;
let den = 0;
refined.forEach((t, i) => {
  num += (i - mi) * (t - mt);
  den += (i - mi) ** 2;
});
const period = num / den;
let offset = mt - period * mi;
offset -= Math.floor(offset / period) * period; // 0초 이후 첫 박
const grid = [];
for (let t = offset; t < duration - 0.05; t += period) grid.push(Number(t.toFixed(3)));
const residual = Math.sqrt(refined.reduce((a, t, i) => a + (t - (mt + period * (i - mi))) ** 2, 0) / n);

// 마디 첫 박: 4가지 위상 중 마디 앞뒤 에너지 차이(구간이 바뀌는 지점)가 가장 큰 것
const barEnergy = (t) => shortE(t + 0.02) - shortE(t - 0.03);
let down = { k: 0, score: -Infinity };
for (let k = 0; k < 4; k++) {
  let s2 = 0;
  for (let i = k; i < grid.length; i += 4) s2 += barEnergy(grid[i]);
  if (s2 > down.score) down = { k, score: s2 };
}
if (anchorArg !== undefined) {
  const anchor = Number(anchorArg);
  const idx = grid.reduce((bi, t, i) => (Math.abs(t - anchor) < Math.abs(grid[bi] - anchor) ? i : bi), 0);
  down.k = idx % 4;
}
const downbeats = grid.filter((_, i) => i % 4 === down.k);
const strength = grid.map((t) => Math.max(0, barEnergy(t)));
const maxS = Math.max(...strength);

const result = {
  source: input,
  duration: Number(duration.toFixed(3)),
  bpm: Number((60 / period).toFixed(2)),
  residualMs: Number((residual * 1000).toFixed(1)),
  beats: grid,
  downbeats,
  strength: strength.map((s) => Number((s / maxS).toFixed(3))),
};
writeFileSync(output, JSON.stringify(result, null, 2));
console.log(
  `bpm=${result.bpm} beats=${grid.length} first=${grid[0]} downbeat0=${downbeats[0]} residual=${result.residualMs}ms`,
);
