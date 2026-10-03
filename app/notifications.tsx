import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Bell, CalendarClock } from 'lucide-react-native';
import { colors, radius } from '../src/theme/tokens';
import { type } from '../src/theme/typography';
import { Screen, SectionHeader, PhotoTag, TextLink, PrimaryButton } from '../src/components/ui';
import { BackBar } from '../src/components/BackBar';
import { Photo } from '../src/components/Photo';
import { productById } from '../src/data/products';
import { buildNotifications } from '../src/logic/notify';
import { useStore } from '../src/store';
import { openLink } from '../src/nav';

const KIND_LABEL = { restock: 'Running low', expiry: 'Expiring', out: 'Out', info: 'Update' } as const;

export default function Notifications() {
  const { items, bags, alerts, reminders, showAlert, flash } = useStore();
  const notes = buildNotifications(items, bags, alerts);
  const upcoming = reminders.filter((r) => r.on).slice(0, 4);

  return (
    <Screen>
      <BackBar title="Notifications" />
      {notes.map((n) => {
        const it = items.find((i) => i.id === n.itemId);
        const p = it ? productById(it.productId) : undefined;
        return (
          <Pressable key={n.id} onPress={() => it && router.push(`/item/${it.id}`)}
            style={{ flexDirection: 'row', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderColor: colors.line }}>
            {p ? <Photo id={p.photo} width={200} label={it!.label} fallbackSize={10} style={{ width: 56, height: 56, borderRadius: radius.photo }} />
              : <View style={{ width: 56, height: 56, borderRadius: radius.photo, backgroundColor: colors.porcelain, alignItems: 'center', justifyContent: 'center' }}><Bell size={20} strokeWidth={1.25} color={colors.ink} /></View>}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <PhotoTag label={KIND_LABEL[n.kind]} tone={n.kind === 'out' || n.kind === 'restock' ? 'ink' : 'veil'} style={n.kind === 'info' || n.kind === 'expiry' ? { backgroundColor: colors.porcelain } : undefined} />
                <Text style={type.smallStone}>{n.when}</Text>
              </View>
              <Text style={[type.body, { marginTop: 6, lineHeight: 22 }]}>{n.title}</Text>
              {p && (n.kind === 'restock' || n.kind === 'out') ? (
                <View style={{ flexDirection: 'row', gap: 16, marginTop: 6 }}>
                  <TextLink label={`Reorder at ${p.retailer}`} onPress={() => openLink(p.retailerUrl)} />
                  <TextLink label="Remind me in 3 days" style={{ color: colors.stone }} onPress={() => flash('We’ll remind you in 3 days')} />
                </View>
              ) : null}
            </View>
          </Pressable>
        );
      })}

      <SectionHeader eyebrow="Coming up" title="Reminders" action="Manage" onAction={() => router.push('/profile')} />
      {upcoming.length ? upcoming.map((r) => (
        <View key={r.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderColor: colors.line }}>
          <CalendarClock size={18} strokeWidth={1.25} color={colors.ink} />
          <Text style={[type.body, { flex: 1 }]}>{r.title}</Text>
          <Text style={type.smallStone}>{r.when}</Text>
        </View>
      )) : <Text style={[type.italic, { color: colors.stone }]}>No reminders set.</Text>}

      {notes[0]?.itemId ? <PrimaryButton label="See how a reminder arrives" style={{ marginTop: 32 }} onPress={() => showAlert(notes[0].itemId!)} /> : null}
    </Screen>
  );
}
