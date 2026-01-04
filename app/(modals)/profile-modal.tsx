import BackButton from "@/components/back-button";
import Button from "@/components/button";
import Dialog from "@/components/dialog";
import Header from "@/components/header";
import Input from "@/components/input";
import ModalWrapper from "@/components/modal-wrapper";
import PasswordRequirements from "@/components/password-requirements";
import { ProfileModalSkeleton } from "@/components/skeletons";
import Typo from "@/components/typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import { getProfileImage } from "@/services/image.services";
import {
  changeUserPassword,
  deleteUserAccount,
  updateUser,
} from "@/services/user.services";
import { UserDataType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import Constants from "expo-constants";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRouter } from "expo-router";
import { PencilIcon, TrashIcon } from "phosphor-react-native";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const ProfileModal = () => {
  const { user, updateUserData } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isSuperAccount =
    user?.uid === Constants.expoConfig?.extra?.superAccountUid;

  const goBack = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/profile");
    }
  };

  useEffect(() => {
    if (user) {
      setUserData({
        name: user?.name || "",
        image: user?.image || null,
      });
      setInitialLoading(false);
    }
  }, [user]);

  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

  const onPickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];

      if (selectedImage.fileSize && selectedImage.fileSize > MAX_FILE_SIZE) {
        Toast.show({
          type: "error",
          text1: "Image too large",
          text2: "Please select an image under 3MB",
        });
        return;
      }

      setUserData({ ...userData, image: selectedImage });
    }
  };

  const onSubmit = async () => {
    if (!userData.name.trim()) {
      Toast.show({ type: "error", text1: "Name is required" });
      return;
    }

    if (!user?.uid) return;

    setLoading(true);

    // Check if user wants to change password
    const isChangingPassword =
      currentPassword || newPassword || confirmPassword;

    if (isChangingPassword) {
      // Validate all password fields are filled
      if (!currentPassword || !newPassword || !confirmPassword) {
        Toast.show({
          type: "error",
          text1: "Password Required",
          text2: "Please fill all password fields to change password",
        });
        setLoading(false);
        return;
      }

      const passwordChanged = await handleChangePassword();
      if (!passwordChanged) {
        setLoading(false);
        return;
      }
    }

    const result = await updateUser(user.uid, userData);
    setLoading(false);

    if (result.success) {
      await updateUserData(user.uid);
      Toast.show({ type: "success", text1: result.msg });
      goBack();
    } else {
      Toast.show({ type: "error", text1: result.msg });
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.uid) return;

    setShowDeleteDialog(false);
    setDeleteLoading(true);

    const result = await deleteUserAccount(user.uid);

    setDeleteLoading(false);

    if (result.success) {
      Toast.show({
        type: "success",
        text1: "Account Deleted",
        text2: "Your account and all data have been permanently deleted",
      });
      router.replace("/(auth)/welcome");
    } else {
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: result.msg,
      });
    }
  };

  const handleChangePassword = async (): Promise<boolean> => {
    // Validate password fields
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password Mismatch",
        text2: "New password and confirm password do not match",
      });
      return false;
    }

    const result = await changeUserPassword(currentPassword, newPassword);

    if (result.success) {
      Toast.show({
        type: "success",
        text1: "Password Changed",
        text2: "Your password has been updated successfully",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      return true;
    } else {
      Toast.show({
        type: "error",
        text1: "Password Change Failed",
        text2: result.msg,
      });
      return false;
    }
  };

  // Show skeleton while user data is loading
  if (initialLoading) {
    return (
      <ModalWrapper>
        <ProfileModalSkeleton />
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <Header
            title="Update Profile"
            leftIcon={<BackButton />}
            style={{ marginBottom: spacingY._10 }}
          />
          {/* Form */}
          <ScrollView
            contentContainerStyle={styles.form}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={getProfileImage(userData.image)}
                contentFit="cover"
                transition={100}
              />
              <TouchableOpacity onPress={onPickImage} style={styles.editIcon}>
                <PencilIcon
                  size={verticalScale(20)}
                  color={colors.neutral800}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Input
                label="Name"
                placeholder="Enter your name"
                value={userData.name}
                onChangeText={(text) =>
                  setUserData({ ...userData, name: text })
                }
              />
            </View>

            {/* Change Password Section - Hidden for super account */}
            {!isSuperAccount && (
              <View style={styles.passwordSection}>
                <Typo size={14} fontWeight="600" color={colors.neutral400}>
                  Change Password
                </Typo>
                <Typo
                  size={12}
                  color={colors.neutral500}
                  style={{ marginTop: spacingY._5, marginBottom: spacingY._15 }}
                >
                  Leave blank if you don&apos;t want to change your password.
                </Typo>

                <View style={styles.passwordInputs}>
                  <Input
                    label="Current Password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />

                  <Input
                    label="New Password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />

                  {newPassword.length > 0 && (
                    <PasswordRequirements password={newPassword} />
                  )}

                  <Input
                    label="Confirm New Password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              </View>
            )}

            {/* Delete Account Section - Hidden for super account */}
            {!isSuperAccount && (
              <View style={styles.dangerZone}>
                <Typo size={14} fontWeight="600" color={colors.rose}>
                  Danger Zone
                </Typo>
                <Typo
                  size={12}
                  color={colors.neutral400}
                  style={{ marginTop: spacingY._5 }}
                >
                  Deleting your account will permanently remove all your data
                  including wallets, transactions, and profile information. This
                  action cannot be undone.
                </Typo>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => setShowDeleteDialog(true)}
                  disabled={deleteLoading}
                >
                  <TrashIcon size={verticalScale(18)} color={colors.white} />
                  <Typo size={14} fontWeight="600" color={colors.white}>
                    {deleteLoading ? "Deleting..." : "Delete Account"}
                  </Typo>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
            <Typo color={colors.black} fontWeight="700">
              Update Profile
            </Typo>
          </Button>
        </View>
      </KeyboardAvoidingView>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        visible={showDeleteDialog}
        title="Delete Account"
        message="Are you sure you want to delete your account? This will permanently delete all your wallets, transactions, and profile data. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor={colors.rose}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </ModalWrapper>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
    marginTop: verticalScale(8),
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
    paddingBottom: spacingY._30,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
    overflow: "hidden",
    position: "relative",
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  dangerZone: {
    backgroundColor: colors.neutral900,
    borderRadius: 12,
    padding: spacingX._15,
    borderWidth: 1,
    borderColor: colors.rose,
    marginTop: spacingY._10,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacingX._10,
    backgroundColor: colors.rose,
    paddingVertical: spacingY._12,
    borderRadius: 10,
    marginTop: spacingY._15,
  },
  passwordSection: {
    backgroundColor: colors.neutral900,
    borderRadius: 12,
    padding: spacingX._15,
  },
  passwordInputs: {
    gap: spacingY._15,
  },
});
