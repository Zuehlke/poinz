import {secondsToDaysHoursMinutes} from '../../app/services/timeUtil';

test('#secondsToDaysHoursMinutes 1 day 1 hour 1 minute', () => {
  const result = secondsToDaysHoursMinutes(60 * 60 * 24 + 60 * 60 + 60);
  expect(result).toEqual('1 day 1 hour 1 minute');
});

test('#secondsToDaysHoursMinutes 2 days 2 hours 2 minutes', () => {
  const result = secondsToDaysHoursMinutes(2 * 60 * 60 * 24 + 2 * 60 * 60 + 2 * 60);
  expect(result).toEqual('2 days 2 hours 2 minutes');
});
