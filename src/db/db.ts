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

export class MyDatabase extends Dexie {
  events!: Table<CalendarEvent>;
  guidingPrinciples!: Table<GuidingPrinciple>;

  constructor() {
    super('calendar-db');
    this.version(2).stores({
      events: '++id, title, start, end',
      guidingPrinciples: '++id, label'
    });
  }
}

export const db = new MyDatabase();
