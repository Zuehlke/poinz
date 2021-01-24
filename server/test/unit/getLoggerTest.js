import getLogger from '../../src/getLogger';
import Transport from 'winston-transport';

test('must not log passwords', () => {
  // a custom winston transport that just stores all logged messages in an array
  class FishingWinstonTransport extends Transport {
    constructor() {
      super();
      this.allFishedLogMessages = [];
    }

    log(info, callback) {
      this.allFishedLogMessages.push(info[Symbol.for('message')]);
      callback();
    }

    getAllMessagesJoined() {
      return this.allFishedLogMessages.join('\n');
    }
  }

  const LOGGER = getLogger('TEST-PW-LOGGING');
  const fishingTransport = new FishingWinstonTransport();
  LOGGER.add(fishingTransport);

  const objWithPwProperty = {
    thisProp: 'some stuff',
    and: ['some', 'more'],
    yes: true,
    password: 'first-password',
    nested: {
      password: 'another-password',
      deepNestedArray: [
        {
          password: 'the-third-one'
        }
      ]
    }
  };

  LOGGER.info('this is a test log message', objWithPwProperty);

  const allLoggedMessagesJoined = fishingTransport.getAllMessagesJoined();
  expect(allLoggedMessagesJoined.includes('first-password')).toBe(false);
  expect(allLoggedMessagesJoined.includes('another-password')).toBe(false);
  expect(allLoggedMessagesJoined.includes('the-third-one')).toBe(false);
});
