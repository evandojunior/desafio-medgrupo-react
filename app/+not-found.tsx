import { Link, Stack } from 'expo-router';
import { Box } from '@/src/components/ui/box';
import { VStack } from '@/src/components/ui/vstack';
import { Heading } from '@/src/components/ui/heading';
import { Text } from '@/src/components/ui/text';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Página não encontrada' }} />
      <Box className="flex-1 items-center justify-center p-8 bg-background-50">
        <VStack space="md" className="items-center">
          <Heading size="xl" className="text-typography-900">
            404
          </Heading>
          <Text className="text-typography-500 text-center">
            Esta página não existe.
          </Text>
          <Link href="/stores" className="mt-4">
            <Text className="text-primary-500 font-semibold">Voltar ao início</Text>
          </Link>
        </VStack>
      </Box>
    </>
  );
}
