import { Linking, Platform } from 'react-native';
import { router } from 'expo-router';

/** Enter the app with nothing behind it, so back never lands on the welcome page. */
export function enterApp() {
  if (router.canDismiss()) router.dismissAll();
  router.replace('/home');
}

/** Back within the app; falls back to Home rather than the welcome page. */
export function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/home');
}

/** Open a retailer link in a new tab on web, or the browser on a phone. */
export function openLink(url: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer');
  else Linking.openURL(url);
}
