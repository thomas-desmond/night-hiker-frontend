import { AstronomicalEvent } from "@/types/timelineTypes";

export function sortEvents(events: AstronomicalEvent[]): AstronomicalEvent[] {
  return [...events].sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function getEventEmoji(type: AstronomicalEvent['type']): string {
  switch (type) {
    case 'sunset':
      return '🌅';
    case 'moonrise':
      return '🌗';
    case 'moonpeak':
      return '🌕';
    case 'moonset':
      return '🌑';
    default:
      return '•';
  }
}

export function getEventLabel(type: AstronomicalEvent['type']): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

