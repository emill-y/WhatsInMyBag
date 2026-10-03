import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../src/theme/tokens';
import { fonts, type } from '../src/theme/typography';
import { Screen, PillChip, PrimaryButton, OutlineButton, TextLink } from '../src/components/ui';
import { useStore } from '../src/store';

const STAGES = ['Working', 'Mom', 'Expecting', 'Traveler'];
const BAGS = ['Makeup', 'Diaper', 'Travel', 'Everyday'];
const VALUES = ['Vegan', 'Nut-free', 'Cruelty-free', 'Fragrance-free', 'Clean beauty'];
const SKIN = ['Dry', 'Oily', 'Combination', 'Sensitive'];

export default function Onboarding() {
  const { user, setUser, setBag } = useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(user.name);
  const [stages, setStages] = useState<string[]>(user.lifeStage);
  const [bag, setBagName] = useState('Makeup');
  const [values, setValues] = useState<string[]>(user.values);
  const [skin, setSkin] = useState(user.skinType ?? '');
  const [avoid, setAvoid] = useState(user.avoidIngredients.join(', '));
  const toggle = (list: string[], v: string, set: (x: string[]) => void) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const finish = (path: '/home' | '/scan') => {
    setUser({ name: name || 'Sofia', lifeStage: stages, values, skinType: skin, avoidIngredients: avoid.split(',').map((s) => s.trim()).filter(Boolean) });
    setBag(`b-${bag.toLowerCase()}`);
    router.replace(path);
  };

  const steps = [
    <View key="0" style={{ gap: 24 }}>
      <Text style={type.h1}>What should we call you?</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Your first name" placeholderTextColor={colors.stone}
        style={[type.h2, { borderBottomWidth: 1, borderColor: colors.ink, paddingVertical: 8, outlineStyle: 'none' } as any]} />
      <Text style={type.secondary}>Where are you in life right now?</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {STAGES.map((s) => <PillChip key={s} label={s} active={stages.includes(s)} onPress={() => toggle(stages, s, setStages)} />)}
      </View>
    </View>,
    <View key="1" style={{ gap: 24 }}>
      <Text style={type.h1}>What matters to you?</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {VALUES.map((s) => <PillChip key={s} label={s} active={values.includes(s)} onPress={() => toggle(values, s, setValues)} />)}
      </View>
      <Text style={type.secondary}>Skin type</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {SKIN.map((s) => <PillChip key={s} label={s} active={skin === s} onPress={() => setSkin(s)} />)}
      </View>
      <Text style={type.secondary}>Ingredients to avoid</Text>
      <TextInput value={avoid} onChangeText={setAvoid} placeholder="e.g. almond, fragrance" placeholderTextColor={colors.stone}
        style={[type.body, { borderBottomWidth: 1, borderColor: colors.line, paddingVertical: 8, outlineStyle: 'none' } as any]} />
    </View>,
    <View key="2" style={{ gap: 24 }}>
      <Text style={type.h1}>Start with one bag.</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {BAGS.map((s) => <PillChip key={s} label={s} active={bag === s} onPress={() => setBagName(s)} />)}
      </View>
      <Text style={type.secondary}>How would you like to fill it?</Text>
      <PrimaryButton label="Snap your bag" onPress={() => finish('/scan')} />
      <OutlineButton label="Answer a few questions" onPress={() => finish('/home')} />
    </View>,
  ];

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {steps.map((_, i) => <View key={i} style={{ width: 24, height: 2, backgroundColor: i <= step ? colors.gold : colors.line }} />)}
        </View>
        <TextLink label="Skip" onPress={() => finish('/home')} style={{ color: colors.stone }} />
      </View>
      {steps[step]}
      {step < 2 ? (
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 48 }}>
          {step > 0 ? <OutlineButton label="Back" onPress={() => setStep(step - 1)} style={{ flex: 1 }} /> : null}
          <PrimaryButton label="Continue" onPress={() => setStep(step + 1)} style={{ flex: 2 }} />
        </View>
      ) : <TextLink label="Back" onPress={() => setStep(1)} style={{ color: colors.stone, marginTop: 32, fontFamily: fonts.sans }} />}
    </Screen>
  );
}
