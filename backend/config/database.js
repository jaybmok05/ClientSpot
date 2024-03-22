import mongoose, { mongo } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const mongoURI = process.env.MONGO_URI;

const connectDataBase = async () => {
    try {
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected : ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error : ${error.message}`);
        process.exit(1);
    }
}

export default connectDataBase;