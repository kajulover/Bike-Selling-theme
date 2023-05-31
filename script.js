const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'bike_selling';

const client = new MongoClient(url, { useUnifiedTopology: true });

client.connect((error) => {
    if (error) {
        console.error('Database connection failed: ' + error);
        return;
    }
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('user_data');

    client.close();
});
