import { db, type UnscheduledTask } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';

export const useRoutine = () => {
  const routines = useLiveQuery(
    () => db.routines.orderBy('order').toArray(),
    []
  ) || [];

  const loading = routines === undefined;

  const addRoutine = async (routine: Omit<UnscheduledTask, 'id'>) => {
    await db.routines.add(routine as UnscheduledTask);
  };

  const updateRoutine = async (id: number, changes: Partial<UnscheduledTask>) => {
    await db.routines.update(id, changes);
  };

  const deleteRoutine = async (id: number) => {
    await db.routines.delete(id);
  };

  const reorderRoutines = async (newRoutines: UnscheduledTask[]) => {
    await db.transaction('rw', db.routines, async () => {
      for (let i = 0; i < newRoutines.length; i++) {
        await db.routines.update(newRoutines[i].id!, { order: i });
      }
    });
  };

  return {
    routines,
    loading,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    reorderRoutines,
  };
};
