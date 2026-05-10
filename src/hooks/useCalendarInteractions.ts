import { useState, useCallback } from 'react';
import { CALENDAR_CONFIG } from '../constants/calendar';
import type { CalendarEvent } from '../db/db';
import { useAppContext } from './useAppContext';
import type { DateClickArg } from '@fullcalendar/interaction';
import type { EventClickArg, EventDropArg, EventMountArg } from '@fullcalendar/core';

interface UseCalendarInteractionsProps {
  updateEvent: (id: number, changes: Partial<CalendarEvent>) => Promise<number>;
}

export const useCalendarInteractions = ({
  updateEvent,
}: UseCalendarInteractionsProps) => {
  const { setEditingEventId: setEditableEventId, editingEventId: editableEventId, setModalState } = useAppContext();
  const [clickTimer, setClickTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [dateClickTimer, setDateClickTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleDateClick = useCallback((arg: DateClickArg) => {
    if (editableEventId) {
      setEditableEventId(null);
    }

    if (dateClickTimer) {
      // Double tap detected on timeline
      clearTimeout(dateClickTimer);
      setDateClickTimer(null);
      setModalState({
        isOpen: true,
        type: 'add',
        mode: 'event',
        event: {
          start: arg.date,
          allDay: arg.allDay,
          end: new Date(arg.date.getTime() + CALENDAR_CONFIG.DEFAULT_EVENT_DURATION_MINS * 60 * 1000),
        }
      });
    } else {
      // Single tap (potential) - do nothing
      const timer = setTimeout(() => {
        setDateClickTimer(null);
      }, CALENDAR_CONFIG.DOUBLE_TAP_THRESHOLD_MS);
      setDateClickTimer(timer);
    }
  }, [editableEventId, dateClickTimer, setEditableEventId, setModalState]);

  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    if (editableEventId && editableEventId !== clickInfo.event.id) {
      setEditableEventId(null);
    }

    if (clickTimer) {
      // Double tap detected on card
      clearTimeout(clickTimer);
      setClickTimer(null);
      // Double tap a card to show the Modal/Dialog
      setModalState({
        isOpen: true,
        type: 'edit',
        mode: 'event',
        event: {
          id: parseInt(clickInfo.event.id),
          title: clickInfo.event.title,
          description: clickInfo.event.extendedProps.description,
          start: clickInfo.event.start || undefined,
          end: clickInfo.event.end || undefined,
          allDay: clickInfo.event.allDay,
          color: clickInfo.event.backgroundColor || (clickInfo.event.extendedProps.color as string),
        }
      });
    } else {
      // Single tap (potential) - do nothing
      const timer = setTimeout(() => {
        setClickTimer(null);
      }, CALENDAR_CONFIG.DOUBLE_TAP_THRESHOLD_MS);
      setClickTimer(timer);
    }
  }, [editableEventId, clickTimer, setEditableEventId, setModalState]);

  const handleEventDrop = useCallback(async (dropInfo: EventDropArg) => {
    const { event } = dropInfo;
    await updateEvent(parseInt(event.id), {
      start: event.start!,
      end: event.end!,
      allDay: event.allDay,
    });
  }, [updateEvent]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEventResize = useCallback(async (resizeInfo: any) => {
    const { event } = resizeInfo;
    await updateEvent(parseInt(event.id), {
      start: event.start!,
      end: event.end!,
      allDay: event.allDay,
    });
  }, [updateEvent]);

  const handleEventDidMount = useCallback((info: EventMountArg) => {
    // Long press removed as per requirements
    
    if (editableEventId === info.event.id) {
      info.el.classList.add(
        'ring-4',
        'ring-brand-primary',
        'ring-opacity-50',
        'z-50',
        'scale-[1.02]',
        'transition-transform'
      );
      const resizer = info.el.querySelector('.fc-event-resizer-bottom');
      if (resizer) {
        Object.assign((resizer as HTMLElement).style, {
          height: '32px',
          width: '100%',
          left: '0',
          bottom: '0',
          display: 'block',
          zIndex: '999',
        });
      }
    }
  }, [editableEventId]);

  return {
    editableEventId,
    setEditableEventId,
    handleDateClick,
    handleEventClick,
    handleEventDrop,
    handleEventResize,
    handleEventDidMount,
  };
};
