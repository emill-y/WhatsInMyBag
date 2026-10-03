import { Pressable, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../src/theme/tokens';
import { type } from '../../src/theme/typography';
import { Screen, SectionHeader, PillChip, Hairline, OutlineButton, TextLink } from '../../src/components/ui';
import { useStore } from '../../src/store';

function Row({ label, value, onPress }: { label: string; value?: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderColor: colors.line }}>
      <Text style={type.body}>{label}</Text>
      {value ? <Text style={type.smallStone}>{value}</Text> : null}
    </Pressable>
  );
}

export default function Profile() {
  const { user, setUser, alerts, showAlert, flash } = useStore();
  const toggle = (k: 'push' | 'email' | 'sms') => setUser({ notify: { ...user.notify, [k]: !user.notify[k] } });
  return (
    <Screen>
      <Text accessibilityRole="header" style={type.h1}>{user.name}</Text>
      <Text style={type.secondary}>{user.lifeStage.join(' · ')} · one little one, 14 months</Text>

      <SectionHeader title="Alerts" />
      {alerts.map((a) => (
        <Pressable key={a.id} onPress={() => router.push(`/item/${a.itemId}`)} style={{ paddingVertical: 14, borderBottomWidth: 1, borderColor: colors.line, flexDirection: 'row', gap: 12 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold, marginTop: 9 }} />
          <View style={{ flex: 1 }}>
            <Text style={type.body}>{a.title}</Text>
            <Text style={type.smallStone}>{a.when}</Text>
          </View>
        </Pressable>
      ))}
      <View style={{ marginTop: 16, alignItems: 'flex-start' }}><TextLink label="Preview a restock alert" onPress={() => showAlert('i-lipoil')} /></View>

      <SectionHeader title="Preferences" action="Edit" onAction={() => router.push('/onboarding')} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {user.values.map((v) => <PillChip key={v} label={v} active />)}
      </View>
      <Row label="Skin type" value={user.skinType} />
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
      <Row label="Plan a trip" value="Lisbon" onPress={() => router.push('/trip')} />
      <Row label="Scan a bag" onPress={() => router.push('/scan')} />
      <Row label="Start over" onPress={() => router.replace('/')} />
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 32 }}>
        <OutlineButton label="Export data" style={{ flex: 1 }} onPress={() => flash('Export sent to your email')} />
        <OutlineButton label="Delete account" style={{ flex: 1 }} onPress={() => flash('Demo only. Nothing was deleted.')} />
      </View>
      <Hairline style={{ marginTop: 32 }} />
    </Screen>
  );
}
