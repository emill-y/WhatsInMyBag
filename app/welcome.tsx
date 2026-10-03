import { useState } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { Redirect, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, margin, maxWidth, radius } from '../src/theme/tokens';
import { fonts, type } from '../src/theme/typography';
import { PrimaryButton, GoldRule, TextLink, Avatar } from '../src/components/ui';
import { Photo } from '../src/components/Photo';
import { scenes } from '../src/data/photos';
import { demos, demoOrder } from '../src/data/demos';
import { useStore } from '../src/store';
import { enterApp } from '../src/nav';

const BAG_LINE: Record<string, string> = { travel: 'Carry-on and work tote', makeup: 'Makeup bag', mom: 'Diaper bag' };

export default function Welcome() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { signedIn, loadDemo } = useStore();
  const [signIn, setSignIn] = useState(false);
  if (signedIn) return <Redirect href="/home" />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }} showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, maxWidth, width: '100%', alignSelf: 'center', paddingHorizontal: margin, alignItems: 'center', justifyContent: 'center' }}>
          <Photo id={scenes.welcome} width={1200} label="A brown leather handbag" style={{ width: '100%', height: Math.min(440, Math.max(300, height * 0.46)), borderRadius: radius.photo }} />
          <Text accessibilityRole="header" style={[type.display, { fontSize: 52, lineHeight: 58, letterSpacing: 0.5, marginTop: 36, textAlign: 'center' }]}>Chelsea</Text>
          <Text style={[type.italic, { fontSize: 22, lineHeight: 28, color: colors.stone, marginTop: 4, textAlign: 'center' }]}>What’s in my bag</Text>
          <GoldRule style={{ marginVertical: 20 }} />
          <Text style={[type.body, { color: colors.stone, textAlign: 'center', maxWidth: 320 }]}>
            Know what’s in every bag you carry, restock before you run out, and pack like the women who’ve done it before.
          </Text>
          <PrimaryButton label="Get started" style={{ alignSelf: 'stretch', marginTop: 32 }} onPress={() => router.push('/onboarding')} />
          <TextLink label="I already have an account" onPress={() => setSignIn(true)} style={{ color: colors.stone, marginTop: 18 }} />
        </View>
      </ScrollView>

      {signIn ? (
        <Pressable accessibilityLabel="Close" onPress={() => setSignIn(false)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.scrim, justifyContent: 'flex-end' }}>
          <Pressable style={{ backgroundColor: colors.paper, borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingHorizontal: margin, paddingTop: 24, paddingBottom: insets.bottom + 24, width: '100%', maxWidth, alignSelf: 'center' }}>
            <Text style={type.h2}>Welcome back</Text>
            <Text style={[type.secondary, { marginBottom: 12 }]}>Choose your account on this device.</Text>
            {demoOrder.map((id) => {
              const d = demos[id];
              return (
                <Pressable key={id} accessibilityRole="button" accessibilityLabel={`Sign in as ${d.user.name}`}
                  onPress={() => { loadDemo(id); setSignIn(false); enterApp(); }}
                  style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderTopWidth: 1, borderColor: colors.line }, pressed && { opacity: 0.6 }]}>
                  <Avatar name={d.user.name} size={40} />
                  <View style={{ flex: 1 }}>
                    <Text style={type.h3}>{d.user.name}</Text>
                    <Text style={type.smallStone}>{BAG_LINE[id]}</Text>
                  </View>
                  <Text style={{ fontFamily: fonts.sansMedium, fontSize: 13 }}>Sign in</Text>
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      ) : null}
    </View>
  );
}
