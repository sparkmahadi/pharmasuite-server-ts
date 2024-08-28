import { MongoClient, Db } from "mongodb";

let uri: string;

if (process.env.ENVIRONMENT === "PRODUCTION") {
  uri = process.env.MONGO_URI as string;
} else {
  uri = 'mongodb://localhost:27017';
}

const dbName = 'pharmasuite';

const client = new MongoClient(uri);

export async function connectToDB(): Promise<Db> {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!!!");
    const db = client.db(dbName);
    return db;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
}

export const db = client.db(dbName);
