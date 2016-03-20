import assert from 'assert';
import {secondsToDaysHoursMinutes} from '../../app/services/timeUtil';

describe('timeUtil', () => {

  it('#secondsToDaysHoursMinutes 1 day 1 hour 1 minute', () => {
    const result = secondsToDaysHoursMinutes((60 * 60 * 24 ) + (60 * 60) + 60);
    assert.equal(result, '1 day 1 hour 1 minute');
  });

  it('#secondsToDaysHoursMinutes 2 days 2 hours 2 minutes', () => {
    const result = secondsToDaysHoursMinutes((2 * 60 * 60 * 24 ) + (2 * 60 * 60) + 2 * 60);
    assert.equal(result, '2 days 2 hours 2 minutes');
  });

});
