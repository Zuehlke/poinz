import {MongoClient} from 'mongodb';

const CONNECTION_URI = 'mongodb://localhost:27017/poinz_migration_test';

let dbInstance;
let clientInstance;
let roomsCollection;

/**
 *
 * @return {Promise<*>}
 */
export default async function initDb() {
  if (roomsCollection && dbInstance && clientInstance && clientInstance.isConnected) {
    return [dbInstance, roomsCollection];
  }

  clientInstance = new MongoClient(CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 4000
  });

  try {
    await clientInstance.connect();
    dbInstance = clientInstance.db();

    roomsCollection = await dbInstance.collection('rooms');
    await roomsCollection.deleteMany({});

    return [dbInstance, roomsCollection];
  } catch (error) {
    throw new Error('Could not connect ' + CONNECTION_URI);
  }
}

afterEach(async () => {
  if (clientInstance && dbInstance) {
    await dbInstance.collection('rooms').deleteMany({});
  }
});

afterAll(async () => {
  if (clientInstance && dbInstance) {
    await dbInstance.collection('rooms').deleteMany({});
  }
  if (clientInstance) {
    clientInstance.close();
  }
});
