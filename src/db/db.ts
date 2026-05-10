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

export interface GuidingPrinciple {
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
  guidingPrinciples!: Table<GuidingPrinciple>;
  unscheduledTasks!: Table<UnscheduledTask>;

  constructor() {
    super('calendar-db');
    this.version(3).stores({
      events: '++id, title, start, end',
      guidingPrinciples: '++id, label',
      unscheduledTasks: '++id, title, order'
    });
  }
}

export const db = new MyDatabase();
