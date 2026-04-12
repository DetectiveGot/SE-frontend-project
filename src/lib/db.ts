import mongoose from "mongoose";

const connectDB = async() => {
    mongoose.set('strictQuery', true);
    const mongoUri = process.env.MONGO_URI;

    console.log("MONGO URI:", process.env.MONGO_URI);

    if(!mongoUri) {
        throw new Error("MONGO_URI is undefined");
    }
    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
}

export { connectDB };