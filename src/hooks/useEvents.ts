import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { EventService } from '../services/eventService';

export const useEvents = () => {
  const events = useLiveQuery(() => EventService.getAllEvents());

  return {
    events,
    addEvent: EventService.addEvent,
    updateEvent: EventService.updateEvent,
    deleteEvent: EventService.deleteEvent,
  };
};
