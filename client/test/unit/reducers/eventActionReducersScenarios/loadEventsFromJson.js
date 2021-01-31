import {promises as fs} from 'fs';
import path from 'path';

export default async function loadEventsFromJson(eventsJsonFile) {
  const eventRaw = await fs.readFile(
    path.resolve(__dirname, path.join('events', eventsJsonFile)),
    'utf-8'
  );
  const events = JSON.parse(eventRaw);
  // when handling a long list of events in our reducer scenarios, its sometimes helpful to print event names to the console
  // console.log(
  //   `Loaded events for scenarios from "${eventsJsonFile}". ${
  //     events.length
  //   } in total. [${events.map((e, i) => i + '=>' + e.name).join(', ')}]`
  // );
  return events;
}
