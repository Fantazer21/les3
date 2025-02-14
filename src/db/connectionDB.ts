import { MongoClient, ServerApiVersion } from 'mongodb';

const uri =
    'mongodb+srv://6967221:yGssUyRhCra4EIUF@cluster-lesson3.b6dqe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-lesson3';

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

export const runDb = async () => {
    try {
        await client.connect();
        await client.db('admin').command({ ping: 1 });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        // await client.close();
        process.exit(1);
    }
};

export const logErr = () => {
    console.log('dasdsadsa')
}
