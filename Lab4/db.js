import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

export const connectDB = async () => {
    try {
        await client.connect();
        console.log("Успішно підключено до MongoDB!");
        return client.db(process.env.DB_NAME);
    } catch (error) {
        console.error("Помилка підключення до MongoDB:", error);
        process.exit(1);
    }
};

export const getDB = () => client.db(process.env.DB_NAME);