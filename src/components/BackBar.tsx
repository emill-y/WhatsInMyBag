import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { colors } from '../theme/tokens';
import { type } from '../theme/typography';

export function BackBar({ title }: { title?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, minHeight: 32 }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Back" hitSlop={12}
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))}>
        <ChevronLeft size={24} strokeWidth={1.25} color={colors.ink} />
      </Pressable>
      {title ? <Text style={[type.h3, { flex: 1, textAlign: 'center', marginRight: 24 }]}>{title}</Text> : null}
    </View>
  );
}
