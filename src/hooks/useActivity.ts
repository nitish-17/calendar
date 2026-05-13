import { useLiveQuery } from 'dexie-react-hooks';
import { ActivityService } from '../services/activityService';

export const useActivity = () => {
  const activities = useLiveQuery(() => ActivityService.getAll(), []) || [];

  const loading = activities === undefined;

  return {
    activities,
    loading,
    addActivity: ActivityService.add,
    updateActivity: ActivityService.update,
    deleteActivity: ActivityService.delete,
    reorderActivities: ActivityService.reorder,
  };
};
