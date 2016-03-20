/**
 *
 * @param inSeconds
 */
export function secondsToDaysHoursMinutes(inSeconds) {
  const inMinutes = Math.floor(inSeconds / 60);
  const minutes = inMinutes % 60;
  const inHours = Math.floor(inMinutes / 60);
  const hours = inHours % 24;
  const days = Math.floor(inHours / 24);

  return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
}
