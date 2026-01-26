import Dialog from "@/components/dialog";
import Header from "@/components/header";
import ScreenWrapper from "@/components/screen-wrapper";
import { ProfileSkeleton } from "@/components/skeletons";
import Typo from "@/components/typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import { getProfileImage } from "@/services/image.services";
import { accountOptionType } from "@/types";
import { verticalScale } from "@/utils/styling";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  CaretRightIcon,
  GearSixIcon,
  LockIcon,
  PowerIcon,
  QuestionIcon,
  UserIcon,
} from "phosphor-react-native";
import { useCallback, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const Profile = () => {
  const { user, logout, updateUserData } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const appVersion = Constants.expoConfig?.version ?? "1.0.0";
  const buildNumber = appVersion.split(".")[2] ?? "0";

  const accountOptions: accountOptionType[] = [
    {
      title: "Account",
      icon: <UserIcon size={26} color={colors.white} />,
      routeName: "/(modals)/profile-modal",
      bgColor: colors.neutral600,
      category: "Account",
    },
    {
      title: "Settings",
      icon: <GearSixIcon size={26} color={colors.white} />,
      routeName: "/(modals)/settings-modal",
      bgColor: colors.neutral600,
      category: "Account",
    },
    {
      title: "Help",
      icon: <QuestionIcon size={26} color={colors.white} />,
      routeName: "/(modals)/help-center-modal",
      bgColor: colors.neutral600,
      category: "Support",
    },
    {
      title: "Privacy Policy",
      icon: <LockIcon size={26} color={colors.white} />,
      routeName: "/(modals)/privacy-policy-modal",
      bgColor: colors.neutral600,
      category: "Support",
    },
    {
      title: "Logout",
      icon: <PowerIcon size={26} color={colors.white} />,
      routeName: "",
      bgColor: colors.rose,
      category: "Actions",
    },
  ];

  // Group options by category
  const groupedOptions = accountOptions.reduce(
    (acc, option) => {
      const category = option.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(option);
      return acc;
    },
    {} as Record<string, accountOptionType[]>,
  );

  const handleRefresh = useCallback(async () => {
    if (!user?.uid) return;
    setRefreshing(true);
    setLoading(true);
    await updateUserData(user.uid);
    // Small delay to show skeleton
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    setRefreshing(false);
  }, [user?.uid, updateUserData]);

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

  // Show skeleton when loading
  if (loading) {
    return (
      <ScreenWrapper>
        <ProfileSkeleton />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
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
            {Object.entries(groupedOptions).map(
              ([category, options], categoryIndex) => (
                <View key={category} style={styles.categoryGroup}>
                  {/* Category Header */}
                  <Typo
                    size={13}
                    color={colors.neutral500}
                    fontWeight="600"
                    style={styles.categoryHeader}
                  >
                    {category}
                  </Typo>
                  {/* Category Items Container */}
                  <View style={styles.categoryItemsContainer}>
                    {options.map((items, index) => {
                      const isFirst = index === 0;
                      const isLast = index === options.length - 1;

                      return (
                        <Animated.View
                          entering={FadeInDown.delay(
                            (categoryIndex * options.length + index) * 50,
                          )
                            .springify()
                            .damping(14)}
                          key={index.toString()}
                        >
                          <TouchableOpacity
                            style={[
                              styles.listItem,
                              isFirst && styles.listItemFirst,
                              isLast && styles.listItemLast,
                              !isLast && styles.listItemBorder,
                            ]}
                            onPress={() => handlePress(items)}
                          >
                            <View style={styles.flexRow}>
                              {/* Icon */}
                              <View
                                style={[
                                  styles.listIcon,
                                  { backgroundColor: items?.bgColor },
                                ]}
                              >
                                {items.icon && items.icon}
                              </View>
                              <Typo
                                size={16}
                                style={{ flex: 1 }}
                                fontWeight="500"
                              >
                                {items.title}
                              </Typo>
                              <CaretRightIcon
                                size={verticalScale(20)}
                                weight="bold"
                                color={colors.neutral500}
                              />
                            </View>
                          </TouchableOpacity>
                        </Animated.View>
                      );
                    })}
                  </View>
                </View>
              ),
            )}
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
          {/* Version Display */}
          <View style={styles.versionContainer}>
            <Typo size={12} color={colors.neutral500}>
              Version {appVersion} ({buildNumber})
            </Typo>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(100),
  },
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
    backgroundColor: colors.neutral900,
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._15,
  },
  listItemFirst: {
    borderTopLeftRadius: radius._15,
    borderTopRightRadius: radius._15,
  },
  listItemLast: {
    borderBottomLeftRadius: radius._15,
    borderBottomRightRadius: radius._15,
  },
  listItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral800,
  },
  accountOptions: {
    marginTop: spacingY._25,
    gap: spacingY._20,
  },
  categoryGroup: {
    gap: spacingY._10,
  },
  categoryHeader: {
    paddingHorizontal: spacingX._5,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  categoryItemsContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    overflow: "hidden",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: spacingY._20,
    marginTop: spacingY._10,
  },
});
