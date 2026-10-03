import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, margin, maxWidth } from '../src/theme/tokens';
import { type } from '../src/theme/typography';
import { PrimaryButton, TextLink } from '../src/components/ui';
import { BagIllustration } from '../src/components/BagIllustration';

export default function Welcome() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.paper, paddingTop: insets.top, paddingBottom: insets.bottom + 24, paddingHorizontal: margin }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', maxWidth, width: '100%', alignSelf: 'center' }}>
        <BagIllustration width={180} open={false} />
        <Text accessibilityRole="header" style={[type.display, { textAlign: 'center', marginTop: 40 }]}>What’s In My Bag</Text>
        <View style={{ width: 32, height: 1, backgroundColor: colors.gold, marginVertical: 20 }} />
        <Text style={[type.body, { textAlign: 'center', color: colors.stone, fontFamily: 'EBGaramond_400Regular_Italic' }]}>Everything you carry, handled.</Text>
      </View>
      <View style={{ maxWidth, width: '100%', alignSelf: 'center', gap: 16, alignItems: 'center' }}>
        <PrimaryButton label="Get started" style={{ alignSelf: 'stretch' }} onPress={() => router.push('/onboarding')} />
        <TextLink label="Skip to the demo" onPress={() => router.replace('/home')} style={{ color: colors.stone }} />
      </View>
    </View>
  );
}
