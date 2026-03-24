import { useLocalSearchParams } from 'expo-router';
import { SchoolDetailFeature } from '@/src/features/School/SchoolDetail';

export default function SchoolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <SchoolDetailFeature schoolId={id} />;
}
