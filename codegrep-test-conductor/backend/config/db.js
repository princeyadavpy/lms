const mongoose = require('mongoose');

const connectDB = async () => {
    const primaryUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    const fallbackUri = 'mongodb://127.0.0.1:27017/higenlabs';

    if (primaryUri) {
        try {
            const conn = await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
            return conn;
        } catch (error) {
            console.warn(`⚠️ Primary MongoDB connection failed (${error.message}). Attempting local fallback: ${fallbackUri}`);
        }
    }

    try {
        const conn = await mongoose.connect(fallbackUri);
        console.log(`✅ Local Fallback MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (fallbackError) {
        console.error(`❌ Fatal MongoDB Connection Error: ${fallbackError.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
