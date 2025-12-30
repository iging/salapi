import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./image.services";

export const updateUser = async (
  uid: string,
  userData: UserDataType
): Promise<ResponseType> => {
  try {
    const dataToUpdate: Partial<UserDataType> = { name: userData.name };

    if (userData.image && userData.image.uri) {
      const imageUploadRes = await uploadFileToCloudinary(
        userData.image,
        "profiles"
      );

      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Image upload failed",
        };
      }

      dataToUpdate.image = imageUploadRes.data;
    }

    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, dataToUpdate);

    return { success: true, msg: "Profile updated successfully" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update profile";
    return { success: false, msg: errorMessage };
  }
};
