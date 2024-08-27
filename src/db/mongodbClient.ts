import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'pharmasuite';

let client: MongoClient;

export const connectToDatabase = async (): Promise<MongoClient> => {
  if (!client) {
    client = new MongoClient(url, {
      // No need to specify useNewUrlParser or useUnifiedTopology
    });
    await client.connect();
  }
  return client;
};

export const getDb = async () => {
  const client = await connectToDatabase();
  return client.db(dbName);
};
