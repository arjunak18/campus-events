import { format, parseISO } from 'date-fns';

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'TBA';
  try {
    // If it's already YYYY-MM-DD
    const parsed = parseISO(dateString);
    if (!isNaN(parsed.getTime())) {
      return format(parsed, 'MMM d, yyyy');
    }
    return dateString;
  } catch {
    return dateString;
  }
};

export const formatTime = (timeString?: string): string => {
  if (!timeString) return 'TBA';
  try {
    // If timeString is ISO
    if (timeString.includes('T')) {
      const parsed = parseISO(timeString);
      if (!isNaN(parsed.getTime())) {
        return format(parsed, 'h:mm a');
      }
    }
    // If timeString is "HH:mm" or "HH:mm:ss"
    const parts = timeString.split(':');
    if (parts.length >= 2) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      const d = new Date();
      d.setHours(hours, minutes, 0, 0);
      return format(d, 'h:mm a');
    }
    return timeString;
  } catch {
    return timeString;
  }
};

export const formatFullDateTime = (dateString?: string, timeString?: string): string => {
  const d = formatDate(dateString);
  const t = formatTime(timeString);
  if (t && t !== 'TBA') return `${d} • ${t}`;
  return d;
};