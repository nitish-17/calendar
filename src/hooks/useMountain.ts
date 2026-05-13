import { useLiveQuery } from 'dexie-react-hooks';
import { MountainService } from '../services/mountainService';

export const useMountain = () => {
  const mountains = useLiveQuery(() => MountainService.getAll(), []) || [];

  const loading = mountains === undefined;

  return {
    mountains,
    loading,
    addMountain: MountainService.add,
    updateMountain: MountainService.update,
    deleteMountain: MountainService.delete,
  };
};
