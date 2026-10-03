import React from 'react';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';
import { colors } from '../theme/tokens';

/** Original structured leather tote. Black leather, gold hardware, no logos. viewBox 300x210 */
export function BagIllustration({ width, open = true, showFlap = true }: { width: number; open?: boolean; showFlap?: boolean }) {
  const h = (width * 210) / 300;
  return (
    <Svg width={width} height={h} viewBox="0 0 300 210" accessibilityLabel={open ? 'Your open bag' : 'A closed bag'}>
      {/* back handle */}
      <Path d="M112 58 C112 4, 188 4, 188 58" stroke={colors.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
      <Path d="M112 58 C112 4, 188 4, 188 58" stroke={colors.gold} strokeWidth={0.75} fill="none" strokeDasharray="2 3" />
      {/* interior / back wall */}
      {open ? <Path d="M34 62 Q150 36 266 62 Q150 82 34 62 Z" fill={colors.stone} /> : null}
      {/* body */}
      <Path d="M34 62 Q150 82 266 62 L252 202 Q150 208 48 202 Z" fill={colors.ink} />
      {/* gussets & seams */}
      <Path d="M58 72 L66 200 M242 72 L234 200" stroke={colors.stone} strokeWidth={0.75} />
      <Path d="M40 70 Q150 90 260 70" stroke={colors.gold} strokeWidth={0.75} fill="none" strokeDasharray="2 3" />
      <Path d="M48 194 Q150 200 252 194" stroke={colors.stone} strokeWidth={0.75} fill="none" />
      {/* rim */}
      <Path d="M34 62 Q150 82 266 62" stroke={colors.gold} strokeWidth={1.25} fill="none" />
      {/* front handle */}
      <Path d="M96 70 C96 0, 204 0, 204 70" stroke={colors.ink} strokeWidth={7} fill="none" strokeLinecap="round" />
      {/* gold hardware: rings + feet + plaque */}
      {[96, 204].map((x) => (
        <React.Fragment key={x}>
          <Circle cx={x} cy={72} r={6} stroke={colors.gold} strokeWidth={2} fill="none" />
          <Rect x={x - 5} y={77} width={10} height={14} rx={1.5} fill={colors.ink} stroke={colors.gold} strokeWidth={0.75} />
        </React.Fragment>
      ))}
      <Rect x={136} y={110} width={28} height={8} rx={1} fill={colors.gold} />
      {[70, 120, 180, 230].map((x) => <Circle key={x} cx={x} cy={204} r={2.5} fill={colors.gold} />)}
      {!open && showFlap ? <Flap /> : null}
    </Svg>
  );
}

export function Flap() {
  return (
    <>
      <Path d="M30 60 Q150 40 270 60 L262 122 Q150 150 38 122 Z" fill={colors.ink} stroke={colors.gold} strokeWidth={0.75} />
      <Path d="M44 116 Q150 142 256 116" stroke={colors.gold} strokeWidth={0.75} fill="none" strokeDasharray="2 3" />
      <Rect x={140} y={128} width={20} height={14} rx={2} fill={colors.gold} />
      <Line x1={150} y1={131} x2={150} y2={139} stroke={colors.ink} strokeWidth={1} />
    </>
  );
}

/** Flap alone, for the opening animation overlay. */
export function FlapSvg({ width }: { width: number }) {
  return (
    <Svg width={width} height={(width * 210) / 300} viewBox="0 0 300 210"><Flap /></Svg>
  );
}
