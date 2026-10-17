// Renders Spellbound's verdict sounds to WAV so an iOS Shortcut can play them (Play Sound action).
// Same recipes as the in-app Web Audio synth. Run: node spellbound/sounds/make-sounds.mjs
import { writeFileSync } from 'node:fs';

const SR = 44100;
const render = (secs, fn) => { const out = new Float32Array(Math.ceil(secs * SR)); fn(out); return out; };
const env = (t, a, d) => (t < 0 || t > d ? 0 : Math.min(1, t / a) * Math.exp(-5 * t / d));
const wave = {
  sine: p => Math.sin(2 * Math.PI * p),
  tri: p => 1 - 4 * Math.abs(((p + 0.25) % 1) - 0.5),
  saw: p => 2 * (p % 1) - 1,
};
function tone(out, { f, to = f, t0 = 0, d, type = 'sine', g = 0.2, a = 0.008, vib = 0, hold = false }) {
  let ph = 0;
  for (let i = Math.floor(t0 * SR); i < out.length; i++) {
    const t = i / SR - t0; if (t > d) break;
    const fr = f * Math.pow(to / f, t / d) + (vib ? Math.sin(2 * Math.PI * 6 * t) * vib : 0);
    ph += fr / SR;
    const e = hold ? Math.min(1, t / a) * (t > d * 0.6 ? Math.max(0, 1 - (t - d * 0.6) / (d * 0.4)) : 1) : env(t, a, d);
    out[i] += wave[type](ph) * g * e;
  }
}
function lowpass(buf, cutoff) {
  const k = 1 - Math.exp(-2 * Math.PI * cutoff / SR); let y = 0;
  for (let i = 0; i < buf.length; i++) { y += k * (buf[i] - y); buf[i] = y; }
  return buf;
}
function echo(out, time = 0.16, fb = 0.38, wet = 0.35) {
  const n = Math.floor(time * SR), d = new Float32Array(out.length);
  for (let i = 0; i < out.length; i++) { d[i] = out[i] + (i >= n ? d[i - n] * fb : 0); }
  for (let i = n; i < out.length; i++) out[i] += d[i - n] * wet;
}
function mix(out, src, g = 1) { for (let i = 0; i < out.length; i++) out[i] += src[i] * g; }

const sad = render(2.6, out => {
  // smoke poof
  const poof = new Float32Array(out.length);
  for (let i = 0; i < 0.7 * SR; i++) poof[i] = (Math.random() * 2 - 1) * env(i / SR, 0.04, 0.7) * 0.9;
  mix(out, lowpass(poof, 500));
  // wah, wah, wah, waaah
  const horn = new Float32Array(out.length);
  [311.1, 293.7, 277.2].forEach((f, i) => {
    tone(horn, { f, t0: 0.15 + i * 0.36, d: 0.34, type: 'saw', g: 0.22, a: 0.03, hold: true });
    tone(horn, { f: f / 2, t0: 0.15 + i * 0.36, d: 0.34, type: 'tri', g: 0.25, a: 0.03, hold: true });
  });
  tone(horn, { f: 261.6, to: 246, t0: 0.15 + 3 * 0.36, d: 1.2, type: 'saw', g: 0.25, a: 0.04, vib: 7, hold: true });
  tone(horn, { f: 130.8, to: 123, t0: 0.15 + 3 * 0.36, d: 1.2, type: 'tri', g: 0.2, a: 0.04, vib: 3.5, hold: true });
  mix(out, lowpass(horn, 1100));
});

const happy = render(2.2, out => {
  [1046.5, 1318.5, 1568, 2093, 2637].forEach((f, i) => {
    tone(out, { f, t0: i * 0.075, d: 0.9, type: 'tri', g: 0.16 });
    tone(out, { f: f * 2, t0: i * 0.075, d: 0.5, g: 0.05 });
  });
  for (let i = 0; i < 16; i++) tone(out, { f: 2600 + Math.random() * 3200, t0: 0.25 + Math.random() * 0.9, d: 0.12, g: 0.05 });
  tone(out, { f: 523.25, d: 1.2, g: 0.1 });
  echo(out);
});

function wav(buf, path) {
  let peak = 0; for (const s of buf) peak = Math.max(peak, Math.abs(s));
  const n = buf.length, b = Buffer.alloc(44 + n * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n * 2, 4); b.write('WAVEfmt ', 8);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34);
  b.write('data', 36); b.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) b.writeInt16LE(Math.round(buf[i] / peak * 0.89 * 32767), 44 + i * 2);
  writeFileSync(new URL(path, import.meta.url), b);
}
wav(sad, './sad.wav');
wav(happy, './happy.wav');
console.log('wrote sad.wav and happy.wav');
