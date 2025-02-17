import { MongoClient, ServerApiVersion } from 'mongodb';

const MONGO_URI =
  'mongodb+srv://6967221:yGssUyRhCra4EIUF@cluster-lesson3.b6dqe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-lesson3';

const DB_NAME = 'sample_airbnb';
const COLLECTIONS = {
  listingsAndReviews: 'listingsAndReviews',
} as const;

const client = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export let collections: {
  listingsAndReviews: any;
} = {
  listingsAndReviews: null,
};

export const runDb = async () => {
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    collections.listingsAndReviews = db.collection<any>(COLLECTIONS.listingsAndReviews);

    await client.db('admin').command({ ping: 1 });

    console.log('✅ Успешное подключение к MongoDB!');

    const data = await collections.listingsAndReviews.find().limit(10).toArray();
    console.log('📊 Данные из коллекции listingsAndReviews:', data);
  } catch (error) {
    console.error('❌ Ошибка подключения к MongoDB:', error);
    process.exit(1);
  }
};
