import { useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { Heart, Plus } from 'lucide-react-native';
import { colors, margin, maxWidth, radius } from '../../src/theme/tokens';
import { type } from '../../src/theme/typography';
import { Screen, PillChip, ChipRow, Avatar, PhotoTag, Eyebrow, PrimaryButton } from '../../src/components/ui';
import { Photo } from '../../src/components/Photo';
import { useStore } from '../../src/store';
import { BagType, Post } from '../../src/data/types';

const FILTERS: { key: 'all' | BagType; label: string }[] = [
  { key: 'all', label: 'All bags' }, { key: 'travel', label: 'Travel' }, { key: 'makeup', label: 'Makeup' },
  { key: 'mom', label: 'Mom' }, { key: 'work', label: 'Work' }, { key: 'study', label: 'Study' },
];
const ASPECTS = [3 / 4, 1, 4 / 5, 2 / 3];

export default function Community() {
  const { width } = useWindowDimensions();
  const w = Math.min(width, maxWidth) - margin * 2;
  const { posts, bags } = useStore();
  const [filter, setFilter] = useState<'all' | BagType>('all');
  const shown = posts.filter((p) => filter === 'all' || p.bagType === filter);
  const colW = (w - 12) / 2;
  const cols: Post[][] = [[], []];
  shown.forEach((p, i) => cols[i % 2].push(p));

  return (
    <Screen>
      <Eyebrow>Women supporting women</Eyebrow>
      <Text accessibilityRole="header" style={[type.display, { marginTop: 4 }]}>What’s in her bag</Text>
      <Text style={[type.secondary, { marginTop: 8 }]}>Real bags from real lives. Borrow a list in one tap, or share yours to help someone pack.</Text>

      <Pressable onPress={() => router.push({ pathname: '/share', params: { bagId: bags[0]?.id } })}
        style={{ marginTop: 20, backgroundColor: colors.porcelain, borderRadius: radius.card, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={20} strokeWidth={1.5} color={colors.paper} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={type.h3}>Share your bag</Text>
          <Text style={type.smallStone}>Your list is ready. Add a photo and a line.</Text>
        </View>
      </Pressable>

      <View style={{ marginTop: 20 }}>
        <ChipRow>{FILTERS.map((f) => <PillChip key={f.key} label={f.label} active={filter === f.key} onPress={() => setFilter(f.key)} />)}</ChipRow>
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
        {cols.map((col, c) => (
          <View key={c} style={{ flex: 1, gap: 24 }}>
            {col.map((post, i) => <PostTile key={post.id} post={post} width={colW} aspect={ASPECTS[(i * 2 + c) % ASPECTS.length]} />)}
          </View>
        ))}
      </View>
      {!shown.length ? (
        <View style={{ alignItems: 'center', marginTop: 32, gap: 16 }}>
          <Text style={[type.italic, { color: colors.stone }]}>No bags here yet. Be the first to share one.</Text>
          <PrimaryButton label="Share your bag" onPress={() => router.push('/share')} />
        </View>
      ) : null}
    </Screen>
  );
}

function PostTile({ post, width, aspect }: { post: Post; width: number; aspect: number }) {
  const helped = useStore((s) => s.helpful.includes(post.id));
  return (
    <Pressable onPress={() => router.push(`/post/${post.id}`)} style={{ width }} accessibilityLabel={`${post.title} by ${post.author.name}`}>
      <Photo id={post.photos[0]} width={700} label={post.title} style={{ width, aspectRatio: aspect, borderRadius: radius.photo }}>
        <PhotoTag label={`${post.productIds.length} items`} style={{ position: 'absolute', left: 8, bottom: 8 }} />
        {post.video ? <PhotoTag label="Video" tone="ink" style={{ position: 'absolute', right: 8, top: 8 }} /> : null}
        {post.mine ? <PhotoTag label="Yours" tone="gold" style={{ position: 'absolute', left: 8, top: 8 }} /> : null}
      </Photo>
      <Text style={[type.body, { fontSize: 16, lineHeight: 21, marginTop: 8 }]} numberOfLines={3}>{post.title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
        <Avatar id={post.author.avatar} name={post.author.name} size={20} />
        <Text style={[type.small, { flex: 1 }]} numberOfLines={1}>{post.author.name}</Text>
        <Heart size={12} strokeWidth={1.5} color={colors.ink} fill={helped ? colors.ink : 'transparent'} />
        <Text style={type.smallStone}>{post.helpful}</Text>
      </View>
    </Pressable>
  );
}
