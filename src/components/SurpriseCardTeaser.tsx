import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors, radius } from '../theme/tokens';
import { type } from '../theme/typography';
import { BagIllustration } from './BagIllustration';
import { PrimaryButton } from './ui';

export function SurpriseTeaser() {
  return (
    <View style={{ backgroundColor: colors.porcelain, borderRadius: radius.card, padding: 24, alignItems: 'center', gap: 16 }}>
      <BagIllustration width={140} open={false} />
      <Text style={[type.h2, { textAlign: 'center' }]}>Your Friday Surprise is ready</Text>
      <Text style={[type.secondary, { textAlign: 'center' }]}>Four things, chosen around what you already carry.</Text>
      <PrimaryButton label="Open" onPress={() => router.push('/surprise')} style={{ minWidth: 160 }} />
    </View>
  );
}
