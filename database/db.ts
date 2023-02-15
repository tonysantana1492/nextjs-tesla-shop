import mongoose from "mongoose";

/**
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 */
const mongooConnection = {
  isConnected: 0,
};

mongoose.set('strictQuery', true);

export const connect = async () => {
  if (mongooConnection.isConnected) return;

  if (mongoose.connections.length > 0) {
    mongooConnection.isConnected = mongoose.connections[0].readyState;

    if (mongooConnection.isConnected === 1) return;

    await mongoose.disconnect();
  }

  await mongoose.connect(process.env.MONGO_URL || '');
  mongooConnection.isConnected = 1;
  console.log('MongoDB connected:', process.env.MONGO_URL);
  
};

export const disconnect = async () => {
  return;
 
  // if(process.env.NODE_ENV === 'development') return;

  // if (mongooConnection.isConnected === 0) return;

  // await mongoose.disconnect();
  // console.log('MongoDB disconnect:', process.env.MONGO_URL);
};
