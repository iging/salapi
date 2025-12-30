import {
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_UPLOAD_URL,
} from "@/constants/cloudinary";
import { ResponseType } from "@/types";
import axios, { AxiosError } from "axios";
import { ImageSourcePropType } from "react-native";

type ImageFile = string | { uri?: string; url?: string } | null | undefined;

export const uploadFileToCloudinary = async (
  file: { uri?: string } | string,
  folderName: string
): Promise<ResponseType> => {
  try {
    const uri = typeof file === "string" ? file : file.uri;

    if (!uri) {
      return { success: false, msg: "No file provided" };
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
