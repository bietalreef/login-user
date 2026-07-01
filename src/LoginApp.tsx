import { AuthScreen } from './components/auth/AuthScreen';

export default function LoginApp({ onComplete }: { onComplete: () => void }) {
  return (
    <main>
      <AuthScreen onComplete={onComplete} />
    </main>
  );
}