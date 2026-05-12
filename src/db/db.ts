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

export interface Mountain {
  id?: number;
  label: string;
  text: string;
}

export interface UnscheduledTask {
  id?: number;
  title: string;
  description?: string;
  duration: number;
  color?: string;
  order: number;
}

export class MyDatabase extends Dexie {
  events!: Table<CalendarEvent>;
  mountains!: Table<Mountain>;
  activities!: Table<UnscheduledTask>;

  constructor() {
    super('calendar-db');
    this.version(5).stores({
      events: '++id, title, start, end',
      mountains: '++id, label',
      activities: '++id, title, order'
    });
  }
}

export const db = new MyDatabase();
