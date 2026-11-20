import mongoose from 'mongoose';

// MongoDB connection credentials

export const DB_USER = ''; // local: 'mongo_user'
export const DB_PASSWORD = ''; // local: 'mongo_user_password'
export const DB_NAME = 'admin'; // local: 'mongo_db'
export const DB_HOST = 'localhost';
export const DB_PORT = 27017;

export const DB_CONNECTION_STRING = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export const connect = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  await mongoose.connect(DB_CONNECTION_STRING);
};

export const disconnect = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};
