import Skeleton from "@/components/skeleton";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { ScrollView, StyleSheet, View } from "react-native";

/**
 * Skeleton for WalletModal
 * Mirrors exact layout: Header, Wallet Name input, Wallet Icon upload, Footer
 */
const WalletModalSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <Skeleton
          width={verticalScale(40)}
          height={verticalScale(40)}
          borderRadius={100}
        />
        <Skeleton width={scale(100)} height={verticalScale(24)} />
        <View style={{ width: verticalScale(40) }} />
      </View>

      {/* Form Content */}
      <ScrollView contentContainerStyle={styles.form}>
        {/* Wallet Name Input */}
        <View style={styles.inputContainer}>
          <Skeleton width={scale(90)} height={verticalScale(14)} />
          <Skeleton
            width="100%"
            height={verticalScale(54)}
            borderRadius={radius._17}
          />
        </View>

        {/* Wallet Icon Upload */}
        <View style={styles.inputContainer}>
          <Skeleton width={scale(80)} height={verticalScale(14)} />
          <Skeleton
            width="100%"
            height={verticalScale(150)}
            borderRadius={radius._15}
          />
        </View>
      </ScrollView>

      {/* Footer Skeleton */}
      <View style={styles.footer}>
        <Skeleton width="100%" height={verticalScale(52)} borderRadius={17} />
      </View>
    </View>
  );
};

export default WalletModalSkeleton;

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
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  inputContainer: {
    gap: spacingY._10,
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
