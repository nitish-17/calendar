import { db, type UnscheduledTask } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';

export const useActivity = () => {
  const activities = useLiveQuery(
    () => db.activities.orderBy('order').toArray(),
    []
  ) || [];

  const loading = activities === undefined;

  const addActivity = async (activity: Omit<UnscheduledTask, 'id'>) => {
    await db.activities.add(activity as UnscheduledTask);
  };

  const updateActivity = async (id: number, changes: Partial<UnscheduledTask>) => {
    await db.activities.update(id, changes);
  };

  const deleteActivity = async (id: number) => {
    await db.activities.delete(id);
  };

  const reorderActivities = async (newActivities: UnscheduledTask[]) => {
    await db.transaction('rw', db.activities, async () => {
      for (let i = 0; i < newActivities.length; i++) {
        await db.activities.update(newActivities[i].id!, { order: i });
      }
    });
  };

  return {
    activities,
    loading,
    addActivity,
    updateActivity,
    deleteActivity,
    reorderActivities,
  };
};
