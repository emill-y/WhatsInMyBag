import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Plus } from 'lucide-react-native';
import { colors, margin, maxWidth, radius } from '../../src/theme/tokens';
import { fonts, type } from '../../src/theme/typography';
import { PillChip, ChipRow, PhotoTag, Avatar, OutlineButton, SectionHeader } from '../../src/components/ui';
import { Photo } from '../../src/components/Photo';
import { FeedPage, Card } from '../../src/components/FeedPage';
import { BagType, Post } from '../../src/data/types';
import { useStore } from '../../src/store';

const TYPES: { key: BagType; label: string }[] = [
  { key: 'travel', label: 'Travel' }, { key: 'makeup', label: 'Makeup' }, { key: 'mom', label: 'Mom' }, { key: 'work', label: 'Work' }, { key: 'study', label: 'Study' },
];
const ASPECTS = [4 / 5, 1, 3 / 4, 5 / 6, 2 / 3, 1];

/** Community: people's bags as a full-screen swipe feed, or browsed by type of bag. */
export default function Community() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const w = Math.min(width, maxWidth);
  const [mode, setMode] = useState<'feed' | 'browse'>('feed');
  const [filter, setFilter] = useState<'all' | BagType>('all');
  const [h, setH] = useState(0);
  const { bags, posts } = useStore();
  const mine = new Set(bags.map((b) => b.type));

  const feed = useMemo<Card[]>(() =>
    posts.filter((p) => mine.has(p.bagType)).concat(posts.filter((p) => !mine.has(p.bagType))).map((post) => ({ kind: 'post', post })), [posts, bags]);

  const colW = (w - margin * 2 - 12) / 2;
  const sections = TYPES.filter((t) => filter === 'all' || t.key === filter)
    .map((t) => ({ ...t, posts: posts.filter((p) => p.bagType === t.key) })).filter((s) => s.posts.length);

  const toggle = (
    <View style={{ position: 'absolute', top: insets.top + 10, alignSelf: 'center', flexDirection: 'row', backgroundColor: mode === 'feed' ? colors.veil : colors.porcelain, borderRadius: radius.pill, padding: 3 }}>
      {(['feed', 'browse'] as const).map((m) => (
        <Pressable key={m} accessibilityRole="tab" accessibilityState={{ selected: mode === m }} onPress={() => setMode(m)}
          style={{ paddingHorizontal: 18, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: mode === m ? colors.ink : 'transparent' }}>
          <Text style={{ fontFamily: fonts.sansMedium, fontSize: 13, color: mode === m ? colors.paper : colors.ink }}>{m === 'feed' ? 'For you' : 'Browse'}</Text>
        </Pressable>
      ))}
    </View>
  );

  if (mode === 'feed') return (
    <View style={{ flex: 1, backgroundColor: colors.ink }} onLayout={(e) => setH(e.nativeEvent.layout.height)}>
      {h ? (
        <ScrollView pagingEnabled snapToInterval={h} decelerationRate="fast" showsVerticalScrollIndicator={false} style={{ width: w, alignSelf: 'center' }}>
          {feed.map((c) => <FeedPage key={c.kind === 'post' ? c.post.id : c.product.id} card={c} height={h} width={w} />)}
        </ScrollView>
      ) : null}
      {toggle}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 64, paddingBottom: 64 }}>
        <View style={{ width: '100%', maxWidth, alignSelf: 'center', paddingHorizontal: margin }}>
          <Text style={type.h1}>Community</Text>
          <Text style={[type.secondary, { marginBottom: 12 }]}>Real bags from women like you. Borrow a list, or share yours.</Text>
          <OutlineButton small label="+ Share your bag" onPress={() => router.push('/share')} style={{ alignSelf: 'flex-start', marginBottom: 16 }} />
          <ChipRow>
            <PillChip label="All bags" active={filter === 'all'} onPress={() => setFilter('all')} />
            {TYPES.map((t) => <PillChip key={t.key} label={t.label} active={filter === t.key} onPress={() => setFilter(t.key)} />)}
          </ChipRow>
          {sections.map((s) => {
            const cols: Post[][] = [[], []];
            s.posts.forEach((p, i) => cols[i % 2].push(p));
            return (
              <View key={s.key}>
                <SectionHeader eyebrow={`${s.posts.length} ${s.posts.length === 1 ? 'bag' : 'bags'}`} title={s.label} />
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  {cols.map((col, c) => (
                    <View key={c} style={{ flex: 1, gap: 20 }}>
                      {col.map((post, i) => <BagTile key={post.id} post={post} width={colW} aspect={ASPECTS[(i * 2 + c) % ASPECTS.length]} />)}
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      {toggle}
    </View>
  );
}

function BagTile({ post, width, aspect }: { post: Post; width: number; aspect: number }) {
  const helped = useStore((s) => s.helpful.includes(post.id));
  const { toggleHelpful, importPost } = useStore();
  return (
    <Pressable onPress={() => router.push(`/post/${post.id}`)} style={{ width }} accessibilityLabel={`${post.title} by ${post.author.name}`}>
      <Photo id={post.photos[0]} width={600} label={post.title} style={{ width, aspectRatio: aspect, borderRadius: radius.photo }}>
        <PhotoTag label={`${post.productIds.length} items`} style={{ position: 'absolute', left: 8, top: 8 }} />
        {post.mine ? <PhotoTag label="Yours" tone="gold" style={{ position: 'absolute', left: 8, top: 34 }} /> : null}
        <View style={{ position: 'absolute', right: 8, bottom: 8, flexDirection: 'row', gap: 6 }}>
          <Pressable accessibilityLabel="Add the whole list" hitSlop={6} onPress={() => importPost(post.id)} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.veil, alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={17} strokeWidth={1.5} color={colors.ink} />
          </Pressable>
          <Pressable accessibilityLabel={helped ? 'Marked helpful' : 'This helped me'} hitSlop={6} onPress={() => toggleHelpful(post.id)} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.veil, alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={15} strokeWidth={1.5} color={colors.ink} fill={helped ? colors.ink : 'transparent'} />
          </Pressable>
        </View>
      </Photo>
      <Text style={[type.body, { fontSize: 15, lineHeight: 20, marginTop: 8 }]} numberOfLines={2}>{post.title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
        <Avatar id={post.author.avatar} name={post.author.name} size={18} />
        <Text style={type.smallStone} numberOfLines={1}>{post.author.name} · {post.helpful} helped</Text>
      </View>
    </Pressable>
  );
}
