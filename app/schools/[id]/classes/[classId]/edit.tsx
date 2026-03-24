import { useLocalSearchParams } from 'expo-router';
import { EditClassFeature } from '@/src/features/Class/EditClass';

export default function EditClassScreen() {
  const { id: schoolId, classId } = useLocalSearchParams<{ id: string; classId: string }>();
  return <EditClassFeature schoolId={schoolId} classId={classId} />;
}
