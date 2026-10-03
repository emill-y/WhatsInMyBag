import { Tabs } from 'expo-router';
import { Home, Search, ShoppingBag, Users, User } from 'lucide-react-native';
import { colors } from '../../src/theme/tokens';
import { type } from '../../src/theme/typography';

const icon = (I: typeof Home) => ({ color }: { color: string }) => <I size={22} strokeWidth={1.25} color={color} />;

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.ink,
      tabBarInactiveTintColor: colors.stone,
      tabBarLabelStyle: type.tab,
      tabBarStyle: { backgroundColor: colors.paper, borderTopColor: colors.line, borderTopWidth: 1, elevation: 0 },
      sceneStyle: { backgroundColor: colors.paper },
    }}>
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: icon(Home) }} />
      <Tabs.Screen name="search" options={{ title: 'Search', tabBarIcon: icon(Search) }} />
      <Tabs.Screen name="shop" options={{ title: 'Shop', tabBarIcon: icon(ShoppingBag) }} />
      <Tabs.Screen name="community" options={{ title: 'Community', tabBarIcon: icon(Users) }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon(User) }} />
    </Tabs>
  );
}
