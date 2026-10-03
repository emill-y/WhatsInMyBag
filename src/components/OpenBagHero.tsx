import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { router } from 'expo-router';
import { colors } from '../theme/tokens';
import { fonts, type } from '../theme/typography';
import { Item } from '../data/types';
import { productById } from '../data/products';
import { daysLeft, status } from '../logic/depletion';
import { BagIllustration } from './BagIllustration';
import { ProductArt } from './ProductArt';

// Fixed art-directed slots (fractions of width/height): item centre + label centre.
const SLOTS = [
  { x: 0.13, y: 0.4, lx: 0.14, ly: 0.22 },
  { x: 0.37, y: 0.27, lx: 0.3, ly: 0.07 },
  { x: 0.63, y: 0.27, lx: 0.7, ly: 0.07 },
  { x: 0.87, y: 0.4, lx: 0.86, ly: 0.22 },
  { x: 0.1, y: 0.69, lx: 0.12, ly: 0.865 },
  { x: 0.9, y: 0.69, lx: 0.88, ly: 0.865 },
  { x: 0.41, y: 0.45, lx: 0.2, ly: 0.555 },
  { x: 0.59, y: 0.45, lx: 0.8, ly: 0.555 },
];

export function OpenBagHero({ items, width }: { items: Item[]; width: number }) {
  const H = Math.round(width * 1.3);
  const shown = items.slice(0, 8);
  const art = Math.round(Math.min(64, width * 0.17));
  const bagW = width * 0.72;
  const labelW = 104;

  const arrows = shown.map((it, i) => {
    const s = SLOTS[i];
    const ix = s.x * width, iy = s.y * H, lx = s.lx * width, ly = s.ly * H + 4; // label block centre
    const dx = ix - lx, dy = iy - ly, d = Math.hypot(dx, dy) || 1;
    const ux = dx / d, uy = dy / d;
    // leave the label's ellipse (half-width ~44, half-height ~24) before drawing
    const t = 1 / Math.sqrt((ux / 44) ** 2 + (uy / 24) ** 2);
    const sx = lx + ux * t, sy = ly + uy * t;
    const ex = ix - (dx / d) * (art * 0.55), ey = iy - (dy / d) * (art * 0.55);
    const bend = (i % 2 ? 1 : -1) * Math.min(14, d / 5);
    const cx = (sx + ex) / 2 - (dy / d) * bend, cy = (sy + ey) / 2 + (dx / d) * bend;
    const ang = Math.atan2(ey - cy, ex - cx);
    const head = (a: number) => `${ex - 6 * Math.cos(ang + a)} ${ey - 6 * Math.sin(ang + a)}`;
    return `M${sx} ${sy} Q${cx} ${cy} ${ex} ${ey} M${head(0.45)} L${ex} ${ey} L${head(-0.45)}`;
  });

  return (
    <View style={{ width, height: H }}>
      <View style={{ position: 'absolute', bottom: 0, left: (width - bagW) / 2 }}>
        <BagIllustration width={bagW} />
      </View>
      <Svg width={width} height={H} style={{ position: 'absolute' }} pointerEvents="none">
        {arrows.map((d, i) => <Path key={i} d={d} stroke={colors.ink} strokeWidth={0.9} fill="none" strokeLinecap="round" />)}
      </Svg>
      {shown.map((it, i) => {
        const s = SLOTS[i];
        const p = productById(it.productId);
        const d = daysLeft(it), st = status(it);
        const marker = st === 'out' ? 'Out of stock' : st === 'want' ? 'Want' : isFinite(d) ? `${d} days` : '';
        return (
          <React.Fragment key={it.id}>
            <Pressable accessibilityLabel={`${it.label}, ${marker}`} onPress={() => router.push(`/item/${it.id}`)}
              style={{ position: 'absolute', left: s.x * width - art / 2, top: s.y * H - art / 2, width: art, height: art }}>
              <ProductArt shape={p.image} id={p.id} size={art} />
            </Pressable>
            <Pressable onPress={() => router.push(`/item/${it.id}`)} accessibilityElementsHidden
              style={{ position: 'absolute', left: s.lx * width - labelW / 2, top: s.ly * H - 12, width: labelW, alignItems: 'center' }}>
              <Text numberOfLines={1} style={[type.italic, { fontSize: 16, lineHeight: 19 }]}>{it.label}</Text>
              {marker ? <Text style={{ fontFamily: fonts.sansMedium, fontSize: 10, lineHeight: 13, color: st === 'have' ? colors.goldDeep : colors.ink }}>{st === 'low' ? `${d} days left` : marker}</Text> : null}
            </Pressable>
          </React.Fragment>
        );
      })}
    </View>
  );
}
