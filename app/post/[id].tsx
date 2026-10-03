import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { colors, maxWidth, radius } from '../../src/theme/tokens';
import { type } from '../../src/theme/typography';
import { Screen, PrimaryButton, OutlineButton, SectionHeader, Avatar, Bleed, Eyebrow, TextLink, Hairline } from '../../src/components/ui';
import { FloatingBack } from '../../src/components/BackBar';
import { Photo } from '../../src/components/Photo';
import { photoUrl } from '../../src/data/photos';
import { productById } from '../../src/data/products';
import { useStore } from '../../src/store';
import { BAG_NAMES } from '../../src/store';

/** Short clip on web via the native video element; native apps fall back to the cover photo for now. */
function Clip({ src, poster, height }: { src: string; poster: string; height: number }) {
  if (Platform.OS !== 'web') return <Photo id={poster} width={1200} style={{ height }} />;
  return React.createElement('video', { src, poster: photoUrl(poster, 1200), autoPlay: true, muted: true, loop: true, playsInline: true, controls: false, style: { width: '100%', height, objectFit: 'cover', display: 'block' } });
}

export default function PostPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const w = Math.min(width, maxWidth);
  const post = useStore((s) => s.posts.find((p) => p.id === id));
  const helped = useStore((s) => s.helpful.includes(id));
  const { importPost, addWant, toggleHelpful, addNote, items, bags, flash } = useStore();
  const [page, setPage] = useState(0);
  const [note, setNote] = useState('');
  if (!post) return <Screen><Text style={type.body}>This bag is no longer shared.</Text></Screen>;

  const target = bags.find((b) => b.type === post.bagType);
  const targetName = (target?.name ?? BAG_NAMES[post.bagType]).toLowerCase();
  const have = new Set(items.filter((i) => i.bagId === target?.id).map((i) => i.productId));
  const missing = post.productIds.filter((p) => !have.has(p)).length;
  const h = w * 1.2;
  const slides = post.video ? ['__video', ...post.photos] : post.photos;

  return (
    <View style={{ flex: 1 }}>
      <Screen top={false}>
        <Bleed>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={{ width: w }}
            onScroll={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / w))} scrollEventThrottle={32}>
            {slides.map((s, i) => s === '__video'
              ? <View key="v" style={{ width: w, height: h }}><Clip src={post.video!} poster={post.photos[0]} height={h} /></View>
              : <Photo key={s + i} id={s} width={1200} label={post.title} fallbackSize={24} style={{ width: w, height: h }} />)}
          </ScrollView>
          {slides.length > 1 ? (
            <View style={{ position: 'absolute', bottom: 14, alignSelf: 'center', flexDirection: 'row', gap: 6, backgroundColor: colors.veil, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }}>
              {slides.map((_, i) => <View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: i === page ? colors.ink : colors.line }} />)}
            </View>
          ) : null}
        </Bleed>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20 }}>
          <Avatar id={post.author.avatar} name={post.author.name} size={40} />
          <View style={{ flex: 1 }}>
            <Text style={type.h3}>{post.author.name}</Text>
            <Text style={type.smallStone}>{post.author.role} · {post.when}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="This helped me" onPress={() => toggleHelpful(post.id)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: helped ? colors.ink : colors.line, backgroundColor: helped ? colors.ink : colors.paper, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 }}>
            <Heart size={14} strokeWidth={1.5} color={helped ? colors.paper : colors.ink} fill={helped ? colors.paper : 'transparent'} />
            <Text style={[type.small, { color: helped ? colors.paper : colors.ink }]}>{post.helpful}</Text>
          </Pressable>
        </View>

        <Text style={[type.h1, { marginTop: 20 }]}>{post.title}</Text>
        <Text style={[type.body, { marginTop: 8 }]}>{post.caption}</Text>

        <View style={{ backgroundColor: colors.porcelain, borderRadius: radius.card, padding: 20, marginTop: 24 }}>
          <Text style={type.h3}>{missing ? `Add ${missing === post.productIds.length ? 'all ' : ''}${missing} to your ${targetName}` : `You have all of these`}</Text>
          <Text style={[type.smallStone, { marginTop: 2, marginBottom: 14 }]}>{missing ? 'They’ll arrive as wants, so you can shop or tick them off.' : 'Nicely packed.'}</Text>
          {missing ? <PrimaryButton label="Add the whole list" onPress={() => importPost(post.id)} /> : <OutlineButton label="Open my bag" onPress={() => router.navigate('/home')} />}
        </View>

        <SectionHeader eyebrow={`${post.productIds.length} items`} title="In her bag" />
        {post.productIds.map((pid) => {
          const p = productById(pid);
          const got = have.has(pid);
          return (
            <Pressable key={pid} onPress={() => router.push(`/product/${pid}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderTopWidth: 1, borderColor: colors.line }}>
              <Photo id={p.photo} width={300} label={p.name} fallbackSize={11} style={{ width: 64, height: 64, borderRadius: radius.photo }} />
              <View style={{ flex: 1 }}>
                <Text style={type.body} numberOfLines={2}>{p.name}</Text>
                <Text style={type.smallStone}>{p.brand} · <Text style={type.price}>${p.price}</Text></Text>
              </View>
              {got ? <Text style={type.smallStone}>In your bag</Text> : <TextLink label="Add" onPress={() => addWant(pid, target?.id)} />}
            </Pressable>
          );
        })}
        <Hairline />

        <SectionHeader eyebrow="Kind words" title="Notes" />
        {post.notes.length ? post.notes.map((n, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
            <Avatar name={n.name} size={28} />
            <View style={{ flex: 1 }}>
              <Text style={type.small}>{n.name}</Text>
              <Text style={type.body}>{n.text}</Text>
            </View>
          </View>
        )) : <Text style={[type.italic, { color: colors.stone, marginBottom: 16 }]}>Be the first to say thank you.</Text>}
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <TextInput value={note} onChangeText={setNote} placeholder="Say something kind" placeholderTextColor={colors.stone}
            style={[type.body, { flex: 1, borderWidth: 1, borderColor: colors.line, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10, outlineStyle: 'none' } as any]} />
          <PrimaryButton small label="Post" onPress={() => { if (note.trim()) { addNote(post.id, note.trim()); setNote(''); flash('Thank you for the kindness'); } }} />
        </View>
        <Eyebrow color={colors.stone} style={{ marginTop: 12 }}>Our community is for lifting each other up. Keep it warm.</Eyebrow>
      </Screen>
      <FloatingBack />
    </View>
  );
}
