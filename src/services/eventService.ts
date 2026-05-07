import { db, type CalendarEvent } from '../db/db';

export const EventService = {
  async getAllEvents(): Promise<CalendarEvent[]> {
    return db.events.toArray();
  },

  async addEvent(event: CalendarEvent): Promise<number> {
    return db.events.add(event);
  },

  async updateEvent(id: number, changes: Partial<CalendarEvent>): Promise<number> {
    return db.events.update(id, changes);
  },

  async deleteEvent(id: number): Promise<void> {
    return db.events.delete(id);
  }
};
