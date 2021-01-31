import {promises as fs} from 'fs';
import path from 'path';

export default async function loadEventsFromJson(relativePathToJsonFile) {
  const eventRaw = await fs.readFile(path.resolve(__dirname, relativePathToJsonFile), 'utf-8');
  const events = JSON.parse(eventRaw);
  // when handling a long list of events in our reducer scenarios, its sometimes helpful to print event names to the console
  // console.log(
  //   `Loaded events for scenarios from "${relativePathToJsonFile}". ${
  //     events.length
  //   } in total. [${events.map((e, i) => i + '=>' + e.name).join(', ')}]`
  // );
  return events;
}
