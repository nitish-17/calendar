import { db, type UnscheduledTask } from '../db/db';
import { EventService } from './eventService';

export const SchedulingService = {
  async autoSchedule(activities: UnscheduledTask[]): Promise<void> {
    if (activities.length === 0) return;

    await db.transaction('rw', db.events, async () => {
      const now = new Date();
      // 15m precision
      const startOfNextSlot = new Date(now);
      const minutes = startOfNextSlot.getMinutes();
      const nextSlotMinutes = Math.ceil((minutes + 1) / 15) * 15;
      startOfNextSlot.setMinutes(nextSlotMinutes, 0, 0);

      let currentTime = startOfNextSlot.getTime();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);

      for (const activity of activities) {
        const startTime = new Date(currentTime);
        const endTime = new Date(currentTime + activity.duration * 60 * 1000);

        if (endTime.getTime() <= endOfDay.getTime()) {
          await EventService.addEvent({
            title: activity.title,
            description: activity.description,
            start: startTime,
            end: endTime,
            color: activity.color,
          });
          // Update currentTime for next activity: end of current + 15m gap
          currentTime = endTime.getTime() + 15 * 60 * 1000;
        } else {
          console.warn(`Activity "${activity.title}" skipped: falls outside current day.`);
        }
      }
    });
  }
};
