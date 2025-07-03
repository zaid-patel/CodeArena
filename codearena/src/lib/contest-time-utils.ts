import { intervalToDuration, formatDuration } from "date-fns";

export function getContestDuration(startTime: Date, endTime: Date) {
  const interval = intervalToDuration({ start: startTime, end: endTime });
  return formatDuration(interval); // e.g. "2 hours 15 minutes"
}

export function getTimeLeftOrPassed(startTime: Date, endTime: Date) {
  const now = new Date();
  if (now < startTime) {
    return {
      state: "not_started",
      duration: formatDuration(intervalToDuration({ start: now, end: startTime }))
    };
  } else if (now >= startTime && now <= endTime) {
    return {
      state: "running",
      duration: formatDuration(intervalToDuration({ start: now, end: endTime }))
    };
  } else {
    return {
      state: "ended",
      duration: formatDuration(intervalToDuration({ start: endTime, end: now }))
    };
  }
}