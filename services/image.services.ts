import {
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_UPLOAD_URL,
} from "@/constants/cloudinary";
import { ResponseType } from "@/types";
import axios, { AxiosError } from "axios";
import { ImageSourcePropType } from "react-native";

type ImageFile = string | { uri?: string; url?: string } | null | undefined;

// Allowed image extensions for security
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"];

// Validate file extension from URI
const getFileExtension = (uri: string): string => {
  const match = uri.match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : "";
};

const isAllowedImageType = (uri: string): boolean => {
  const extension = getFileExtension(uri);
  return ALLOWED_EXTENSIONS.includes(extension);
};

export const uploadFileToCloudinary = async (
  file: { uri?: string } | string,
  folderName: string
): Promise<ResponseType> => {
  try {
    const uri = typeof file === "string" ? file : file.uri;

    if (!uri) {
      return { success: false, msg: "No file provided" };
    }

    // Validate file type before upload
    if (!isAllowedImageType(uri)) {
      return {
        success: false,
        msg: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
      };
    }

    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: `${folderName}_${Date.now()}.jpg`,
    } as unknown as Blob);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", folderName);

    const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true, data: response.data.secure_url };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        msg: error.response?.data?.error?.message || "Upload failed",
      };
    }
    const errorMessage =
      error instanceof Error ? error.message : "Failed to upload image";
    return { success: false, msg: errorMessage };
  }
};

export const getProfileImage = (file: ImageFile): ImageSourcePropType => {
  if (file && typeof file === "string") return { uri: file };
  if (file && typeof file === "object") {
    if (file.uri) return { uri: file.uri };
    if (file.url) return { uri: file.url };
  }

  return require("../assets/images/default-avatar.png");
};

export const getFilePath = (file: ImageFile): string | null => {
  if (!file) return null;
  if (typeof file === "string") return file;
  if (file.uri) return file.uri;
  if (file.url) return file.url;
  return null;
};
