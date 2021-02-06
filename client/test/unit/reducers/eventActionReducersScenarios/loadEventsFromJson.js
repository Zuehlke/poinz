import {promises as fs} from 'fs';
import path from 'path';

export default async function loadEventsFromJson(eventsJsonFile) {
  const eventRaw = await fs.readFile(
    path.resolve(__dirname, path.join('events', eventsJsonFile)),
    'utf-8'
  );
  const events = JSON.parse(eventRaw);
  const eventNames = () => `[${events.map((e, i) => i + '=>' + e.name).join(', ')}]`;

  // when handling a long list of events in our reducer scenarios, its sometimes helpful to print event names to the console
  console.log(
    `Loaded events for scenarios from "${eventsJsonFile}". ${
      events.length
    } in total. ${eventNames()}`
  );

  let currentEventIndex = 0;

  /**
   *
   * @param {number} n How many events to get
   * @return {object[]} Will always return an array of events with length n. (except if there are no more events in the scenario left)
   */
  const getNextEvents = (n) => {
    if (typeof n === 'undefined') {
      throw new Error('Pass in number of events to return');
    }
    const nextCurrentIndex = currentEventIndex + n;
    const slice = events.slice(currentEventIndex, nextCurrentIndex);
    currentEventIndex = nextCurrentIndex;
    return slice;
  };

  return {
    events,
    getNextEvents,
    getSingleNextEvent: () => getNextEvents(1),
    reset: () => {
      currentEventIndex = 0;
    },
    debug: () => {
      const hasNextEvent = events.length > currentEventIndex + 1;
      console.log(
        `scenario with ${events.length} in total. Next event will be ${
          hasNextEvent ? events[currentEventIndex].name : 'no next event'
        }\n${eventNames()}`
      );
    }
  };
}
