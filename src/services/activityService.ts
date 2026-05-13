import { db, type UnscheduledTask } from '../db/db';

export const ActivityService = {
  async getAll(): Promise<UnscheduledTask[]> {
    return db.activities.orderBy('order').toArray();
  },

  async add(activity: UnscheduledTask): Promise<number> {
    return db.activities.add(activity);
  },

  async update(id: number, changes: Partial<UnscheduledTask>): Promise<number> {
    return db.activities.update(id, changes);
  },

  async delete(id: number): Promise<void> {
    return db.activities.delete(id);
  },

  async reorder(newActivities: UnscheduledTask[]): Promise<void> {
    await db.transaction('rw', db.activities, async () => {
      for (let i = 0; i < newActivities.length; i++) {
        await db.activities.update(newActivities[i].id!, { order: i });
      }
    });
  }
};
