import { Pressable, Text, View } from 'react-native';
import { openLink } from '../nav';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, maxWidth, radius } from '../theme/tokens';
import { type } from '../theme/typography';
import { useStore } from '../store';
import { productById } from '../data/products';
import { daysLeft } from '../logic/depletion';
import { Photo } from './Photo';
import { OutlineButton, PrimaryButton } from './ui';

/** In-app sheet styled like a push notification. */
export function AlertSheet() {
  const id = useStore((s) => s.alertItemId);
  const item = useStore((s) => s.items.find((i) => i.id === id));
  const { showAlert, flash } = useStore();
  const insets = useSafeAreaInsets();
  if (!item) return null;
  const p = productById(item.productId);
  const d = daysLeft(item);
  return (
    <Pressable onPress={() => showAlert(null)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.scrim }} accessibilityLabel="Close">
      <Pressable style={{ marginTop: insets.top + 12, alignSelf: 'center', width: '94%', maxWidth, backgroundColor: colors.paper, borderRadius: 18, padding: 16 }}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Photo id={p.photo} width={200} label={item.label} fallbackSize={11} style={{ width: 52, height: 52, borderRadius: radius.card }} />
          <View style={{ flex: 1 }}>
            <Text style={type.smallStone}>Chelsea · now</Text>
            <Text style={[type.body, { lineHeight: 22 }]}>Your {item.label.toLowerCase()} runs out in about {Math.max(d, 1)} days.</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
          <PrimaryButton label="Reorder" style={{ flex: 1 }} onPress={() => { openLink(p.retailerUrl); showAlert(null); }} />
          <OutlineButton label="Snooze" style={{ flex: 1 }} onPress={() => { showAlert(null); flash('We’ll remind you in 3 days'); }} />
        </View>
      </Pressable>
    </Pressable>
  );
}
