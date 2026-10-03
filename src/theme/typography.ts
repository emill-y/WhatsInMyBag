import { TextStyle } from 'react-native';
import { colors } from './tokens';

export const fonts = {
  serif: 'EBGaramond_400Regular',
  serifMedium: 'EBGaramond_500Medium',
  serifItalic: 'EBGaramond_400Regular_Italic',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
} as const;

const serif = (size: number, extra: TextStyle = {}): TextStyle => ({
  fontFamily: fonts.serif, fontSize: size, lineHeight: Math.round(size * 1.3), color: colors.ink, ...extra,
});

export const type = {
  display: serif(40, { lineHeight: 46, letterSpacing: -0.5 }),
  h1: serif(32, { lineHeight: 38, letterSpacing: -0.3 }),
  h2: serif(24, { lineHeight: 30 }),
  h3: serif(20, { lineHeight: 26 }),
  body: serif(17, { lineHeight: 26 }),
  secondary: serif(15, { lineHeight: 22, color: colors.stone }),
  italic: serif(17, { fontFamily: fonts.serifItalic, lineHeight: 22 }),
  small: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 18, color: colors.ink } as TextStyle,
  smallStone: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 18, color: colors.stone } as TextStyle,
  price: { fontFamily: fonts.sansMedium, fontSize: 13, lineHeight: 18, color: colors.ink } as TextStyle,
  tab: { fontFamily: fonts.sansMedium, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase' } as TextStyle,
};
