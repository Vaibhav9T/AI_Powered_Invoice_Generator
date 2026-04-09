import { connect } from 'mongoose';

const connectDB = async () => {
    try {
        await connect(process.env.MONGO_URL, { });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        console.log('Failed to connect to MongoDB');
        process.exit(1);
    }
};

export default connectDB;