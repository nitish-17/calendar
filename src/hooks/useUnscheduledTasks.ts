import { db, type UnscheduledTask } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';

export const useUnscheduledTasks = () => {
  const tasks = useLiveQuery(
    () => db.unscheduledTasks.orderBy('order').toArray(),
    []
  ) || [];

  const loading = tasks === undefined;

  const addTask = async (task: Omit<UnscheduledTask, 'id'>) => {
    await db.unscheduledTasks.add(task as UnscheduledTask);
  };

  const updateTask = async (id: number, changes: Partial<UnscheduledTask>) => {
    await db.unscheduledTasks.update(id, changes);
  };

  const deleteTask = async (id: number) => {
    await db.unscheduledTasks.delete(id);
  };

  const reorderTasks = async (newTasks: UnscheduledTask[]) => {
    await db.transaction('rw', db.unscheduledTasks, async () => {
      for (let i = 0; i < newTasks.length; i++) {
        await db.unscheduledTasks.update(newTasks[i].id!, { order: i });
      }
    });
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
  };
};
