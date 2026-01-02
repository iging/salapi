import Button from "@/components/button";
import HomeCard from "@/components/home-card";
import ScreenWrapper from "@/components/screen-wrapper";
import { HomeSkeleton } from "@/components/skeletons";
import TransactionList from "@/components/transaction-list";
import Typo from "@/components/typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import useFetchData from "@/hooks/use-fetch-data";
import { TransactionType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { where } from "firebase/firestore";
import moment from "moment";
import { MagnifyingGlassIcon, PlusIcon } from "phosphor-react-native";
import { useMemo } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();

  const transactionConstraints = useMemo(
    () => (user?.uid ? [where("uid", "==", user.uid)] : []),
    [user?.uid]
  );

  const {
    data: transactions,
    loading,
    refreshing,
    refresh,
  } = useFetchData<TransactionType>("transactions", transactionConstraints);

  const { totalBalance, totalIncome, totalExpense } = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    });

    return {
      totalIncome: income,
      totalExpense: expense,
      totalBalance: income - expense,
    };
  }, [transactions]);

  // Helper to convert Firestore Timestamp to Date
  const toDate = (date: any): Date => {
    if (date?.toDate) return date.toDate();
    if (date instanceof Date) return date;
    return new Date(date);
  };

  // Get recent transactions (last 5, sorted by date descending)
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort(
        (a, b) =>
          moment(toDate(b.date)).valueOf() - moment(toDate(a.date)).valueOf()
      )
      .slice(0, 5);
  }, [transactions]);

  // Show skeleton on initial load or refresh
  if (loading) {
    return (
      <ScreenWrapper>
        <HomeSkeleton />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.neutral400}>
              Hello,
            </Typo>
            <Typo size={20} fontWeight="500">
              {user?.name}
            </Typo>
          </View>
          <TouchableOpacity
            style={styles.searchIcon}
            onPress={() => router.push("/(modals)/search-modal")}
          >
            <MagnifyingGlassIcon
              size={verticalScale(22)}
              color={colors.neutral200}
              weight="bold"
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          {/* Card */}
          <View>
            <HomeCard
              totalBalance={totalBalance}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
            />
          </View>
          <TransactionList
            data={recentTransactions}
            loading={false}
            emptyListMessage="No transactions yet. Start tracking your expenses!"
            title="Recent Transactions"
          />
        </ScrollView>
        <Button
          style={styles.floatingButton}
          onPress={() => router.push("/(modals)/transaction-modal")}
        >
          <PlusIcon
            size={verticalScale(24)}
            color={colors.black}
            weight="bold"
          />
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

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
  searchIcon: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 50,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(100),
    right: verticalScale(20),
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
});
