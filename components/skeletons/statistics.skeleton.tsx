import Skeleton from "@/components/skeleton";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { StyleSheet, View } from "react-native";

/**
 * Skeleton for Statistics Tab (statistics.tsx)
 * Mirrors exact layout: Header, Segment Control, Legend, Chart, Transaction List
 */
const StatisticsSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <Skeleton width={scale(90)} height={verticalScale(24)} />
      </View>

      {/* Segment Control Skeleton */}
      <Skeleton width="100%" height={scale(37)} borderRadius={8} />

      {/* Legend Skeleton */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <Skeleton width={scale(10)} height={scale(10)} variant="circle" />
          <Skeleton width={scale(50)} height={verticalScale(12)} />
        </View>
        <View style={styles.legendItem}>
          <Skeleton width={scale(10)} height={scale(10)} variant="circle" />
          <Skeleton width={scale(55)} height={verticalScale(12)} />
        </View>
      </View>

      {/* Chart Skeleton */}
      <View style={styles.chartContainer}>
        <ChartSkeleton />
      </View>

      {/* Transactions Section */}
      <View style={styles.transactionsSection}>
        {/* Section Title */}
        <Skeleton width={scale(110)} height={verticalScale(20)} />

        {/* Transaction Items */}
        <View style={styles.transactionsList}>
          {Array.from({ length: 4 }).map((_, index) => (
            <TransactionItemSkeleton key={index} />
          ))}
        </View>
      </View>
    </View>
  );
};

/**
 * Chart Skeleton
 * Mimics a bar chart with bars of varying heights
 */
const ChartSkeleton = () => {
  const barHeights = [80, 120, 60, 140, 100, 90, 110];

  return (
    <View style={styles.chart}>
      {/* Y-axis labels */}
      <View style={styles.yAxis}>
        <Skeleton width={scale(30)} height={verticalScale(12)} />
        <Skeleton width={scale(30)} height={verticalScale(12)} />
        <Skeleton width={scale(30)} height={verticalScale(12)} />
        <Skeleton width={scale(30)} height={verticalScale(12)} />
      </View>

      {/* Bars */}
      <View style={styles.barsContainer}>
        {barHeights.map((height, index) => (
          <View key={index} style={styles.barGroup}>
            <View style={styles.barPair}>
              <Skeleton
                width={scale(12)}
                height={verticalScale(height * 0.8)}
                borderRadius={4}
              />
              <Skeleton
                width={scale(12)}
                height={verticalScale(height)}
                borderRadius={4}
              />
            </View>
            <Skeleton
              width={scale(25)}
              height={verticalScale(12)}
              style={{ marginTop: 8 }}
            />
          </View>
        ))}
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

export default StatisticsSkeleton;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._20,
  },
  header: {
    marginTop: spacingY._5,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacingX._20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  chartContainer: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._12,
    padding: spacingX._15,
    minHeight: verticalScale(210),
  },
  chart: {
    flexDirection: "row",
    height: verticalScale(180),
  },
  yAxis: {
    justifyContent: "space-between",
    paddingVertical: spacingY._10,
    marginRight: spacingX._10,
  },
  barsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
  },
  barGroup: {
    alignItems: "center",
  },
  barPair: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  transactionsSection: {
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
