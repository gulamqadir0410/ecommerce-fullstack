import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,

  // Database
  MONGODB_URI: process.env.MONGODB_URI,

  // Clerk (backend only)
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,

  // Inngest
  INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,

  // Cloudinary
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,

  //Authenticated mail for Admin login
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
};
