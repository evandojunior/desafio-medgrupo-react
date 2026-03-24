import { useLocalSearchParams } from 'expo-router';
import { NewClassFeature } from '@/src/features/Class/NewClass';

export default function NewClassScreen() {
  const { id: schoolId } = useLocalSearchParams<{ id: string }>();
  return <NewClassFeature schoolId={schoolId} />;
}
