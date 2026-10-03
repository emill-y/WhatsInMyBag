import React, { useRef, useState } from 'react';
import { Animated, Platform, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme/tokens';
import { fonts } from '../theme/typography';
import { photoUrl } from '../data/photos';

/**
 * A real photograph that fades in quietly once loaded. If it can't load, it falls back to
 * a porcelain card with the item's name set in italic serif, so layouts never look broken.
 */
export function Photo({ id, width = 800, style, label, children, fallbackSize = 17 }: {
  id: string; width?: number; style?: StyleProp<ViewStyle>; label?: string; children?: React.ReactNode; fallbackSize?: number;
}) {
  const [failed, setFailed] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  return (
    <View style={[{ overflow: 'hidden', backgroundColor: colors.porcelain }, style]} accessible={!!label} accessibilityRole="image" accessibilityLabel={label}>
      {!failed ? (
        <Animated.Image
          source={{ uri: photoUrl(id, width) }}
          resizeMode="cover"
          onLoad={() => Animated.timing(fade, { toValue: 1, duration: 200, useNativeDriver: Platform.OS !== 'web' }).start()}
          onError={() => setFailed(true)}
          style={[StyleSheet.absoluteFill, { opacity: fade, width: '100%', height: '100%' }]}
        />
      ) : label ? (
        <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center', padding: 12 }]}>
          <View style={{ width: 20, height: 1, backgroundColor: colors.gold, marginBottom: 10 }} />
          <Text numberOfLines={3} style={{ fontFamily: fonts.serifItalic, fontSize: fallbackSize, lineHeight: fallbackSize * 1.25, color: colors.stone, textAlign: 'center' }}>{label}</Text>
        </View>
      ) : null}
      {children}
    </View>
  );
}

