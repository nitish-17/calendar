import Dexie, { type Table } from 'dexie';

export interface CalendarEvent {
  id?: number;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  category?: string;
  color?: string;
  allDay?: boolean;
}

export class MyDatabase extends Dexie {
  events!: Table<CalendarEvent>;

  constructor() {
    super('calendar-db');
    this.version(1).stores({
      events: '++id, title, start, end' // Primary key and indexed props
    });
  }
}

export const db = new MyDatabase();
