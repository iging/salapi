import Skeleton from "@/components/skeleton";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { ScrollView, StyleSheet, View } from "react-native";

/**
 * Skeleton for TransactionModal
 * Mirrors exact layout: Header, Transaction Type dropdown, Amount, Category, Wallet, Date, Description, Receipt, Footer
 */
const TransactionModalSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <Skeleton
          width={verticalScale(40)}
          height={verticalScale(40)}
          borderRadius={100}
        />
        <Skeleton width={scale(150)} height={verticalScale(24)} />
        <View style={{ width: verticalScale(40) }} />
      </View>

      {/* Form Content */}
      <ScrollView
        contentContainerStyle={styles.form}
        showsVerticalScrollIndicator={false}
      >
        {/* Transaction Type Dropdown */}
        <View style={styles.inputContainer}>
          <Skeleton width={scale(120)} height={verticalScale(14)} />
          <Skeleton
            width="100%"
            height={verticalScale(54)}
            borderRadius={radius._15}
          />
        </View>

        {/* Amount Input */}
        <View style={styles.inputContainer}>
          <Skeleton width={scale(60)} height={verticalScale(14)} />
          <Skeleton
            width="100%"
            height={verticalScale(54)}
            borderRadius={radius._17}
          />
        </View>

        {/* Category Dropdown */}
        <View style={styles.inputContainer}>
          <Skeleton width={scale(70)} height={verticalScale(14)} />
          <Skeleton
            width="100%"
            height={verticalScale(54)}
            borderRadius={radius._15}
          />
        </View>

        {/* Wallet Dropdown */}
        <View style={styles.inputContainer}>
          <Skeleton width={scale(50)} height={verticalScale(14)} />
          <Skeleton
            width="100%"
            height={verticalScale(54)}
            borderRadius={radius._15}
          />
        </View>

        {/* Date Picker */}
        <View style={styles.inputContainer}>
          <Skeleton width={scale(40)} height={verticalScale(14)} />
          <Skeleton
            width="100%"
            height={verticalScale(54)}
            borderRadius={radius._17}
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputContainer}>
          <Skeleton width={scale(140)} height={verticalScale(14)} />
          <Skeleton
            width="100%"
            height={verticalScale(100)}
            borderRadius={radius._17}
          />
        </View>

        {/* Receipt Upload */}
        <View style={styles.inputContainer}>
          <Skeleton width={scale(110)} height={verticalScale(14)} />
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

export default TransactionModalSkeleton;

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
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
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
