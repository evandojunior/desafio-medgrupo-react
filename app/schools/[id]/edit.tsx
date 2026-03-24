import { useLocalSearchParams } from 'expo-router';
import { EditSchoolFeature } from '@/src/features/School/EditSchool';

export default function EditSchoolScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EditSchoolFeature schoolId={id} />;
}
