import { Linking, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, maxWidth, radius } from '../theme/tokens';
import { type } from '../theme/typography';
import { useStore } from '../store';
import { productById } from '../data/products';
import { daysLeft } from '../logic/depletion';
import { ProductArt } from './ProductArt';
import { OutlineButton, PrimaryButton } from './ui';

/** In-app sheet styled like a push notification. */
export function AlertSheet() {
  const id = useStore((s) => s.alertItemId);
  const item = useStore((s) => s.items.find((i) => i.id === id));
  const { showAlert, snooze } = useStore();
  const insets = useSafeAreaInsets();
  if (!item) return null;
  const p = productById(item.productId);
  const d = daysLeft(item);
  return (
    <Pressable onPress={() => showAlert(null)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.25)' } as any} accessibilityLabel="Close">
      <Pressable style={{ marginTop: insets.top + 12, marginHorizontal: 12, alignSelf: 'center', width: '94%', maxWidth, backgroundColor: colors.paper, borderRadius: 16, borderWidth: 1, borderColor: colors.line, padding: 16 }}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View style={{ backgroundColor: colors.porcelain, borderRadius: radius.card, padding: 4 }}><ProductArt shape={p.image} id={p.id} size={44} /></View>
          <View style={{ flex: 1 }}>
            <Text style={type.smallStone}>What’s In My Bag · now</Text>
            <Text style={[type.body, { lineHeight: 22 }]}>Your {item.label.toLowerCase()} runs out in about {Math.max(d, 1)} days.</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
          <PrimaryButton label="Reorder" style={{ flex: 1 }} onPress={() => { Linking.openURL(p.retailerUrl); showAlert(null); }} />
          <OutlineButton label="Snooze" style={{ flex: 1 }} onPress={() => snooze(item.id)} />
        </View>
      </Pressable>
    </Pressable>
  );
}
