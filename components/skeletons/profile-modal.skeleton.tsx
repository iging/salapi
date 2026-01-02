import Skeleton from "@/components/skeleton";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { StyleSheet, View } from "react-native";

/**
 * Skeleton for ProfileModal
 * Mirrors exact layout: Header, Avatar with edit icon, Name input, Footer button
 */
const ProfileModalSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <Skeleton
          width={verticalScale(40)}
          height={verticalScale(40)}
          borderRadius={100}
        />
        <Skeleton width={scale(120)} height={verticalScale(24)} />
        <View style={{ width: verticalScale(40) }} />
      </View>

      {/* Form Content */}
      <View style={styles.form}>
        {/* Avatar Skeleton */}
        <View style={styles.avatarContainer}>
          <Skeleton
            width={verticalScale(135)}
            height={verticalScale(135)}
            variant="circle"
          />
          {/* Edit icon overlay */}
          <View style={styles.editIconPlaceholder}>
            <Skeleton
              width={verticalScale(35)}
              height={verticalScale(35)}
              variant="circle"
            />
          </View>
        </View>

        {/* Name Input Skeleton */}
        <View style={styles.inputContainer}>
          <Skeleton width={scale(50)} height={verticalScale(14)} />
          <Skeleton width="100%" height={verticalScale(54)} borderRadius={17} />
        </View>
      </View>

      {/* Footer Skeleton */}
      <View style={styles.footer}>
        <Skeleton width="100%" height={verticalScale(52)} borderRadius={17} />
      </View>
    </View>
  );
};

export default ProfileModalSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacingY._10,
  },
  form: {
    flex: 1,
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  editIconPlaceholder: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._7,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
});
