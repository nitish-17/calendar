import { useLiveQuery } from 'dexie-react-hooks';
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
