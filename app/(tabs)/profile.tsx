import Dialog from "@/components/dialog";
import Header from "@/components/header";
import ScreenWrapper from "@/components/screen-wrapper";
import Typo from "@/components/typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import { getProfileImage } from "@/services/image.services";
import { accountOptionType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  CaretRightIcon,
  GearSixIcon,
  LockIcon,
  PowerIcon,
  UserIcon,
} from "phosphor-react-native";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const Profile = () => {
  const { user, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const accountOptions: accountOptionType[] = [
    {
      title: "Edit Profile",
      icon: <UserIcon size={26} color={colors.white} />,
      routeName: "/(modals)/profile-modal",
      bgColor: colors.neutral600,
    },
    {
      title: "Settings",
      icon: <GearSixIcon size={26} color={colors.white} />,
      //   routeName: "/(modals)/profile-modal",
      bgColor: colors.neutral600,
    },
    {
      title: "Privacy Policy",
      icon: <LockIcon size={26} color={colors.white} />,
      //   routeName: "/(modals)/profile-modal",
      bgColor: colors.neutral600,
    },
    {
      title: "Logout",
      icon: <PowerIcon size={26} color={colors.white} />,
      routeName: "",
      bgColor: colors.rose,
    },
  ];

  const handleLogout = async () => {
    setShowLogoutDialog(false);
    await logout();
    router.replace("/(auth)/welcome");
  };

  const handlePress = async (items: accountOptionType) => {
    if (items.title === "Logout") {
      setShowLogoutDialog(true);
      return;
    }
    if (items.routeName) router.push(items.routeName);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Profile" style={{ marginVertical: spacingY._10 }} />
        {/* User Info */}
        <View style={styles.userInfo}>
          {/* Avatar */}
          <View>
            <Image
              source={getProfileImage(user?.image)}
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />
          </View>
          {/* Credentials */}
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight="600" color={colors.neutral100}>
              {user?.name}
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>
        {/* Account Options */}
        <View style={styles.accountOptions}>
          {accountOptions.map((items, index) => {
            return (
              <Animated.View
                entering={FadeInDown.delay(index * 50)
                  .springify()
                  .damping(14)}
                style={styles.listItem}
                key={index.toString()}
              >
                <TouchableOpacity
                  style={styles.flexRow}
                  onPress={() => handlePress(items)}
                >
                  {/* Icon */}
                  <View
                    style={[
                      styles.listIcon,
                      { backgroundColor: items?.bgColor },
                    ]}
                  >
                    {items.icon && items.icon}
                  </View>
                  <Typo size={16} style={{ flex: 1 }} fontWeight="500">
                    {items.title}
                  </Typo>
                  <CaretRightIcon
                    size={verticalScale(20)}
                    weight="bold"
                    color={colors.white}
                  />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
        <Dialog
          visible={showLogoutDialog}
          title="Logout"
          message="Are you sure you want to logout?"
          confirmText="Logout"
          cancelText="Cancel"
          confirmColor={colors.rose}
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutDialog(false)}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15,
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
    overflow: "hidden",
    position: "relative",
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 8,
    borderRadius: 50,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: 5,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  listItem: {
    marginBottom: verticalScale(17),
  },
  accountOptions: {
    marginTop: spacingY._35,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
});
