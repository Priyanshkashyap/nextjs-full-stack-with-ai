import mongoose from "mongoose"; // mongoose is used to connect Node.js applications with MongoDB.

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};
// above part before the functions gets exected during import of this file only
async function dbConnect(): Promise<void> { // async functions always return a promise (here it has no type)

  if (connection.isConnected) {
    console.log("Already connected to database"); // cuz nextjs while refreshing can send multiple requests
    return;
  }

  try {

    const db = await mongoose.connect(
      process.env.MONGODB_URI || "",  
      {} // can add additional info here
    );

    connection.isConnected = db.connections[0].readyState; // db ke saath first connection ka current state . eg . 0 means not connected,1 is connected etc.(its in api ->M mongoose docs)

    console.log("DB Connected Successfully");

  } catch (error) {

    console.log("Database connection failed", error);

    process.exit(1);
  }
}

export default dbConnect;