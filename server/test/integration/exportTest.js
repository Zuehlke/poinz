import {MongoClient} from 'mongodb';
import util from 'util';
import stream from 'stream';
import fs from 'fs';

const pipeline = util.promisify(stream.pipeline);

test.skip('exports rooms collection', async () => {
  const [client, db] = await connectToDb(process.env.CONNECTION_URI);

  const destinationFileName = `./${Date.now()}-mongodb_export.json`;
  const fileStream = fs.createWriteStream(destinationFileName);
  await writePromised(fileStream, '[', 'utf-8');

  const crsr = await db
    .collection('rooms')
    .find({})
    .transformStream({
      transform: (room) => {
        delete room['_id'];
        return JSON.stringify(room) + ',';
      }
    });

  await pipeline(crsr, fileStream); // also closes fileStream
  await client.close();

  // append closing "]", we have to open a new writeStream
  const fileStreamTwo = fs.createWriteStream(destinationFileName, {flags: 'a'});
  await writePromised(fileStreamTwo, ']', 'utf-8');
});

const writePromised = (stream, chunk, encoding) =>
  new Promise((resolve, reject) =>
    stream.write(chunk, encoding, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  );

async function connectToDb(connectionURI) {
  if (!connectionURI) {
    throw new Error('please provide env variable "CONNECTION_URI"');
  }
  const clientInstance = new MongoClient(connectionURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 4000
  });

  await clientInstance.connect();
  const dbInstance = clientInstance.db();
  await dbInstance.command({ping: 1});

  return [clientInstance, dbInstance];
}
