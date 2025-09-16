export type DowntimeLogs = [Date, Date][];

export function merge(...args: DowntimeLogs[]): DowntimeLogs {
  // Flatten all intervals into one list
  const allIntervals: [Date, Date][] = args.flat();

  if (allIntervals.length === 0) return [];

  // Sort by start time
  allIntervals.sort((a, b) => a[0].getTime() - b[0].getTime());

  const merged: [Date, Date][] = [];
  let [currentStart, currentEnd] = allIntervals[0];

  for (let i = 1; i < allIntervals.length; i++) {
    const [nextStart, nextEnd] = allIntervals[i];

    if (nextStart.getTime() <= currentEnd.getTime()) {
      // Overlap or touch -> extend current interval
      if (nextEnd.getTime() > currentEnd.getTime()) {
        currentEnd = nextEnd;
      }
    } else {
      // No overlap -> push current interval and start a new one
      merged.push([currentStart, currentEnd]);
      currentStart = nextStart;
      currentEnd = nextEnd;
    }
  }

  // Push the last interval
  merged.push([currentStart, currentEnd]);

  return merged;
}