import { useState } from 'react';
import { Pressable, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Check } from 'lucide-react-native';
import { colors, margin, maxWidth, radius } from '../src/theme/tokens';
import { type } from '../src/theme/typography';
import { Screen, PillChip, ChipRow, PrimaryButton, Eyebrow, SectionHeader } from '../src/components/ui';
import { BackBar } from '../src/components/BackBar';
import { Photo } from '../src/components/Photo';
import { bagCover } from '../src/data/photos';
import { productById } from '../src/data/products';
import { useStore } from '../src/store';

export default function ShareBag() {
  const params = useLocalSearchParams<{ bagId?: string }>();
  const { width } = useWindowDimensions();
  const w = Math.min(width, maxWidth) - margin * 2;
  const { bags, items, publish } = useStore();
  const [bagId, setBagId] = useState(params.bagId ?? bags[0]?.id);
  const bag = bags.find((b) => b.id === bagId) ?? bags[0];
  const bagItems = items.filter((i) => i.bagId === bag.id && i.status !== 'want');
  const options = [bagCover[bag.type], ...bagItems.map((i) => productById(i.productId).photo)];
  const [picked, setPicked] = useState<string[]>([bagCover[bag.type]]);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const tile = (w - 16) / 3;
  const field = { borderBottomWidth: 1, borderColor: colors.line, paddingVertical: 8, outlineStyle: 'none' } as any;

  return (
    <Screen>
      <BackBar title="Share your bag" />
      <Eyebrow>Which bag?</Eyebrow>
      <View style={{ marginTop: 8 }}>
        <ChipRow>{bags.map((b) => <PillChip key={b.id} label={b.name} active={b.id === bag.id} onPress={() => { setBagId(b.id); setPicked([bagCover[b.type]]); }} />)}</ChipRow>
      </View>

      <SectionHeader eyebrow={`Choose up to three · ${picked.length} chosen`} title="Photos" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {options.map((ph, i) => {
          const on = picked.includes(ph);
          return (
            <Pressable key={ph + i} accessibilityRole="checkbox" accessibilityState={{ checked: on }}
              onPress={() => setPicked(on ? picked.filter((x) => x !== ph) : picked.length < 3 ? [...picked, ph] : picked)}>
              <Photo id={ph} width={400} style={{ width: tile, height: tile, borderRadius: radius.photo, borderWidth: on ? 2 : 0, borderColor: colors.ink }}>
                <View style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: on ? colors.ink : colors.veil, alignItems: 'center', justifyContent: 'center' }}>
                  {on ? <Check size={13} strokeWidth={2} color={colors.paper} /> : null}
                </View>
              </Photo>
            </Pressable>
          );
        })}
      </View>
      <Text style={[type.smallStone, { marginTop: 8 }]}>A short video works too, once uploads arrive in the full app.</Text>

      <SectionHeader title="A few words" />
      <TextInput value={title} onChangeText={setTitle} placeholder={`My ${bag.name.toLowerCase()}`} placeholderTextColor={colors.stone} style={[type.h2, field]} />
      <TextInput value={caption} onChangeText={setCaption} multiline placeholder="What would you tell a friend packing this bag?" placeholderTextColor={colors.stone}
        style={[type.body, field, { minHeight: 72, marginTop: 12 }]} />

      <SectionHeader eyebrow="Shared with your post" title={`${bagItems.length} items`} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {bagItems.map((i) => <PillChip key={i.id} label={i.label} />)}
      </View>

      <PrimaryButton label="Publish" style={{ marginTop: 32 }} onPress={() => { const id = publish({ bagId: bag.id, title, caption, photos: picked }); router.replace(`/post/${id}`); }} />
      <Text style={[type.smallStone, { textAlign: 'center', marginTop: 12 }]}>Only your first name and your list are shared.</Text>
    </Screen>
  );
}
