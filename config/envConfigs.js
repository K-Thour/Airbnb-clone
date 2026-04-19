import { config } from "dotenv";

config();

const envConfigs = {
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URL: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/airbnb",
  PORT: process.env.PORT || 3000,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "your-cloud-name",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "your-api-key",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "your-api-secret",
  MAP_TOKEN: process.env.MAP_TOKEN || "",
  SESSION_SECRET: process.env.SESSION_SECRET || "your-session-secret",
};

export default envConfigs;
