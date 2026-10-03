import { useState } from 'react';
import { Pressable, Switch, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { colors, radius } from '../../src/theme/tokens';
import { type } from '../../src/theme/typography';
import { Screen, SectionHeader, PillChip, ChipRow, OutlineButton, PrimaryButton, Avatar, Eyebrow, LevelBar } from '../../src/components/ui';
import { Photo } from '../../src/components/Photo';
import { useStore } from '../../src/store';
import { bagCover } from '../../src/data/photos';
import { status } from '../../src/logic/depletion';

const VALUES = ['Vegan', 'Nut-free', 'Cruelty-free', 'Fragrance-free', 'Clean beauty'];
const WHEN = ['Tonight, 20:00', 'Tomorrow, 9:00', 'This weekend', 'Every Sunday, 19:00'];

function Row({ label, value, onPress }: { label: string; value?: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderColor: colors.line }}>
      <Text style={type.body}>{label}</Text>
      {value ? <Text style={type.smallStone}>{value}</Text> : null}
    </Pressable>
  );
}

export default function Profile() {
  const s = useStore();
  const { user, items, bags, reminders, wishlist, posts, setBag, setUser, toggleValue, addReminder, toggleReminder, removeReminder, signOut, flash } = s;
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [rTitle, setRTitle] = useState('');
  const [rBag, setRBag] = useState(bags[0]?.id);
  const [rWhen, setRWhen] = useState(WHEN[1]);
  const toggle = (k: 'push' | 'email' | 'sms') => setUser({ notify: { ...user.notify, [k]: !user.notify[k] } });
  const mine = posts.filter((p) => p.mine);

  return (
    <Screen>
      <View style={{ alignItems: 'center', marginTop: 8 }}>
        <Avatar id={user.avatar} name={user.name} size={88} />
        <Text accessibilityRole="header" style={[type.h1, { marginTop: 12 }]}>{user.name}</Text>
        <Text style={type.secondary}>{user.lifeStage.join(' · ')}</Text>
        <View style={{ flexDirection: 'row', gap: 32, marginTop: 16 }}>
          {[[bags.length, bags.length === 1 ? 'bag' : 'bags'], [items.filter((i) => i.status !== 'want').length, 'items'], [wishlist.length, 'saved'], [mine.length, 'shared']].map(([n, l]) => (
            <View key={l as string} style={{ alignItems: 'center' }}>
              <Text style={type.h2}>{n}</Text>
              <Text style={type.smallStone}>{l}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bag status tracker */}
      <SectionHeader eyebrow="Bag status" title="How ready is each bag?" action="Add a bag" onAction={() => router.push({ pathname: '/onboarding', params: { mode: 'add' } })} />
      {bags.map((b) => {
        const its = items.filter((i) => i.bagId === b.id && i.status !== 'want');
        const sts = its.map(status);
        const low = sts.filter((x) => x === 'low').length, out = sts.filter((x) => x === 'out').length;
        const wants = items.filter((i) => i.bagId === b.id && i.status === 'want').length;
        const ready = its.length ? (its.length - low - out) / its.length : 1;
        return (
          <Pressable key={b.id} onPress={() => { setBag(b.id); router.push('/home'); }} accessibilityLabel={`${b.name}, ${Math.round(ready * 100)} percent ready`}
            style={{ flexDirection: 'row', gap: 14, alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderColor: colors.line }}>
            <Photo id={bagCover[b.type]} width={300} label={b.name} fallbackSize={11} style={{ width: 64, height: 64, borderRadius: radius.photo }} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Text style={type.h3}>{b.name}</Text>
                <Text style={type.price}>{Math.round(ready * 100)}% ready</Text>
              </View>
              <LevelBar fraction={ready} style={{ marginVertical: 8 }} />
              <Text style={type.smallStone}>
                {its.length} items{low ? ` · ${low} low` : ''}{out ? ` · ${out} out` : ''}{wants ? ` · ${wants} to buy` : ''}{!low && !out ? ' · all stocked' : ''}
              </Text>
            </View>
          </Pressable>
        );
      })}

      {/* Reminders */}
      <SectionHeader eyebrow="Reminders" title="We’ll nudge you" action={adding ? 'Close' : 'New reminder'} onAction={() => setAdding(!adding)} />
      {adding ? (
        <View style={{ backgroundColor: colors.porcelain, borderRadius: radius.card, padding: 16, marginBottom: 12, gap: 12 }}>
          <TextInput value={rTitle} onChangeText={setRTitle} placeholder="Pack the passport, buy wipes…" placeholderTextColor={colors.stone}
            style={[type.body, { borderBottomWidth: 1, borderColor: colors.line, paddingVertical: 8, outlineStyle: 'none' } as any]} />
          <ChipRow>{bags.map((b) => <PillChip key={b.id} label={b.name} active={rBag === b.id} onPress={() => setRBag(b.id)} />)}</ChipRow>
          <ChipRow>{WHEN.map((w) => <PillChip key={w} label={w} active={rWhen === w} onPress={() => setRWhen(w)} />)}</ChipRow>
          <PrimaryButton small label="Save reminder" onPress={() => {
            const bag = bags.find((b) => b.id === rBag);
            addReminder({ title: rTitle.trim() || `Check your ${bag?.name.toLowerCase() ?? 'bag'}`, when: rWhen, bagId: rBag });
            setRTitle(''); setAdding(false); flash('Reminder saved');
          }} />
        </View>
      ) : null}
      {reminders.length ? reminders.map((r) => (
        <View key={r.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.line }}>
          <View style={{ flex: 1 }}>
            <Text style={[type.body, !r.on && { color: colors.stone }]}>{r.title}</Text>
            <Text style={type.smallStone}>{r.when}{r.bagId ? ` · ${bags.find((b) => b.id === r.bagId)?.name ?? ''}` : ''}</Text>
          </View>
          <Switch value={r.on} onValueChange={() => toggleReminder(r.id)} trackColor={{ true: colors.ink, false: colors.line }} thumbColor={colors.paper} {...({ activeThumbColor: colors.paper } as any)} accessibilityLabel={`Reminder: ${r.title}`} />
          <Pressable hitSlop={8} accessibilityLabel="Delete reminder" onPress={() => removeReminder(r.id)}><X size={16} strokeWidth={1.25} color={colors.stone} /></Pressable>
        </View>
      )) : <Text style={[type.italic, { color: colors.stone }]}>No reminders yet.</Text>}

      <SectionHeader title="Preferences" action={editing ? 'Done' : 'Edit'} onAction={() => setEditing(!editing)} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        {(editing ? VALUES : user.values).map((v) => <PillChip key={v} label={v} active={user.values.includes(v)} onPress={editing ? () => toggleValue(v) : undefined} />)}
        {!editing && !user.values.length ? <Text style={type.smallStone}>Nothing set yet.</Text> : null}
      </View>
      {user.skinType ? <Row label="Skin type" value={user.skinType} /> : null}
      <Row label="Avoiding" value={user.avoidIngredients.join(', ') || 'Nothing'} />

      <SectionHeader title="Notifications" action="Inbox" onAction={() => router.push('/notifications')} />
      {(['push', 'email', 'sms'] as const).map((k) => (
        <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.line }}>
          <Text style={type.body}>{k === 'sms' ? 'Text messages' : k === 'push' ? 'Push' : 'Email'}</Text>
          <Switch value={user.notify[k]} onValueChange={() => toggle(k)} trackColor={{ true: colors.ink, false: colors.line }} thumbColor={colors.paper} {...({ activeThumbColor: colors.paper } as any)} />
        </View>
      ))}
      <Row label="Quiet hours" value={user.notify.quietHours?.join(' – ')} />

      <SectionHeader title="More" />
      <Row label="Plan a trip" onPress={() => router.push('/trip')} />
      <Row label="Scan a bag" onPress={() => router.push('/scan')} />
      <Row label="Share a bag with the community" onPress={() => router.push('/share')} />
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 32 }}>
        <OutlineButton label="Export data" style={{ flex: 1 }} onPress={() => flash('Export sent to your email')} />
        <OutlineButton label="Sign out" style={{ flex: 1 }} onPress={() => { signOut(); if (router.canDismiss()) router.dismissAll(); router.replace('/welcome'); }} />
      </View>
      <Eyebrow color={colors.stone} style={{ textAlign: 'center', marginTop: 32 }}>Chelsea · Photography from Unsplash</Eyebrow>
    </Screen>
  );
}
