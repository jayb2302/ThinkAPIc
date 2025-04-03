import mongoose from "mongoose";
import dotenvFlow from "dotenv-flow";

dotenvFlow.config();

const MONGO_URI = process.env.MONGO_URI_LOCAL || process.env.MONGO_URI || "";

export async function testConnection() {
    try {
        await connectDB();
        await disconnect();
        console.log('✅ Database connection test was successful (connect + disconnect)');
    }
    catch (error) {
        console.log('❌ Error testing database connection. Error: ' + error);
    }
}
// Connect to the database
export async function connectDB() {
    try
    {
        if (!MONGO_URI) {
            throw new Error('❌ DBHOST environment variable is not defined');
        }
        await mongoose.connect(MONGO_URI);

        // ping the server to check if we have a connection
        if (mongoose.connection.db) {
            await mongoose.connection.db.admin().command({ ping: 1});
            console.log(`✅ Connection established (${MONGO_URI.includes('localhost') ? 'Local' : 'Remote'})`);
        }
        else {
            throw new Error('❌ Database connection is not established');
        }

    }
    catch (error) {
        console.log('❌ Error connecting to the database. Error: ' + error);
    }
}

// Disconnect from the database
export async function disconnect() {
    try {
        await mongoose.disconnect();
        console.log('Connection closed');
    }
    catch (error) {
        console.log('Error closing database connection. Error: ' + error);
    }
}