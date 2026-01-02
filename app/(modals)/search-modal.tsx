import BackButton from "@/components/back-button";
import Header from "@/components/header";
import Input from "@/components/input";
import ModalWrapper from "@/components/modal-wrapper";
import { SearchModalSkeleton } from "@/components/skeletons";
import TransactionList from "@/components/transaction-list";
import { colors, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import useFetchData from "@/hooks/use-fetch-data";
import { TransactionType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { orderBy, where } from "firebase/firestore";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const SearchModal = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const transactionConstraints = useMemo(
    () =>
      user?.uid ? [where("uid", "==", user.uid), orderBy("date", "desc")] : [],
    [user?.uid]
  );

  const {
    data: transactions,
    loading,
    refreshing,
    refresh,
  } = useFetchData<TransactionType>("transactions", transactionConstraints);

  const filteredTransactions = useMemo(() => {
    let results = transactions;

    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      results = transactions.filter((transaction) => {
        const category = transaction.category?.toLowerCase() || "";
        const customCategory = transaction.customCategory?.toLowerCase() || "";
        const description = transaction.description?.toLowerCase() || "";
        const amount = transaction.amount?.toString() || "";

        return (
          category.includes(searchLower) ||
          customCategory.includes(searchLower) ||
          description.includes(searchLower) ||
          amount.includes(searchLower)
        );
      });
    }

    // Limit to 10 items
    return results.slice(0, 10);
  }, [transactions, search]);

  // Show skeleton on initial load
  if (loading && !refreshing) {
    return (
      <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
        <SearchModalSkeleton />
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <Header
            title="Search"
            leftIcon={<BackButton />}
            style={{ marginBottom: spacingY._10 }}
          />
          {/* Search Input */}
          <ScrollView
            contentContainerStyle={styles.form}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
          >
            <View style={styles.inputContainer}>
              <Input
                placeholder="Search transactions..."
                value={search}
                placeholderTextColor={colors.neutral400}
                containerStyle={{ backgroundColor: colors.neutral800 }}
                onChangeText={setSearch}
              />
            </View>
            {/* Transactions List */}
            <TransactionList
              title=""
              emptyListMessage="No results found"
              data={filteredTransactions}
              loading={false}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ModalWrapper>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
    marginTop: verticalScale(8),
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
