import Skeleton from "@/components/skeleton";
import { radius, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { StyleSheet, View } from "react-native";

/**
 * Skeleton for SearchModal
 * Mirrors exact layout: Header, Search Input, Transaction List items
 */
const SearchModalSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <Skeleton
          width={verticalScale(40)}
          height={verticalScale(40)}
          borderRadius={100}
        />
        <Skeleton width={scale(70)} height={verticalScale(24)} />
        <View style={{ width: verticalScale(40) }} />
      </View>

      {/* Search Input */}
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Skeleton
            width="100%"
            height={verticalScale(54)}
            borderRadius={radius._17}
          />
        </View>

        {/* Transaction List Skeleton */}
        <View style={styles.listContainer}>
          {/* Transaction Items */}
          {Array.from({ length: 6 }).map((_, index) => (
            <TransactionItemSkeleton key={index} />
          ))}
        </View>
      </View>
    </View>
  );
};

/**
 * Single Transaction Item Skeleton
 * Mirrors: Icon, Category/Description, Amount/Date
 */
const TransactionItemSkeleton = () => {
  return (
    <View style={styles.transactionRow}>
      {/* Category Icon */}
      <Skeleton
        width={verticalScale(50)}
        height={verticalScale(50)}
        borderRadius={radius._15}
      />

      {/* Category & Description */}
      <View style={styles.transactionInfo}>
        <Skeleton width={scale(100)} height={verticalScale(17)} />
        <Skeleton width={scale(140)} height={verticalScale(12)} />
      </View>

      {/* Amount & Date */}
      <View style={styles.transactionAmount}>
        <Skeleton width={scale(70)} height={verticalScale(15)} />
        <Skeleton width={scale(50)} height={verticalScale(12)} />
      </View>
    </View>
  );
};

export default SearchModalSkeleton;

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
  listContainer: {
    gap: spacingY._15,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacingY._7,
    gap: spacingY._10,
  },
  transactionInfo: {
    flex: 1,
    gap: verticalScale(6),
  },
  transactionAmount: {
    alignItems: "flex-end",
    gap: verticalScale(6),
  },
});
