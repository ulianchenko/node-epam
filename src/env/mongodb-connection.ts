// MongoDB connection credentials

export const DB_USER = ''; // local: 'mongo_user'
export const DB_PASSWORD = ''; // local: 'mongo_user_password'
export const DB_NAME = 'admin'; // local: 'mongo_db'
export const DB_HOST = 'localhost';
export const DB_PORT = 27017;

export const DB_CONNECTION_STRING = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
