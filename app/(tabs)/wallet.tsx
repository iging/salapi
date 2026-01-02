import ScreenWrapper from "@/components/screen-wrapper";
import { WalletSkeleton } from "@/components/skeletons";
import Typo from "@/components/typo";
import WalletListItem from "@/components/wallet-list-item";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import useFetchData from "@/hooks/use-fetch-data";
import { TransactionType, WalletType } from "@/types";
import { toPeso } from "@/utils/currency";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { where } from "firebase/firestore";
import { PlusCircleIcon } from "phosphor-react-native";
import { useMemo } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const Wallet = () => {
  const router = useRouter();
  const { user } = useAuth();

  const walletConstraints = useMemo(
    () => (user?.uid ? [where("uid", "==", user.uid)] : []),
    [user?.uid]
  );

  const transactionConstraints = useMemo(
    () => (user?.uid ? [where("uid", "==", user.uid)] : []),
    [user?.uid]
  );

  const {
    data: wallets,
    loading: walletsLoading,
    refreshing: walletsRefreshing,
    refresh: refreshWallets,
  } = useFetchData<WalletType>("wallets", walletConstraints);

  const {
    data: transactions,
    refreshing: transactionsRefreshing,
    refresh: refreshTransactions,
  } = useFetchData<TransactionType>("transactions", transactionConstraints);

  const isRefreshing = walletsRefreshing || transactionsRefreshing;

  const handleRefresh = async () => {
    await Promise.all([refreshWallets(), refreshTransactions()]);
  };

  // Calculate balance for each wallet based on transactions
  const walletsWithBalance = useMemo(() => {
    return wallets.map((wallet) => {
      const walletTransactions = transactions.filter(
        (t) => t.walletId === wallet.id
      );

      let balance = 0;
      walletTransactions.forEach((t) => {
        if (t.type === "income") {
          balance += t.amount;
        } else {
          balance -= t.amount;
        }
      });

      return {
        ...wallet,
        amount: balance,
        totalIncome: walletTransactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0),
        totalExpenses: walletTransactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0),
      };
    });
  }, [wallets, transactions]);

  const getTotalBalance = () => {
    return walletsWithBalance.reduce(
      (sum, wallet) => sum + (wallet.amount || 0),
      0
    );
  };

  // Show skeleton on initial load
  if (walletsLoading) {
    return (
      <ScreenWrapper style={{ backgroundColor: colors.black }}>
        <WalletSkeleton />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        {/* Balance View */}
        <View style={styles.balanceView}>
          <View style={{ alignItems: "center" }}>
            <Typo size={45} fontWeight="500">
              {toPeso(getTotalBalance())}
            </Typo>
            <Typo size={16} color={colors.neutral300}>
              Total Balance
            </Typo>
          </View>
        </View>
        {/* Wallet */}
        <View style={styles.wallet}>
          {/* Header */}
          <View style={styles.flexRow}>
            <Typo size={20} fontWeight="500">
              My Wallets
            </Typo>
            <TouchableOpacity
              onPress={() => router.push("/(modals)/wallet-modal")}
            >
              <PlusCircleIcon
                weight="fill"
                color={colors.primary}
                size={verticalScale(33)}
              />
            </TouchableOpacity>
          </View>
          {/* Wallet Lists */}
          {walletsWithBalance.length === 0 && (
            <View style={styles.emptyState}>
              <Typo size={15} color={colors.neutral400}>
                No wallets yet. Create one to start tracking!
              </Typo>
            </View>
          )}
          <FlatList
            data={walletsWithBalance}
            renderItem={({ item, index }) => (
              <WalletListItem item={item} index={index} router={router} />
            )}
            keyExtractor={(item) => item.id || String(Math.random())}
            contentContainerStyle={styles.listStyle}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  balanceView: {
    height: verticalScale(160),
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  wallet: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25,
  },
  listStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacingY._40,
  },
});
