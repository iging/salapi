import Skeleton from "@/components/skeleton";
import { radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { StyleSheet, View } from "react-native";

/**
 * Skeleton for Profile Tab (profile.tsx)
 * Mirrors exact layout: Header, User Avatar, Name/Email, Account Options list
 */
const ProfileSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <Skeleton width={scale(70)} height={verticalScale(24)} />
      </View>

      {/* User Info Section */}
      <View style={styles.userInfo}>
        {/* Avatar */}
        <Skeleton
          width={verticalScale(135)}
          height={verticalScale(135)}
          variant="circle"
        />

        {/* Name & Email */}
        <View style={styles.nameContainer}>
          <Skeleton width={scale(150)} height={verticalScale(24)} />
          <Skeleton width={scale(180)} height={verticalScale(15)} />
        </View>
      </View>

      {/* Account Options List */}
      <View style={styles.accountOptions}>
        {Array.from({ length: 4 }).map((_, index) => (
          <AccountOptionSkeleton key={index} />
        ))}
      </View>
    </View>
  );
};

/**
 * Single Account Option Item Skeleton
 * Mirrors: Icon box, Title text, Caret icon
 */
const AccountOptionSkeleton = () => {
  return (
    <View style={styles.listItem}>
      <View style={styles.optionRow}>
        {/* Icon */}
        <Skeleton
          width={verticalScale(44)}
          height={verticalScale(44)}
          borderRadius={radius._15}
        />

        {/* Title */}
        <View style={{ flex: 1 }}>
          <Skeleton width={scale(100)} height={verticalScale(16)} />
        </View>

        {/* Caret Icon */}
        <Skeleton
          width={verticalScale(20)}
          height={verticalScale(20)}
          borderRadius={4}
        />
      </View>
    </View>
  );
};

export default ProfileSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  header: {
    marginVertical: spacingY._10,
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },
  accountOptions: {
    marginTop: spacingY._35,
  },
  listItem: {
    marginBottom: verticalScale(17),
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
});
