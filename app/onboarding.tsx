import { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { colors, margin, maxWidth, radius } from '../src/theme/tokens';
import { type } from '../src/theme/typography';
import { Screen, PillChip, PrimaryButton, OutlineButton, TextLink, Eyebrow } from '../src/components/ui';
import { Photo } from '../src/components/Photo';
import { bagCover } from '../src/data/photos';
import { BagType } from '../src/data/types';
import { useStore } from '../src/store';

const USE_CASES: { type: BagType; label: string; line: string }[] = [
  { type: 'travel', label: 'Travel and luggage', line: 'Carry-ons, weekenders, trips' },
  { type: 'makeup', label: 'Makeup', line: 'Your pouch and beauty refills' },
  { type: 'mom', label: 'Mom and diaper', line: 'Little ones, snacks, spares' },
  { type: 'work', label: 'Work', line: 'Laptop, coffee, the commute' },
  { type: 'study', label: 'Study', line: 'Books, notes, long library days' },
];

const VALUES = ['Vegan', 'Nut-free', 'Cruelty-free', 'Fragrance-free', 'Clean beauty'];
const field = { borderBottomWidth: 1, borderColor: colors.ink, paddingVertical: 8, outlineStyle: 'none' } as any;

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const cardW = (Math.min(width, maxWidth) - margin * 2 - 12) / 2;
  const setup = useStore((s) => s.setupFromOnboarding);

  const [step, setStep] = useState(0);
  const [types, setTypes] = useState<BagType[]>([]);
  const [name, setName] = useState('');
  // Follow-up answers, only asked when relevant
  const [destination, setDestination] = useState('');
  const [packing, setPacking] = useState('Carry-on only');
  const [skin, setSkin] = useState('');
  const [values, setValues] = useState<string[]>([]);
  const [kidAge, setKidAge] = useState<number | undefined>();
  const [diet, setDiet] = useState<string[]>([]);
  const [officeDays, setOfficeDays] = useState('');
  const [level, setLevel] = useState('');
  const [avoid, setAvoid] = useState('');

  const toggle = <T,>(list: T[], v: T, set: (x: T[]) => void) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  // One short follow-up page per chosen use case.
  const followUps = useMemo(() => USE_CASES.filter((u) => types.includes(u.type)).map((u) => u.type), [types]);
  const total = 2 + followUps.length + 1;

  const finish = (scan: boolean) => {
    setup({
      name, bagTypes: types, values: [...new Set([...values, ...diet])], skinType: skin || undefined, kidAge,
      avoid: avoid.split(',').map((s) => s.trim()).filter(Boolean), destination: destination || undefined,
    });
    router.replace(scan ? '/scan' : '/home');
  };

  const next = () => setStep(step + 1);
  const canNext = step === 0 ? types.length > 0 : true;

  const page = (() => {
    if (step === 0) return (
      <View>
        <Eyebrow>Welcome</Eyebrow>
        <Text style={[type.h1, { marginTop: 4 }]}>What brings you here?</Text>
        <Text style={[type.secondary, { marginTop: 8, marginBottom: 24 }]}>Pick one or more. You can add bags later.</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {USE_CASES.map((u) => {
            const on = types.includes(u.type);
            return (
              <Pressable key={u.type} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={u.label}
                onPress={() => toggle(types, u.type, setTypes)} style={{ width: cardW }}>
                <Photo id={bagCover[u.type]} width={500} label={u.label} style={{ aspectRatio: 1, borderRadius: radius.photo, borderWidth: on ? 2 : 0, borderColor: colors.ink }}>
                  <View style={{ position: 'absolute', top: 10, right: 10, width: 26, height: 26, borderRadius: 13, backgroundColor: on ? colors.ink : colors.veil, alignItems: 'center', justifyContent: 'center' }}>
                    {on ? <Check size={15} strokeWidth={2} color={colors.paper} /> : null}
                  </View>
                </Photo>
                <Text style={[type.h3, { marginTop: 8 }]}>{u.label}</Text>
                <Text style={type.smallStone}>{u.line}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
    if (step === 1) return (
      <View style={{ gap: 16 }}>
        <Text style={type.h1}>What should we call you?</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Your first name" placeholderTextColor={colors.stone} autoFocus style={[type.h2, field]} />
        <Text style={type.secondary}>We’ll use it for reminders, and on anything you share with the community.</Text>
      </View>
    );
    const t = followUps[step - 2];
    if (t) {
      const head = (title: string, sub: string) => (
        <>
          <Photo id={bagCover[t]} width={900} label={title} style={{ height: 160, borderRadius: radius.photo, marginBottom: 24 }} />
          <Eyebrow>{USE_CASES.find((u) => u.type === t)!.label}</Eyebrow>
          <Text style={[type.h1, { marginTop: 4 }]}>{title}</Text>
          <Text style={[type.secondary, { marginTop: 8, marginBottom: 24 }]}>{sub}</Text>
        </>
      );
      const chips = (opts: string[], value: string, set: (v: string) => void) => (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{opts.map((o) => <PillChip key={o} label={o} active={value === o} onPress={() => set(o)} />)}</View>
      );
      if (t === 'travel') return (
        <View>{head('Where to next?', 'We’ll build a packing list and flag what’s hard to find there.')}
          <TextInput value={destination} onChangeText={setDestination} placeholder="Lisbon, Tokyo, the coast…" placeholderTextColor={colors.stone} style={[type.h2, field]} />
          <Text style={[type.secondary, { marginTop: 24, marginBottom: 12 }]}>How do you like to pack?</Text>
          {chips(['Carry-on only', 'One checked bag', 'Whatever fits'], packing, setPacking)}
        </View>
      );
      if (t === 'makeup') return (
        <View>{head('Tell us about your skin', 'So we only suggest things that suit you.')}
          {chips(['Dry', 'Oily', 'Combination', 'Sensitive'], skin, setSkin)}
          <Text style={[type.secondary, { marginTop: 24, marginBottom: 12 }]}>What matters to you?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {VALUES.filter((v) => v !== 'Nut-free').map((v) => <PillChip key={v} label={v} active={values.includes(v)} onPress={() => toggle(values, v, setValues)} />)}
          </View>
          <Text style={[type.secondary, { marginTop: 24 }]}>Ingredients to avoid</Text>
          <TextInput value={avoid} onChangeText={setAvoid} placeholder="e.g. fragrance, retinol" placeholderTextColor={colors.stone} style={[type.body, field, { borderColor: colors.line }]} />
        </View>
      );
      if (t === 'mom') return (
        <View>{head('Tell us about your little one', 'Diaper sizes change fast. We’ll keep up.')}
          <Text style={[type.secondary, { marginBottom: 12 }]}>Age</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {[['Newborn', 0], ['6 months', 0.5], ['1 year', 1], ['2 years', 2], ['3+', 3]].map(([l, a]) => <PillChip key={l as string} label={l as string} active={kidAge === a} onPress={() => setKidAge(a as number)} />)}
          </View>
          <Text style={[type.secondary, { marginTop: 24, marginBottom: 12 }]}>Snacks and care</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {['Nut-free', 'Vegan', 'Fragrance-free'].map((v) => <PillChip key={v} label={v} active={diet.includes(v)} onPress={() => toggle(diet, v, setDiet)} />)}
          </View>
        </View>
      );
      if (t === 'work') return (
        <View>{head('How many office days?', 'We’ll time snack and coffee reminders around them.')}
          {chips(['Every day', 'Three or four', 'One or two', 'Mostly remote'], officeDays, setOfficeDays)}
        </View>
      );
      return (
        <View>{head('Where do you study?', 'So your list fits the long days.')}
          {chips(['High school', 'University', 'Grad school', 'Courses and certificates'], level, setLevel)}
        </View>
      );
    }
    return (
      <View>
        <Eyebrow>Last step</Eyebrow>
        <Text style={[type.h1, { marginTop: 4 }]}>Let’s fill your {types.length > 1 ? 'bags' : 'bag'}.</Text>
        <Text style={[type.secondary, { marginTop: 8, marginBottom: 24 }]}>Snap a photo of everything laid out, or start from the essentials and edit as you go.</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 32 }}>
          {types.map((t) => <Photo key={t} id={bagCover[t]} width={400} label={t} style={{ flex: 1, aspectRatio: 3 / 4, borderRadius: radius.photo }} />)}
        </View>
        <View style={{ gap: 12 }}>
          <PrimaryButton label="Snap your bag" onPress={() => finish(true)} />
          <OutlineButton label="Start with the essentials" onPress={() => finish(false)} />
        </View>
      </View>
    );
  })();

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {Array.from({ length: total }).map((_, i) => <View key={i} style={{ width: 20, height: 2, backgroundColor: i <= step ? colors.gold : colors.line }} />)}
        </View>
        <TextLink label="Skip" onPress={() => finish(false)} style={{ color: colors.stone }} />
      </View>
      {page}
      {step < total - 1 ? (
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 40 }}>
          {step > 0 ? <OutlineButton label="Back" onPress={() => setStep(step - 1)} style={{ flex: 1 }} /> : null}
          <PrimaryButton label={step === 0 && !canNext ? 'Pick at least one' : 'Continue'} onPress={() => canNext && next()} style={{ flex: 2, opacity: canNext ? 1 : 0.4 }} />
        </View>
      ) : <TextLink label="Back" onPress={() => setStep(step - 1)} style={{ color: colors.stone, marginTop: 32 }} />}
    </Screen>
  );
}
