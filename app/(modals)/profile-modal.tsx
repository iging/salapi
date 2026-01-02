import BackButton from "@/components/back-button";
import Button from "@/components/button";
import Header from "@/components/header";
import Input from "@/components/input";
import ModalWrapper from "@/components/modal-wrapper";
import { ProfileModalSkeleton } from "@/components/skeletons";
import Typo from "@/components/typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import { getProfileImage } from "@/services/image.services";
import { updateUser } from "@/services/user.services";
import { UserDataType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRouter } from "expo-router";
import { PencilIcon } from "phosphor-react-native";
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
  const [initialLoading, setInitialLoading] = useState(true);

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
      aspect: [4, 3],
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
          <ScrollView contentContainerStyle={styles.form}>
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
});
