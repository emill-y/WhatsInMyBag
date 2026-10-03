import { Redirect } from 'expo-router';
import { useStore } from '../src/store';

/** The app's entry: signed-in people go straight to their bags. */
export default function Index() {
  const signedIn = useStore((s) => s.signedIn);
  return <Redirect href={signedIn ? '/home' : '/welcome'} />;
}
