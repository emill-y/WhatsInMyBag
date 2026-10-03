import { Pressable, Text, View, ViewStyle } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/tokens';
import { type } from '../theme/typography';

const back = () => (router.canGoBack() ? router.back() : router.replace('/home'));

export function BackBar({ title, right }: { title?: string; right?: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, minHeight: 32 }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Back" hitSlop={12} onPress={back}>
        <ChevronLeft size={24} strokeWidth={1.25} color={colors.ink} />
      </Pressable>
      <Text style={[type.h3, { flex: 1, textAlign: 'center' }]} numberOfLines={1}>{title ?? ''}</Text>
      <View style={{ minWidth: 24, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

/** Round back button that floats over a full-bleed photo. */
export function FloatingBack({ style }: { style?: ViewStyle }) {
  const insets = useSafeAreaInsets();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={back}
      style={[{ position: 'absolute', top: insets.top + 12, left: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: colors.veil, alignItems: 'center', justifyContent: 'center' }, style]}>
      <ChevronLeft size={22} strokeWidth={1.5} color={colors.ink} />
    </Pressable>
  );
}
