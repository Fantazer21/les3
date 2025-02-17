import { MongoClient, ServerApiVersion, Collection } from 'mongodb';
import { BlogViewModel, PostViewModel } from '../types';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const DB_NAME = 'it-incubator';
const COLLECTIONS = {
  posts: 'posts',
  blogs: 'blogs',
} as const;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined');
}

const client = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export let collections: {
  posts: Collection<PostViewModel> | null;
  blogs: Collection<BlogViewModel> | null;
} = {
  posts: null,
  blogs: null,
};

export const runDb = async () => {
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    collections.blogs = db.collection<BlogViewModel>(COLLECTIONS.blogs);

    collections.posts = db.collection<PostViewModel>(COLLECTIONS.posts);

    await client.db('admin').command({ ping: 1 });
    console.log('✅ Успешное подключение к MongoDB!');

    const blogs = await collections.blogs.find({}).toArray();

    const posts = await collections.posts.find({}).toArray();
    console.log('📊 Данные из коллекции blogs:', blogs);
    console.log('📊 Данные из коллекции posts:', posts);
  } catch (error) {
    console.error('❌ Ошибка подключения к MongoDB:', error);
    process.exit(1);
  }
};
