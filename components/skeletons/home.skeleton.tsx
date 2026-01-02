import Skeleton from "@/components/skeleton";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { StyleSheet, View } from "react-native";

/**
 * Skeleton for Home Tab (index.tsx)
 * Mirrors exact layout: Header (greeting + search icon), HomeCard, Recent Transactions
 */
const HomeSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View style={{ gap: 4 }}>
          <Skeleton width={scale(50)} height={verticalScale(16)} />
          <Skeleton width={scale(100)} height={verticalScale(20)} />
        </View>
        <Skeleton
          width={verticalScale(42)}
          height={verticalScale(42)}
          variant="circle"
        />
      </View>

      {/* HomeCard Skeleton */}
      <View style={styles.cardContainer}>
        <HomeCardSkeleton />
      </View>

      {/* Recent Transactions Section */}
      <View style={styles.transactionsSection}>
        {/* Section Title */}
        <Skeleton width={scale(160)} height={verticalScale(20)} />

        {/* Transaction Items */}
        <View style={styles.transactionsList}>
          {Array.from({ length: 5 }).map((_, index) => (
            <TransactionItemSkeleton key={index} />
          ))}
        </View>
      </View>
    </View>
  );
};

/**
 * HomeCard Skeleton
 * Mirrors: Total Balance, Income/Expense stats
 */
const HomeCardSkeleton = () => {
  return (
    <View style={styles.card}>
      {/* Total Balance Section */}
      <View style={styles.cardHeader}>
        <Skeleton width={scale(100)} height={verticalScale(17)} />
        <Skeleton width={scale(180)} height={verticalScale(30)} />
      </View>

      {/* Income/Expense Stats */}
      <View style={styles.cardStats}>
        {/* Income */}
        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <Skeleton
              width={verticalScale(30)}
              height={verticalScale(30)}
              variant="circle"
            />
            <Skeleton width={scale(55)} height={verticalScale(16)} />
          </View>
          <Skeleton
            width={scale(80)}
            height={verticalScale(17)}
            style={{ alignSelf: "center" }}
          />
        </View>

        {/* Expense */}
        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <Skeleton
              width={verticalScale(30)}
              height={verticalScale(30)}
              variant="circle"
            />
            <Skeleton width={scale(60)} height={verticalScale(16)} />
          </View>
          <Skeleton
            width={scale(80)}
            height={verticalScale(17)}
            style={{ alignSelf: "center" }}
          />
        </View>
      </View>
    </View>
  );
};

/**
 * Single Transaction Item Skeleton
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

export default HomeSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  cardContainer: {
    marginTop: spacingY._10,
  },
  card: {
    backgroundColor: colors.neutral700,
    borderRadius: radius._20,
    padding: spacingX._20,
    height: scale(210),
    justifyContent: "space-between",
  },
  cardHeader: {
    gap: spacingY._10,
  },
  cardStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    gap: verticalScale(8),
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._7,
  },
  transactionsSection: {
    marginTop: spacingY._25,
    gap: spacingY._15,
  },
  transactionsList: {
    gap: spacingY._10,
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
