import 'react-native-get-random-values';
import '../global.css';

import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

if (Platform.OS === 'web' && typeof console !== 'undefined') {
  const _warn = console.error.bind(console);
  console.error = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('pointerEvents')) return;
    _warn(...args);
  };
}
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { makeServer } from '@/src/services/mock/server';
import { GluestackUIProvider } from '@/src/components/ui/gluestack-ui-provider';
import '@/global.css';

export default function RootLayout() {
  const [mirageReady, setMirageReady] = useState(false);

  useEffect(() => {
    async function init() {
      if (process.env.NODE_ENV !== 'test') {
        await makeServer();
      }
      setMirageReady(true);
    }
    init();
  }, []);

  if (!mirageReady) return null;

  return (
    <GluestackUIProvider mode="dark">
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#111111' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold', color: '#FFFFFF' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#0F0F0F' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="schools/new"
          options={{
            title: 'Nova Escola',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#111111' },
            headerTintColor: '#FFFFFF',
          }}
        />
        <Stack.Screen name="schools/[id]/index" options={{ title: 'Turmas' }} />
        <Stack.Screen
          name="schools/[id]/edit"
          options={{
            title: 'Editar Escola',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#111111' },
            headerTintColor: '#FFFFFF',
          }}
        />
        <Stack.Screen
          name="schools/[id]/classes/new"
          options={{
            title: 'Nova Turma',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#111111' },
            headerTintColor: '#FFFFFF',
          }}
        />
        <Stack.Screen
          name="schools/[id]/classes/[classId]/edit"
          options={{
            title: 'Editar Turma',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#111111' },
            headerTintColor: '#FFFFFF',
          }}
        />
      </Stack>
    </GluestackUIProvider>
  );
}
