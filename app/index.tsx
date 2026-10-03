import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, margin, maxWidth, radius } from '../src/theme/tokens';
import { type } from '../src/theme/typography';
import { PrimaryButton, GoldRule, Eyebrow } from '../src/components/ui';
import { Photo } from '../src/components/Photo';
import { scenes } from '../src/data/photos';
import { demos, demoOrder } from '../src/data/demos';
import { useStore } from '../src/store';

export default function Welcome() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const loadDemo = useStore((s) => s.loadDemo);
  const w = Math.min(width, maxWidth);
  const cardW = (w - margin * 2 - 16) / 3;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.paper }} contentContainerStyle={{ paddingBottom: insets.bottom + 32 }} showsVerticalScrollIndicator={false}>
      <View style={{ maxWidth, width: '100%', alignSelf: 'center' }}>
        <Photo id={scenes.welcome} width={1200} label="A handbag, a book and morning coffee" style={{ height: Math.max(320, height * 0.5) }} />
        <View style={{ paddingHorizontal: margin, alignItems: 'center', marginTop: -36 }}>
          <View style={{ backgroundColor: colors.paper, paddingHorizontal: 24, paddingTop: 20, borderTopLeftRadius: radius.card, borderTopRightRadius: radius.card, alignItems: 'center' }}>
            <Text accessibilityRole="header" style={[type.display, { textAlign: 'center' }]}>What’s In My Bag</Text>
          </View>
          <GoldRule style={{ marginVertical: 16 }} />
          <Text style={[type.italic, { fontSize: 20, color: colors.stone, textAlign: 'center' }]}>Everything you carry, handled.</Text>
          <Text style={[type.secondary, { textAlign: 'center', marginTop: 12, maxWidth: 320 }]}>
            Know what’s in every bag, restock before you run out, and borrow lists from women who’ve packed it before.
          </Text>
          <PrimaryButton label="Get started" style={{ alignSelf: 'stretch', marginTop: 28 }} onPress={() => router.push('/onboarding')} />
        </View>

        <View style={{ paddingHorizontal: margin, marginTop: 40 }}>
          <Eyebrow>Or take a look around</Eyebrow>
          <Text style={[type.h2, { marginTop: 2, marginBottom: 16 }]}>Explore a demo</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {demoOrder.map((id) => {
              const d = demos[id];
              return (
                <Pressable key={id} accessibilityRole="button" accessibilityLabel={`${d.label} demo`} style={{ width: cardW }}
                  onPress={() => { loadDemo(id); router.replace('/home'); }}>
                  <Photo id={d.cover} width={500} label={d.label} style={{ width: cardW, aspectRatio: 3 / 4, borderRadius: radius.photo }} />
                  <Text style={[type.h3, { marginTop: 8 }]}>{d.label}</Text>
                  <Text style={[type.smallStone, { fontSize: 12 }]} numberOfLines={2}>{d.tagline}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
