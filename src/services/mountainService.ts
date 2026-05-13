import { db, type Mountain } from '../db/db';

export const MountainService = {
  async getAll(): Promise<Mountain[]> {
    return db.mountains.toArray();
  },

  async add(mountain: Mountain): Promise<number> {
    return db.mountains.add(mountain);
  },

  async update(id: number, changes: Partial<Mountain>): Promise<number> {
    return db.mountains.update(id, changes);
  },

  async delete(id: number): Promise<void> {
    return db.mountains.delete(id);
  }
};
