import Header from "@/components/header";
import Loading from "@/components/loading";
import ScreenWrapper from "@/components/screen-wrapper";
import { StatisticsSkeleton } from "@/components/skeletons";
import TransactionList from "@/components/transaction-list";
import Typo from "@/components/typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import useFetchData from "@/hooks/use-fetch-data";
import {
  fetchMonthlyStats,
  fetchWeeklyStats,
  fetchYearlyStats,
} from "@/services/transaction.services";
import { TransactionType } from "@/types";
import { toPeso } from "@/utils/currency";
import { scale, verticalScale } from "@/utils/styling";
import SegmentControl from "@react-native-segmented-control/segmented-control";
import { useFocusEffect } from "@react-navigation/native";
import { where } from "firebase/firestore";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

interface ChartDataItem {
  value: number;
  label: string;
  frontColor: string;
  spacing?: number;
}

const Statistics = () => {
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [maxValue, setMaxValue] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const transactionConstraints = useMemo(
    () => (user?.uid ? [where("uid", "==", user.uid)] : []),
    [user?.uid],
  );

  const {
    data: transactionsRaw,
    loading: transactionsLoading,
    refresh,
  } = useFetchData<TransactionType>("transactions", transactionConstraints);

  // Helper to convert Firestore Timestamp to Date
  const toDate = (date: any): Date => {
    if (date?.toDate) return date.toDate();
    if (date instanceof Date) return date;
    return new Date(date);
  };

  // Sort transactions by date descending and limit to 10
  const transactions = useMemo(() => {
    return [...transactionsRaw]
      .sort(
        (a, b) =>
          moment(toDate(b.date)).valueOf() - moment(toDate(a.date)).valueOf(),
      )
      .slice(0, 10);
  }, [transactionsRaw]);

  const getBarColor = (type: "income" | "expense") => {
    return type === "income" ? colors.green : colors.rose;
  };

  // Format Y-axis labels to prevent overflow with ellipsis
  const formatYLabel = (value: string) => {
    const numValue = parseFloat(value.replace(/[₱,]/g, ""));
    if (isNaN(numValue)) return value;

    // If the number is very large, abbreviate it
    if (numValue >= 1000000) {
      return `₱${(numValue / 1000000).toFixed(1)}M`;
    } else if (numValue >= 10000) {
      return `₱${(numValue / 1000).toFixed(0)}K`;
    } else if (numValue >= 1000) {
      return `₱${(numValue / 1000).toFixed(1)}K`;
    }
    return toPeso(numValue);
  };

  // Calculate a nice round max value for the Y-axis
  const calculateMaxValue = (data: ChartDataItem[]) => {
    const max = Math.max(...data.map((d) => d.value), 0);
    if (max === 0) return 100;
    // Round up to nearest nice number
    const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
    const normalized = max / magnitude;
    let niceMax;
    if (normalized <= 1) niceMax = magnitude;
    else if (normalized <= 2) niceMax = 2 * magnitude;
    else if (normalized <= 5) niceMax = 5 * magnitude;
    else niceMax = 10 * magnitude;
    return niceMax;
  };

  const fetchStats = useCallback(async () => {
    if (!user?.uid) return;

    setChartLoading(true);
    let result;

    try {
      switch (activeIndex) {
        case 0:
          result = await fetchWeeklyStats(user.uid);
          break;
        case 1:
          result = await fetchMonthlyStats(user.uid);
          break;
        case 2:
          result = await fetchYearlyStats(user.uid);
          break;
        default:
          result = await fetchWeeklyStats(user.uid);
      }

      if (result.success && result.data) {
        const formattedData: ChartDataItem[] = [];

        // Filter out periods with no data (income = 0 and expense = 0)
        const filteredData = result.data.filter(
          (item: any) => item.income > 0 || item.expense > 0,
        );

        filteredData.forEach((item: any) => {
          const label =
            activeIndex === 0
              ? item.day
              : activeIndex === 1
                ? item.month
                : `'${item.year.slice(-2)}`;

          // Income bar
          formattedData.push({
            value: item.income,
            label: label,
            frontColor: getBarColor("income"),
            spacing: scale(4),
          });

          // Expense bar
          formattedData.push({
            value: item.expense,
            label: "",
            frontColor: getBarColor("expense"),
          });
        });

        setChartData(formattedData);
        setMaxValue(calculateMaxValue(formattedData));
      }
    } catch (error) {
      if (__DEV__) {
        console.error("Failed to fetch stats:", error);
      }
    } finally {
      setChartLoading(false);
    }
  }, [user?.uid, activeIndex]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Refresh chart when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats]),
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refresh(), fetchStats()]);
    setIsRefreshing(false);
  };

  // Show skeleton on initial load
  if (transactionsLoading && !isRefreshing) {
    return (
      <ScreenWrapper>
        <StatisticsSkeleton />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Statistics" />
        <ScrollView
          contentContainerStyle={{
            gap: spacingY._20,
            paddingTop: spacingY._5,
            paddingBottom: verticalScale(100),
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          <SegmentControl
            values={["Weekly", "Monthly", "Yearly"]}
            selectedIndex={activeIndex}
            onChange={(event) => {
              setActiveIndex(event.nativeEvent.selectedSegmentIndex);
            }}
            tintColor={colors.neutral200}
            backgroundColor={colors.neutral800}
            appearance="dark"
            style={styles.segmentStyle}
            fontStyle={{ ...styles.segmentFontStyle, color: colors.white }}
            activeFontStyle={{
              ...styles.segmentFontStyle,
              color: colors.black,
            }}
          />
          {/* Chart Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors.green }]}
              />
              <Typo size={12} color={colors.neutral300}>
                Income
              </Typo>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors.rose }]}
              />
              <Typo size={12} color={colors.neutral300}>
                Expense
              </Typo>
            </View>
          </View>

          <View style={styles.chartContainer}>
            {chartLoading ? (
              <View style={[styles.noChart, styles.chartLoadingContainer]}>
                <Loading color={colors.white} />
              </View>
            ) : chartData.length > 0 ? (
              <BarChart
                data={chartData}
                barWidth={scale(10)}
                spacing={[1, 2].includes(activeIndex) ? scale(30) : scale(20)}
                roundedTop
                roundedBottom
                hideRules
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisLabelWidth={scale(55)}
                yAxisTextStyle={{
                  color: colors.neutral350,
                  fontSize: verticalScale(11),
                }}
                xAxisLabelTextStyle={{
                  color: colors.neutral350,
                  fontSize: verticalScale(11),
                }}
                formatYLabel={formatYLabel}
                noOfSections={3}
                maxValue={maxValue}
                minHeight={5}
                isAnimated={true}
                animationDuration={500}
              />
            ) : (
              <View style={styles.noChart}>
                <Typo size={14} color={colors.neutral400}>
                  No transactions found
                </Typo>
              </View>
            )}
          </View>
          {/* Transaction List */}
          <TransactionList
            title="Transactions"
            emptyListMessage="No transactions found"
            data={transactions}
            loading={transactionsLoading}
          />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  chartLoadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  noChart: {
    backgroundColor: colors.neutral800,
    height: verticalScale(210),
    width: "100%",
    borderRadius: radius._12,
    justifyContent: "center",
    alignItems: "center",
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
  legendDot: {
    width: scale(10),
    height: scale(10),
    borderRadius: 100,
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    height: verticalScale(35),
    width: verticalScale(35),
    borderCurve: "continuous",
  },
  segmentStyle: {
    height: scale(37),
  },
  segmentFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: colors.black,
  },
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._10,
  },
});
