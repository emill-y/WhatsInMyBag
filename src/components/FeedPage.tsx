import { useRef } from 'react';
import { Animated, Platform, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Heart, Plus, Send } from 'lucide-react-native';
import { colors, radius } from '../theme/tokens';
import { type } from '../theme/typography';
import { PrimaryButton, OutlineButton, Eyebrow, Avatar } from './ui';
import { Photo } from './Photo';
import { Post, Product } from '../data/types';
import { useStore } from '../store';
import { openLink } from '../nav';

export type Card = { kind: 'product'; product: Product; edit: string } | { kind: 'post'; post: Post };

const ND = Platform.OS !== 'web';

function Rail({ children }: { children: React.ReactNode }) {
  return <View style={{ position: 'absolute', right: 12, bottom: 232, gap: 12 }}>{children}</View>;
}
function RailButton({ label, onPress, children }: { label: string; onPress: () => void; children: React.ReactNode }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
      style={({ pressed }) => [{ width: 46, height: 46, borderRadius: 23, backgroundColor: colors.veil, alignItems: 'center', justifyContent: 'center' }, pressed && { transform: [{ scale: 0.92 }] }]}>
      {children}
    </Pressable>
  );
}

/** One full-screen page of a swipe feed: a product, or someone's shared bag. Double tap to save. */
export function FeedPage({ card, height, width }: { card: Card; height: number; width: number }) {
  const { toggleWish, addWant, flash, importPost, toggleHelpful, posts } = useStore();
  const saved = useStore((s) => (card.kind === 'product' ? s.wishlist.includes(card.product.id) : s.helpful.includes(card.post.id)));
  const burst = useRef(new Animated.Value(0)).current;
  const lastTap = useRef(0);

  const save = () => (card.kind === 'product' ? toggleWish(card.product.id) : toggleHelpful(card.post.id));
  const onPhotoPress = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!saved) save();
      burst.setValue(0);
      Animated.sequence([
        Animated.timing(burst, { toValue: 1, duration: 180, useNativeDriver: ND }),
        Animated.timing(burst, { toValue: 0, duration: 420, delay: 250, useNativeDriver: ND }),
      ]).start();
    } else if (card.kind === 'post') {
      setTimeout(() => { if (Date.now() - lastTap.current >= 300) router.push(`/post/${card.post.id}`); }, 320);
    }
    lastTap.current = now;
  };

  const photo = card.kind === 'product' ? card.product.photo : card.post.photos[0];
  const label = card.kind === 'product' ? card.product.name : card.post.title;

  return (
    <View style={{ height, width }}>
      <Pressable style={{ flex: 1 }} onPress={onPhotoPress} accessibilityLabel={`${label}. Double tap to save.`}>
        <Photo id={photo} width={1200} label={label} fallbackSize={26} style={{ flex: 1 }} />
        <Animated.View pointerEvents="none" style={{ position: 'absolute', top: '38%', alignSelf: 'center', opacity: burst, transform: [{ scale: burst.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }}>
          <Heart size={96} strokeWidth={1} color={colors.paper} fill={colors.gold} />
        </Animated.View>
      </Pressable>

      <Rail>
        <RailButton label={saved ? 'Saved' : 'Save'} onPress={save}>
          <Heart size={20} strokeWidth={1.5} color={colors.ink} fill={saved ? colors.ink : 'transparent'} />
        </RailButton>
        <RailButton label={card.kind === 'product' ? 'Add to bag' : 'Add the whole list'} onPress={() => (card.kind === 'product' ? addWant(card.product.id) : importPost(card.post.id))}>
          <Plus size={22} strokeWidth={1.5} color={colors.ink} />
        </RailButton>
        <RailButton label="Send to a friend" onPress={() => flash('Link copied. Send it to a friend.')}>
          <Send size={19} strokeWidth={1.5} color={colors.ink} />
        </RailButton>
      </Rail>

      <View style={{ position: 'absolute', left: 12, right: 12, bottom: 12, backgroundColor: colors.paper, borderRadius: radius.card, padding: 18 }}>
        {card.kind === 'product' ? (() => {
          const p = card.product;
          const inBags = posts.filter((x) => x.productIds.includes(p.id)).length;
          return (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Eyebrow>{card.edit}</Eyebrow>
                {p.sponsored ? <Text style={[type.smallStone, { fontSize: 11 }]}>Sponsored</Text> : null}
              </View>
              <Pressable onPress={() => router.push(`/product/${p.id}`)}>
                <Text style={[type.h2, { marginTop: 4 }]} numberOfLines={2}>{p.name}</Text>
              </Pressable>
              <Text style={type.smallStone}>{p.brand} · <Text style={type.price}>${p.price}</Text>{p.values.length ? ` · ${p.values.slice(0, 2).join(', ')}` : ''}</Text>
              {inBags ? <Text style={[type.italic, { fontSize: 15, color: colors.stone, marginTop: 6 }]}>In {inBags} community {inBags === 1 ? 'bag' : 'bags'} this week.</Text> : null}
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
                <PrimaryButton small label="Add to bag" onPress={() => addWant(p.id)} style={{ flex: 1 }} />
                <OutlineButton small label={`Shop at ${p.retailer}`} onPress={() => openLink(p.retailerUrl)} style={{ flex: 1 }} />
              </View>
            </>
          );
        })() : (() => {
          const post = card.post;
          return (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Avatar id={post.author.avatar} name={post.author.name} size={24} />
                <Text style={type.small}>{post.author.name}</Text>
                <Text style={type.smallStone} numberOfLines={1}>· {post.author.role}</Text>
              </View>
              <Pressable onPress={() => router.push(`/post/${post.id}`)}>
                <Text style={[type.h2, { marginTop: 8 }]} numberOfLines={2}>{post.title}</Text>
              </Pressable>
              <Text style={type.smallStone}>{post.productIds.length} items · {post.helpful} women found this helpful</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
                <PrimaryButton small label="Borrow this list" onPress={() => importPost(post.id)} style={{ flex: 1 }} />
                <OutlineButton small label="See the bag" onPress={() => router.push(`/post/${post.id}`)} style={{ flex: 1 }} />
              </View>
            </>
          );
        })()}
      </View>
    </View>
  );
}
