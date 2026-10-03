import { useMemo, useRef, useState } from 'react';
import { Animated, Linking, Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Plus, Send, ShoppingBag } from 'lucide-react-native';
import { colors, margin, maxWidth, radius } from '../../src/theme/tokens';
import { fonts, type } from '../../src/theme/typography';
import { PillChip, ChipRow, PrimaryButton, OutlineButton, Eyebrow, PhotoTag, Avatar } from '../../src/components/ui';
import { Photo } from '../../src/components/Photo';
import { products } from '../../src/data/products';
import { Post, Product } from '../../src/data/types';
import { useStore } from '../../src/store';

type Card = { kind: 'product'; product: Product; edit: string } | { kind: 'post'; post: Post };

function editFor(p: Product) {
  if (p.tags.includes('joy') && p.price < 25) return 'Little joys under $25';
  if (p.bagTypes.includes('travel') && p.bagFit === 'mini') return 'Travel-size heroes';
  if (p.bagTypes.includes('mom')) return 'Mom-tested';
  if (p.bagTypes.includes('makeup')) return 'Beauty refills';
  return 'New for your bags';
}

const ND = Platform.OS !== 'web';

/** One full-screen page of the feed. */
function FeedPage({ card, height, width }: { card: Card; height: number; width: number }) {
  const insets = useSafeAreaInsets();
  const { toggleWish, addWant, flash, importPost, posts } = useStore();
  const wished = useStore((s) => card.kind === 'product' && s.wishlist.includes(card.product.id));
  const burst = useRef(new Animated.Value(0)).current;
  const lastTap = useRef(0);

  const onPhotoPress = () => {
    const now = Date.now();
    if (card.kind === 'product' && now - lastTap.current < 300) {
      if (!wished) toggleWish(card.product.id);
      burst.setValue(0);
      Animated.sequence([
        Animated.timing(burst, { toValue: 1, duration: 180, useNativeDriver: ND }),
        Animated.timing(burst, { toValue: 0, duration: 420, delay: 250, useNativeDriver: ND }),
      ]).start();
    }
    lastTap.current = now;
  };

  const rail = (icon: React.ReactNode, label: string, onPress: () => void) => (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
      style={({ pressed }) => [{ width: 46, height: 46, borderRadius: 23, backgroundColor: colors.veil, alignItems: 'center', justifyContent: 'center' }, pressed && { transform: [{ scale: 0.92 }] }]}>
      {icon}
    </Pressable>
  );

  if (card.kind === 'post') {
    const post = card.post;
    return (
      <View style={{ height, width }}>
        <Pressable style={{ flex: 1 }} onPress={() => router.push(`/post/${post.id}`)}>
          <Photo id={post.photos[0]} width={1200} label={post.title} fallbackSize={26} style={{ flex: 1 }} />
        </Pressable>
        <View style={{ position: 'absolute', left: 12, right: 12, bottom: 12, backgroundColor: colors.paper, borderRadius: radius.card, padding: 18 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Avatar id={post.author.avatar} name={post.author.name} size={24} />
            <Text style={type.small}>{post.author.name}</Text>
            <Text style={type.smallStone}>· What’s in her bag</Text>
          </View>
          <Text style={[type.h2, { marginTop: 8 }]}>{post.title}</Text>
          <Text style={type.smallStone}>{post.productIds.length} items · {post.helpful} women found this helpful</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
            <PrimaryButton small label="Borrow this list" onPress={() => importPost(post.id)} style={{ flex: 1 }} />
            <OutlineButton small label="See the bag" onPress={() => router.push(`/post/${post.id}`)} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    );
  }

  const p = card.product;
  const inBags = posts.filter((x) => x.productIds.includes(p.id)).length;
  return (
    <View style={{ height, width }}>
      <Pressable style={{ flex: 1 }} onPress={onPhotoPress} accessibilityLabel={`${p.name}. Double tap to save.`}>
        <Photo id={p.photo} width={1200} label={p.name} fallbackSize={26} style={{ flex: 1 }} />
        <Animated.View pointerEvents="none" style={{ position: 'absolute', top: '38%', alignSelf: 'center', opacity: burst, transform: [{ scale: burst.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }}>
          <Heart size={96} strokeWidth={1} color={colors.paper} fill={colors.gold} />
        </Animated.View>
      </Pressable>

      <View style={{ position: 'absolute', right: 12, bottom: 232, gap: 12 }}>
        {rail(<Heart size={20} strokeWidth={1.5} color={colors.ink} fill={wished ? colors.ink : 'transparent'} />, wished ? 'Saved' : 'Save', () => toggleWish(p.id))}
        {rail(<Plus size={22} strokeWidth={1.5} color={colors.ink} />, 'Add to bag', () => addWant(p.id))}
        {rail(<Send size={19} strokeWidth={1.5} color={colors.ink} />, 'Send to a friend', () => flash('Link copied. Send it to a friend.'))}
      </View>

      <View style={{ position: 'absolute', left: 12, right: 12, bottom: 12, backgroundColor: colors.paper, borderRadius: radius.card, padding: 18 }}>
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
          <OutlineButton small label="Shop" onPress={() => Linking.openURL(p.retailerUrl)} style={{ flex: 1 }} />
        </View>
      </View>
    </View>
  );
}

const ASPECTS = [4 / 5, 1, 3 / 4, 5 / 6, 2 / 3, 1];
const EDITS = ['For you', 'Under $25', 'Travel-size', 'Mom-tested', 'Beauty', 'Wishlist'];

export default function Shop() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const w = Math.min(width, maxWidth);
  const [mode, setMode] = useState<'feed' | 'browse'>('feed');
  const [edit, setEdit] = useState('For you');
  const [h, setH] = useState(0);
  const { items, bags, user, posts, wishlist } = useStore();

  const owned = new Set(items.map((i) => i.productId));
  const mine = new Set(bags.map((b) => b.type));
  const allowed = (p: Product) => !p.ingredients.some((x) => user.avoidIngredients.includes(x));

  const feed = useMemo<Card[]>(() => {
    const ranked = products.filter((p) => allowed(p) && !owned.has(p.id))
      .sort((a, b) => Number(b.bagTypes.some((t) => mine.has(t))) - Number(a.bagTypes.some((t) => mine.has(t))));
    const ps = posts.filter((x) => mine.has(x.bagType)).concat(posts.filter((x) => !mine.has(x.bagType)));
    const out: Card[] = [];
    ranked.forEach((p, i) => {
      out.push({ kind: 'product', product: p, edit: editFor(p) });
      if (i % 4 === 2 && ps.length) out.push({ kind: 'post', post: ps.shift()! });
    });
    return out;
  }, [items, bags, posts, user]);

  const browse = products.filter((p) => allowed(p) && (edit === 'Wishlist' ? wishlist.includes(p.id) : !owned.has(p.id)) && (
    edit === 'For you' ? true : edit === 'Under $25' ? p.price < 25 : edit === 'Travel-size' ? p.bagTypes.includes('travel') && p.bagFit !== 'large'
      : edit === 'Mom-tested' ? p.bagTypes.includes('mom') : edit === 'Beauty' ? p.bagTypes.includes('makeup') : true));
  const colW = (w - margin * 2 - 12) / 2;
  const cols: Product[][] = [[], []];
  browse.forEach((p, i) => cols[i % 2].push(p));

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
          {feed.map((c, i) => <FeedPage key={c.kind === 'product' ? c.product.id : c.post.id + i} card={c} height={h} width={w} />)}
        </ScrollView>
      ) : null}
      {toggle}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 64, paddingBottom: 64 }}>
        <View style={{ width: '100%', maxWidth, alignSelf: 'center', paddingHorizontal: margin }}>
          <Text style={type.h1}>Shop</Text>
          <Text style={[type.secondary, { marginBottom: 16 }]}>Refills and little joys, picked for your bags.</Text>
          <ChipRow>{EDITS.map((x) => <PillChip key={x} label={x} active={edit === x} onPress={() => setEdit(x)} />)}</ChipRow>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
            {cols.map((col, c) => (
              <View key={c} style={{ flex: 1, gap: 20 }}>
                {col.map((p, i) => <BrowseTile key={p.id} p={p} width={colW} aspect={ASPECTS[(i * 2 + c) % ASPECTS.length]} />)}
              </View>
            ))}
          </View>
          {!browse.length ? <Text style={[type.secondary, { marginTop: 24 }]}>Tap the heart on anything to keep it here.</Text> : null}
        </View>
      </ScrollView>
      {toggle}
    </View>
  );
}

function BrowseTile({ p, width, aspect }: { p: Product; width: number; aspect: number }) {
  const wish = useStore((s) => s.wishlist.includes(p.id));
  const { toggleWish, addWant } = useStore();
  return (
    <Pressable onPress={() => router.push(`/product/${p.id}`)} style={{ width }} accessibilityLabel={`${p.name}, $${p.price}`}>
      <Photo id={p.photo} width={600} label={p.name} style={{ width, aspectRatio: aspect, borderRadius: radius.photo }}>
        {p.sponsored ? <PhotoTag label="Sponsored" style={{ position: 'absolute', left: 8, top: 8 }} /> : null}
        <View style={{ position: 'absolute', right: 8, bottom: 8, flexDirection: 'row', gap: 6 }}>
          <Pressable accessibilityLabel="Add to bag" hitSlop={6} onPress={() => addWant(p.id)} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.veil, alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={17} strokeWidth={1.5} color={colors.ink} />
          </Pressable>
          <Pressable accessibilityLabel={wish ? 'Saved' : 'Save'} hitSlop={6} onPress={() => toggleWish(p.id)} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.veil, alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={15} strokeWidth={1.5} color={colors.ink} fill={wish ? colors.ink : 'transparent'} />
          </Pressable>
        </View>
      </Photo>
      <Text style={[type.body, { fontSize: 15, lineHeight: 20, marginTop: 8 }]} numberOfLines={2}>{p.name}</Text>
      <Text style={type.smallStone}>{p.brand} · <Text style={type.price}>${p.price}</Text></Text>
    </Pressable>
  );
}
