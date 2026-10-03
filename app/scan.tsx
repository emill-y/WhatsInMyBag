import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors, radius } from '../src/theme/tokens';
import { type } from '../src/theme/typography';
import { Screen, PrimaryButton, PillChip, TextLink, SectionHeader } from '../src/components/ui';
import { BackBar } from '../src/components/BackBar';
import { ProductArt } from '../src/components/ProductArt';
import { BagIllustration } from '../src/components/BagIllustration';
import { productById } from '../src/data/products';
import { useStore } from '../src/store';

// Canned scan result (Milestone 1: no vision API)
const DETECTED = [
  { id: 'p-lipoil', label: 'Lip oil', confidence: 0.96 },
  { id: 'p-mascara', label: 'Mascara', confidence: 0.93 },
  { id: 'p-blush', label: 'Blush stick', confidence: 0.88 },
  { id: 'p-spf', label: 'SPF compact', confidence: 0.61 },
  { id: 'p-perfume', label: 'Mini perfume', confidence: 0.55 },
];
const FREQ = ['Daily', 'A few times a week', 'Occasionally'];

export default function Scan() {
  const flash = useStore((s) => s.flash);
  const [stage, setStage] = useState<'camera' | 'review' | 'questions'>('camera');
  const [list, setList] = useState(DETECTED);
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const [freq, setFreq] = useState<Record<string, string>>({});

  if (stage === 'camera') return (
    <Screen>
      <BackBar title="Snap your bag" />
      <View style={{ backgroundColor: colors.porcelain, borderRadius: radius.card, aspectRatio: 3 / 4, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ position: 'absolute', inset: 24, borderWidth: 1, borderColor: colors.gold } as any} />
        <BagIllustration width={220} />
        <Text style={[type.secondary, { marginTop: 16 }]}>Tip everything out and lay it flat.</Text>
      </View>
      <PrimaryButton label="Scan" style={{ marginTop: 24 }} onPress={() => setStage('review')} />
      <Text style={[type.smallStone, { textAlign: 'center', marginTop: 12 }]}>Demo uses a sample photo.</Text>
    </Screen>
  );

  if (stage === 'review') return (
    <Screen>
      <BackBar title="We found 5 things" />
      {list.map((d) => {
        const p = productById(d.id), low = d.confidence < 0.7, ok = confirmed.includes(d.id);
        return (
          <View key={d.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: colors.line }}>
            <View style={{ backgroundColor: colors.porcelain, borderRadius: radius.card }}><ProductArt shape={p.image} id={p.id} size={56} /></View>
            <View style={{ flex: 1 }}>
              <Text style={type.body}>{d.label}</Text>
              <Text style={[type.small, { color: low ? colors.goldDeep : colors.stone }]}>{low ? 'Check this one' : p.brand}</Text>
            </View>
            <View style={{ gap: 6, alignItems: 'flex-end' }}>
              <TextLink label={ok ? 'Confirmed' : 'Confirm'} onPress={() => setConfirmed([...confirmed, d.id])} style={ok ? { textDecorationLine: 'none', color: colors.stone } : undefined} />
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TextLink label="Edit" onPress={() => flash('Editing comes with real scanning')} style={{ color: colors.stone }} />
                <TextLink label="Remove" onPress={() => setList(list.filter((x) => x.id !== d.id))} style={{ color: colors.stone }} />
              </View>
            </View>
          </View>
        );
      })}
      <PrimaryButton label="Continue" style={{ marginTop: 32 }} onPress={() => setStage('questions')} />
    </Screen>
  );

  return (
    <Screen>
      <BackBar title="A few quick questions" />
      {list.slice(0, 3).map((d) => (
        <View key={d.id}>
          <SectionHeader title={`How often do you use your ${d.label.toLowerCase()}?`} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {FREQ.map((f) => <PillChip key={f} label={f} active={freq[d.id] === f} onPress={() => setFreq({ ...freq, [d.id]: f })} />)}
          </View>
        </View>
      ))}
      <PrimaryButton label="Add to bag" style={{ marginTop: 40 }} onPress={() => { flash('Your makeup bag is up to date'); router.replace('/home'); }} />
    </Screen>
  );
}
