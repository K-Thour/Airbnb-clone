import { v2 as cloudinary } from "cloudinary";
import envConfigs from "./envConfigs.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const cloudinaryConfig = cloudinary.config({
  cloud_name: envConfigs.CLOUDINARY_CLOUD_NAME,
  api_key: envConfigs.CLOUDINARY_API_KEY,
  api_secret: envConfigs.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "stayEasy",
    allowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],
  },
});

export { cloudinaryConfig, storage };
