import { useState } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { Bell, Camera, Share } from 'lucide-react-native';
import { colors, margin, maxWidth, radius } from '../../src/theme/tokens';
import { type } from '../../src/theme/typography';
import { Screen, Wordmark, PillChip, ChipRow, SectionHeader, ProductTile, TextLink, Avatar, PhotoTag, LevelBar, PrimaryButton, Eyebrow } from '../../src/components/ui';
import { Photo } from '../../src/components/Photo';
import { useStore } from '../../src/store';
import { openLink } from '../../src/nav';
import { productById, products } from '../../src/data/products';
import { bagCover, scenes } from '../../src/data/photos';
import { daysLeft, fraction, status } from '../../src/logic/depletion';
import { hardToFind, tripList } from '../../src/data/demos';
import { Item } from '../../src/data/types';

const hello = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; };
const daysUntil = (iso: string) => Math.max(0, Math.round((new Date(iso).getTime() - Date.now()) / 864e5));

function marker(it: Item) {
  const st = status(it), d = daysLeft(it);
  if (st === 'want') return { label: 'Want', tone: 'veil' as const };
  if (st === 'out') return { label: 'Out', tone: 'ink' as const };
  if (st === 'low') return { label: `${d} days left`, tone: 'ink' as const };
  return isFinite(d) ? { label: `${d} days`, tone: 'veil' as const } : null;
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const w = Math.min(width, maxWidth) - margin * 2;
  const { items, bags, activeBagId, setBag, showAlert, user, trip, posts, alerts } = useStore();
  const [all, setAll] = useState(false);
  const bag = bags.find((b) => b.id === activeBagId) ?? bags[0];
  const bagItems = items.filter((i) => i.bagId === bag.id);
  const owned = bagItems.filter((i) => i.status !== 'want');
  const running = items.filter((i) => ['low', 'out'].includes(status(i))).sort((a, b) => daysLeft(a) - daysLeft(b));
  const lowInBag = owned.filter((i) => ['low', 'out'].includes(status(i))).length;
  const ownedIds = new Set(items.map((i) => i.productId));
  const picks = products.filter((p) => p.bagTypes.includes(bag.type) && !ownedIds.has(p.id)).slice(0, 4);
  const community = posts.filter((p) => p.bagType === bag.type).concat(posts.filter((p) => p.bagType !== bag.type)).slice(0, 5);
  const tileW = (w - 12) / 2;
  const shown = all ? bagItems : bagItems.slice(0, 6);

  const tripIds = Object.entries(tripList).filter(([k]) => k !== 'Baby').flatMap(([, v]) => v);
  const travelBagIds = new Set(items.filter((i) => bags.find((b) => b.id === i.bagId)?.type === 'travel' && i.status !== 'want').map((i) => i.productId));
  const packed = tripIds.filter((id) => travelBagIds.has(id)).length;
  const toBuy = trip ? (hardToFind[trip.destination] ?? []).length : 0;
  const tripLine = `${packed} of ${tripIds.length} packed. ${toBuy ? `${toBuy} to buy before you go.` : 'Nothing hard to find there.'}`;
  const subline = trip ? `${trip.destination} in ${daysUntil(trip.start)} days. ${running.length ? `${running.length} things to restock first.` : 'You’re all set.'}`
    : running.length ? `${running.length} things are running low.` : 'Everything you carry is stocked.';

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable accessibilityLabel="Profile" onPress={() => router.push('/profile')}><Avatar id={user.avatar} name={user.name} size={30} /></Pressable>
        <Wordmark size={22} />
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Pressable accessibilityLabel="Scan a bag" onPress={() => router.push('/scan')} hitSlop={8}><Camera size={20} strokeWidth={1.25} color={colors.ink} /></Pressable>
          <Pressable accessibilityLabel="Notifications" onPress={() => router.push('/notifications')} hitSlop={8}>
            <Bell size={20} strokeWidth={1.25} color={colors.ink} />
            {running.length ? <View style={{ position: 'absolute', top: -1, right: -1, width: 7, height: 7, borderRadius: 4, backgroundColor: colors.gold }} /> : null}
          </Pressable>
        </View>
      </View>

      <Text style={[type.h1, { marginTop: 32 }]}>{hello()}, {user.name}.</Text>
      <Text style={[type.secondary, { marginTop: 4 }]}>{subline}</Text>

      <View style={{ marginTop: 20 }}>
        <ChipRow>
          {bags.map((b) => <PillChip key={b.id} label={b.name} active={b.id === bag.id} onPress={() => { setBag(b.id); setAll(false); }} />)}
          <PillChip label="+ Add a bag" onPress={() => router.push({ pathname: '/onboarding', params: { mode: 'add' } })} />
        </ChipRow>
      </View>

      {/* Hero: the bag itself */}
      <Pressable onPress={() => setAll(true)} style={{ marginTop: 20 }} accessibilityLabel={`${bag.name}, ${owned.length} items`}>
        <Photo id={bagCover[bag.type]} width={1200} label={bag.name} style={{ height: w * 1.05, borderRadius: radius.photo }}>
          <Pressable accessibilityLabel="Share this bag" onPress={() => router.push({ pathname: '/share', params: { bagId: bag.id } })}
            style={{ position: 'absolute', top: 12, right: 12, flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: colors.veil, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 7 }}>
            <Share size={14} strokeWidth={1.5} color={colors.ink} />
            <Text style={type.small}>Share</Text>
          </Pressable>
          <View style={{ position: 'absolute', left: 12, right: 12, bottom: 12, backgroundColor: colors.veil, borderRadius: radius.card, padding: 16, flexDirection: 'row', alignItems: 'flex-end' }}>
            <View style={{ flex: 1 }}>
              <Eyebrow>{bag.type === 'mom' ? 'Diaper bag' : bag.type[0].toUpperCase() + bag.type.slice(1)}</Eyebrow>
              <Text style={type.h2}>{bag.name}</Text>
              <Text style={type.smallStone}>{owned.length} items{lowInBag ? ` · ${lowInBag} need attention` : ' · all stocked'}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              {owned.slice(0, 3).map((it, k) => (
                <Photo key={it.id} id={productById(it.productId).photo} width={160} style={{ width: 36, height: 36, borderRadius: 18, marginLeft: k ? -10 : 0, borderWidth: 2, borderColor: colors.paper }} />
              ))}
            </View>
          </View>
        </Photo>
      </Pressable>

      <SectionHeader eyebrow="In your bag" title="Everything, at a glance" action={bagItems.length > 6 ? (all ? 'Show less' : `See all ${bagItems.length}`) : undefined} onAction={() => setAll(!all)} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, rowGap: 20 }}>
        {shown.map((it) => {
          const p = productById(it.productId), m = marker(it), lasts = isFinite(daysLeft(it));
          return (
            <Pressable key={it.id} onPress={() => router.push(`/item/${it.id}`)} style={{ width: tileW }} accessibilityLabel={`${it.label}${m ? ', ' + m.label : ''}`}>
              <Photo id={p.photo} width={600} label={it.label} style={{ aspectRatio: 1, borderRadius: radius.photo }}>
                {m ? <PhotoTag label={m.label} tone={m.tone} style={{ position: 'absolute', left: 8, top: 8 }} /> : null}
              </Photo>
              {lasts && it.status !== 'want' ? <LevelBar fraction={fraction(it)} style={{ marginTop: 8 }} /> : <View style={{ height: 2, marginTop: 8 }} />}
              <Text style={[type.italic, { marginTop: 8 }]}>{it.label}</Text>
              <Text style={type.smallStone} numberOfLines={1}>{p.brand}</Text>
            </Pressable>
          );
        })}
      </View>

      {running.length ? (
        <>
          <SectionHeader eyebrow="Before you run out" title="Running low" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -margin }} contentContainerStyle={{ paddingHorizontal: margin, gap: 12 }}>
            {running.map((it) => {
              const p = productById(it.productId), d = daysLeft(it);
              return (
                <Pressable key={it.id} onPress={() => router.push(`/item/${it.id}`)} style={{ width: 220, backgroundColor: colors.porcelain, borderRadius: radius.card, overflow: 'hidden' }}>
                  <Photo id={p.photo} width={600} label={it.label} style={{ height: 150 }} />
                  <View style={{ padding: 14 }}>
                    <Text style={type.h3}>{it.label}</Text>
                    <Text style={[type.small, { color: d <= 0 ? colors.ink : colors.goldDeep, marginBottom: 12 }]}>{d <= 0 ? 'Out. Three close matches in stock.' : `About ${d} days left`}</Text>
                    <PrimaryButton small label={d <= 0 ? 'See matches' : `Reorder at ${p.retailer}`} onPress={() => (d <= 0 ? router.push(`/item/${it.id}`) : openLink(p.retailerUrl))} />
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </>
      ) : null}

      {trip ? (
        <Pressable onPress={() => router.push('/trip')} style={{ marginTop: 48 }}>
          <Photo id={scenes.passportCoffee} width={1000} label="Trip planner" style={{ height: 200, borderRadius: radius.photo }}>
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, backgroundColor: colors.scrim, padding: 20, justifyContent: 'flex-end' }}>
              <Text style={[type.small, { color: colors.paper }]}>Next trip</Text>
              <Text style={[type.h1, { color: colors.paper }]}>{trip.destination} in {daysUntil(trip.start)} days</Text>
              <Text style={[type.body, { color: colors.paper }]}>{tripLine}</Text>
            </View>
          </Photo>
        </Pressable>
      ) : null}

      <SectionHeader eyebrow="From the community" title="Bags we love" action="See all" onAction={() => router.push('/community')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -margin }} contentContainerStyle={{ paddingHorizontal: margin, gap: 12 }}>
        {community.map((post) => (
          <Pressable key={post.id} onPress={() => router.push(`/post/${post.id}`)} style={{ width: 200 }}>
            <Photo id={post.photos[0]} width={600} label={post.title} style={{ width: 200, aspectRatio: 3 / 4, borderRadius: radius.photo }}>
              <PhotoTag label={`${post.productIds.length} items`} style={{ position: 'absolute', left: 8, bottom: 8 }} />
            </Photo>
            <Text style={[type.body, { marginTop: 8, lineHeight: 22 }]} numberOfLines={2}>{post.title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <Avatar id={post.author.avatar} name={post.author.name} size={18} />
              <Text style={type.smallStone}>{post.author.name}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {picks.length ? (
        <>
          <SectionHeader eyebrow="Picked for you" title={`For your ${bag.name.toLowerCase()}`} action="Shop" onAction={() => router.push('/shop')} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, rowGap: 24 }}>
            {picks.map((p) => <ProductTile key={p.id} product={p} width={tileW} onPress={() => router.push(`/product/${p.id}`)} />)}
          </View>
        </>
      ) : null}

    </Screen>
  );
}
