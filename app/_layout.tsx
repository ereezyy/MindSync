import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { SessionProvider } from '@/contexts/SessionContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <SessionProvider>
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </>
    </SessionProvider>
  );
}
