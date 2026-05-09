import { useMemo } from 'react';
import type { CalendarEvent } from '../db/db';
import { COLORS } from '../constants/calendar';
import type { EventInput } from '@fullcalendar/core';

export const useCalendarEvents = (events: CalendarEvent[] | undefined, editableEventId: string | null) => {
  const calendarEvents = useMemo(() => {
    return events?.map((e): EventInput => ({
      id: e.id?.toString(),
      title: e.title,
      start: e.start,
      end: e.end,
      allDay: e.allDay,
      backgroundColor: e.color || COLORS.PRIMARY,
      borderColor: 'transparent',
      startEditable: editableEventId === e.id?.toString(),
      durationEditable: editableEventId === e.id?.toString(),
      extendedProps: {
        description: e.description,
        color: e.color || COLORS.PRIMARY
      }
    })) || [];
  }, [events, editableEventId]);

  return calendarEvents;
};
