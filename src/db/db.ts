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

export interface Vision {
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
  visions!: Table<Vision>;
  routines!: Table<UnscheduledTask>;

  constructor() {
    super('calendar-db');
    this.version(4).stores({
      events: '++id, title, start, end',
      visions: '++id, label',
      routines: '++id, title, order'
    });
  }
}

export const db = new MyDatabase();
