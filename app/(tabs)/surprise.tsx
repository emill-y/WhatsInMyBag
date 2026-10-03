import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { colors, radius } from '../../src/theme/tokens';
import { type } from '../../src/theme/typography';
import { Screen, PrimaryButton, TextLink } from '../../src/components/ui';
import { BagIllustration, FlapSvg } from '../../src/components/BagIllustration';
import { ProductArt } from '../../src/components/ProductArt';
import { useStore } from '../../src/store';
import { products, productById } from '../../src/data/products';
import { buildSurprise, isoWeek } from '../../src/logic/surprise';
import { SurpriseCard } from '../../src/data/types';

const KIND: Record<SurpriseCard['kind'], string> = { complement: 'Goes with your bag', routine: 'A look from what you own', joy: 'A little joy', tip: 'Good to know' };
const ND = Platform.OS !== 'web';

export default function Surprise() {
  const { items, user, dismissed, dismiss, save, addWant } = useStore();
  const [cards] = useState(() => buildSurprise(products, items, user, dismissed));
  const [opened, setOpened] = useState(false);
  const [hidden, setHidden] = useState<string[]>([]);
  const flap = useRef(new Animated.Value(0)).current;
  const rise = useRef(cards.map(() => new Animated.Value(0))).current;
  const [reduce, setReduce] = useState(false);
  useEffect(() => { AccessibilityInfo.isReduceMotionEnabled().then(setReduce).catch(() => {}); }, []);

  const open = () => {
    setOpened(true);
    if (reduce) { flap.setValue(1); rise.forEach((v) => v.setValue(1)); return; }
    Animated.sequence([
      Animated.timing(flap, { toValue: 1, duration: 360, easing: Easing.out(Easing.cubic), useNativeDriver: ND }),
      Animated.stagger(180, rise.map((v) => Animated.timing(v, { toValue: 1, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: ND }))),
    ]).start();
  };

  const bagW = 220;
  return (
    <Screen>
      <Text accessibilityRole="header" style={type.h1}>Surprise</Text>
      <Text style={type.secondary}>Week {isoWeek().split('-W')[1]} · refreshed every Friday</Text>

      <View style={{ alignItems: 'center', marginTop: 32 }}>
        <View style={{ width: bagW, height: (bagW * 210) / 300 }}>
          <BagIllustration width={bagW} open={opened} showFlap={false} />
          <Animated.View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0,
            opacity: flap.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
            transform: [{ translateY: flap.interpolate({ inputRange: [0, 1], outputRange: [0, -40] }) }, { scaleY: flap.interpolate({ inputRange: [0, 1], outputRange: [1, 0.6] }) }] }}>
            <FlapSvg width={bagW} />
          </Animated.View>
        </View>
        {!opened ? (
          <>
            <Text style={[type.h2, { textAlign: 'center', marginTop: 24 }]}>Your Friday Surprise is ready</Text>
            <Text style={[type.secondary, { textAlign: 'center', marginTop: 8 }]}>Chosen around what you carry, and what you care about.</Text>
            <PrimaryButton label="Open" onPress={open} style={{ marginTop: 24, minWidth: 180 }} />
          </>
        ) : null}
      </View>

      {opened ? (
        <View style={{ marginTop: 24, gap: 16 }}>
          {cards.map((c, i) => hidden.includes(c.title) ? null : (
            <Animated.View key={c.title} style={{ opacity: rise[i], transform: [{ translateY: rise[i].interpolate({ inputRange: [0, 1], outputRange: [48, 0] }) }] }}>
              <View style={{ backgroundColor: colors.porcelain, borderRadius: radius.card, padding: 20 }}>
                <Text style={[type.small, { color: colors.goldDeep }]}>{KIND[c.kind]}</Text>
                <View style={{ flexDirection: 'row', gap: 16, marginTop: 12, alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    {c.productIds.slice(0, 3).map((pid, k) => (
                      <Pressable key={pid} onPress={() => router.push(`/product/${pid}`)} style={{ marginLeft: k ? -18 : 0 }}>
                        <ProductArt shape={productById(pid).image} id={pid} size={c.productIds.length > 1 ? 52 : 72} />
                      </Pressable>
                    ))}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={type.h3}>{c.title}</Text>
                    <Text style={[type.secondary, { marginTop: 4 }]}>{c.body}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginTop: 16 }}>
                  <TextLink label="Save" onPress={() => save(c.productIds[0])} />
                  {c.kind === 'complement' || c.kind === 'joy' ? <TextLink label="Add to bag as want" onPress={() => addWant(c.productIds[0], undefined, productById(c.productIds[0]).name)} /> : null}
                  <TextLink label={c.kind === 'tip' ? 'See item' : 'Shop'} onPress={() => c.kind === 'tip' ? router.push(`/item/${items.find((x) => x.productId === c.productIds[0])?.id}`) : router.push(`/product/${c.productIds[0]}`)} />
                  <TextLink label="Not for me" style={{ color: colors.stone }} onPress={() => { dismiss(c.productIds[0]); setHidden([...hidden, c.title]); }} />
                </View>
              </View>
            </Animated.View>
          ))}
          <Text style={[type.secondary, { textAlign: 'center', marginTop: 8, fontFamily: 'EBGaramond_400Regular_Italic' }]}>A new bag arrives next Friday.</Text>
        </View>
      ) : null}
    </Screen>
  );
}
