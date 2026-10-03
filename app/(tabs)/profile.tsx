import { Pressable, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors, radius } from '../../src/theme/tokens';
import { type } from '../../src/theme/typography';
import { Screen, SectionHeader, PillChip, OutlineButton, TextLink, Avatar, Eyebrow } from '../../src/components/ui';
import { Photo } from '../../src/components/Photo';
import { useStore } from '../../src/store';
import { demos, demoOrder } from '../../src/data/demos';
import { productById } from '../../src/data/products';

function Row({ label, value, onPress }: { label: string; value?: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderColor: colors.line }}>
      <Text style={type.body}>{label}</Text>
      {value ? <Text style={type.smallStone}>{value}</Text> : null}
    </Pressable>
  );
}

export default function Profile() {
  const { user, setUser, alerts, items, showAlert, flash, demo, loadDemo, posts, wishlist } = useStore();
  const toggle = (k: 'push' | 'email' | 'sms') => setUser({ notify: { ...user.notify, [k]: !user.notify[k] } });
  const mine = posts.filter((p) => p.mine);
  return (
    <Screen>
      <View style={{ alignItems: 'center', marginTop: 8 }}>
        <Avatar id={user.avatar} name={user.name} size={88} />
        <Text accessibilityRole="header" style={[type.h1, { marginTop: 12 }]}>{user.name}</Text>
        <Text style={type.secondary}>{user.lifeStage.join(' · ')}</Text>
        <View style={{ flexDirection: 'row', gap: 32, marginTop: 16 }}>
          {[[items.filter((i) => i.status !== 'want').length, 'items'], [wishlist.length, 'saved'], [mine.length, 'shared']].map(([n, l]) => (
            <View key={l as string} style={{ alignItems: 'center' }}>
              <Text style={type.h2}>{n}</Text>
              <Text style={type.smallStone}>{l}</Text>
            </View>
          ))}
        </View>
      </View>

      <SectionHeader eyebrow="Your inbox" title="Alerts" />
      {alerts.length ? alerts.map((a) => {
        const it = items.find((i) => i.id === a.itemId);
        return (
          <Pressable key={a.id} onPress={() => router.push(`/item/${a.itemId}`)} style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: colors.line, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            {it ? <Photo id={productById(it.productId).photo} width={200} style={{ width: 44, height: 44, borderRadius: radius.photo }} /> : null}
            <View style={{ flex: 1 }}>
              <Text style={[type.body, { lineHeight: 22 }]}>{a.title}</Text>
              <Text style={type.smallStone}>{a.when}</Text>
            </View>
          </Pressable>
        );
      }) : <Text style={[type.italic, { color: colors.stone }]}>Nothing yet. We’ll tell you before anything runs out.</Text>}
      {alerts[0] ? <View style={{ marginTop: 16, alignItems: 'flex-start' }}><TextLink label="Preview a restock alert" onPress={() => showAlert(alerts[0].itemId)} /></View> : null}

      <SectionHeader eyebrow="Try another life" title="Demos" />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {demoOrder.map((id) => (
          <Pressable key={id} style={{ flex: 1 }} onPress={() => { loadDemo(id); flash(`${demos[id].label} demo loaded`); router.push('/home'); }}>
            <Photo id={demos[id].cover} width={400} label={demos[id].label} style={{ aspectRatio: 1, borderRadius: radius.photo, borderWidth: demo === id ? 2 : 0, borderColor: colors.ink }} />
            <Text style={[type.small, { marginTop: 6, textAlign: 'center' }]}>{demos[id].label}</Text>
          </Pressable>
        ))}
      </View>

      <SectionHeader title="Preferences" action="Edit" onAction={() => router.push('/onboarding')} />
      {user.values.length ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>{user.values.map((v) => <PillChip key={v} label={v} active />)}</View> : null}
      {user.skinType ? <Row label="Skin type" value={user.skinType} /> : null}
      <Row label="Avoiding" value={user.avoidIngredients.join(', ') || 'Nothing'} />

      <SectionHeader title="Notifications" />
      {(['push', 'email', 'sms'] as const).map((k) => (
        <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.line }}>
          <Text style={type.body}>{k === 'sms' ? 'Text messages' : k === 'push' ? 'Push' : 'Email'}</Text>
          <Switch value={user.notify[k]} onValueChange={() => toggle(k)} trackColor={{ true: colors.ink, false: colors.line }} thumbColor={colors.paper}
            {...({ activeThumbColor: colors.paper } as any)} />
        </View>
      ))}
      <Row label="Quiet hours" value={user.notify.quietHours?.join(' – ')} />

      <SectionHeader title="More" />
      <Row label="Plan a trip" onPress={() => router.push('/trip')} />
      <Row label="Scan a bag" onPress={() => router.push('/scan')} />
      <Row label="Share a bag with the community" onPress={() => router.push('/share')} />
      <Row label="Start over" onPress={() => router.replace('/')} />
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 32 }}>
        <OutlineButton label="Export data" style={{ flex: 1 }} onPress={() => flash('Export sent to your email')} />
        <OutlineButton label="Delete account" style={{ flex: 1 }} onPress={() => flash('Demo only. Nothing was deleted.')} />
      </View>
      <Eyebrow color={colors.stone} style={{ textAlign: 'center', marginTop: 32 }}>Photography from Unsplash</Eyebrow>
    </Screen>
  );
}
