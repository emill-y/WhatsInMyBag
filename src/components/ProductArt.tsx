import React from 'react';
import Svg, { Rect, Path, Circle, Ellipse } from 'react-native-svg';
import { colors } from '../theme/tokens';
import { Shape } from '../data/types';

const fills = [colors.ink, colors.gold, colors.paper, colors.line];
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Placeholder cut-out silhouettes drawn flat in palette colors, until real product images arrive. */
export function ProductArt({ shape, id, size = 64 }: { shape: Shape; id: string; size?: number }) {
  const h = hash(id);
  const body = fills[h % fills.length];
  const cap = body === colors.gold ? colors.ink : colors.gold;
  const s = { stroke: colors.ink, strokeWidth: 1.25 } as const;
  const shapes: Record<Shape, React.ReactElement> = {
    tube: <><Path d="M38 16 h24 l-3 54 h-18 z" fill={body} {...s} /><Rect x="40" y="70" width="20" height="14" rx="1" fill={cap} {...s} /></>,
    bottle: <><Rect x="30" y="36" width="40" height="48" rx="4" fill={body} {...s} /><Rect x="42" y="24" width="16" height="12" fill={cap} {...s} /><Rect x="45" y="16" width="10" height="8" fill={colors.ink} {...s} /></>,
    jar: <><Rect x="24" y="44" width="52" height="38" rx="5" fill={body} {...s} /><Rect x="22" y="32" width="56" height="12" rx="2" fill={cap} {...s} /></>,
    compact: <><Ellipse cx="50" cy="60" rx="32" ry="10" fill={cap} {...s} /><Rect x="18" y="46" width="64" height="14" fill={cap} stroke="none" /><Path d="M18 46 v14 M82 46 v14" {...s} /><Ellipse cx="50" cy="46" rx="32" ry="10" fill={body} {...s} /></>,
    stick: <><Rect x="40" y="38" width="20" height="46" rx="2" fill={body} {...s} /><Rect x="42" y="22" width="16" height="16" fill={cap} {...s} /><Path d="M42 22 q8 -10 16 0" fill={cap} {...s} /></>,
    box: <><Rect x="22" y="30" width="56" height="52" rx="2" fill={body} {...s} /><Path d="M22 42 h56" {...s} /><Rect x="44" y="36" width="12" height="3" fill={cap} stroke="none" /></>,
    pouch: <><Path d="M20 34 q30 -10 60 0 l-4 46 q-26 8 -52 0 z" fill={body} {...s} /><Path d="M24 40 q26 -8 52 0" stroke={cap} strokeWidth={2} fill="none" /><Circle cx="72" cy="40" r="3" fill={cap} {...s} /></>,
    cup: <><Path d="M30 36 h40 l-5 46 h-30 z" fill={body} {...s} /><Rect x="28" y="28" width="44" height="8" rx="2" fill={cap} {...s} /><Path d="M46 28 v-10 h8 v10" fill={colors.paper} {...s} /></>,
    bar: <><Rect x="16" y="46" width="68" height="22" rx="3" fill={body} {...s} /><Path d="M16 50 l-4 -4 M16 64 l-4 4 M84 50 l4 -4 M84 64 l4 4" {...s} /><Rect x="40" y="52" width="20" height="10" fill={cap} {...s} /></>,
    spray: <><Rect x="34" y="38" width="32" height="46" rx="6" fill={body} {...s} /><Rect x="42" y="24" width="16" height="14" fill={cap} {...s} /><Path d="M58 28 h8" {...s} /></>,
    wand: <><Rect x="42" y="40" width="16" height="44" rx="3" fill={body} {...s} /><Rect x="43" y="14" width="14" height="26" rx="2" fill={cap} {...s} /></>,
  };
  return <Svg width={size} height={size} viewBox="0 0 100 100" accessibilityElementsHidden>{shapes[shape]}</Svg>;
}
