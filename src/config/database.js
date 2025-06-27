import mongoose from 'mongoose';

export class DatabaseConnection {
    static async connect() {
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        } catch (error) {
            throw new Error(`Database connection error: ${error.message}`);
        }
    }

    static async disconnect() {
        await mongoose.disconnect();
    }
}