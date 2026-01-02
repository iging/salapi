import BackButton from "@/components/back-button";
import Button from "@/components/button";
import Dialog from "@/components/dialog";
import Header from "@/components/header";
import ImageUpload from "@/components/image-upload";
import Input from "@/components/input";
import ModalWrapper from "@/components/modal-wrapper";
import { TransactionModalSkeleton } from "@/components/skeletons";
import Typo from "@/components/typo";
import { expenseCategories, transactionTypes } from "@/constants/data";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import useFetchData from "@/hooks/use-fetch-data";
import {
  TransactionFormData,
  transactionSchema,
} from "@/schema/transaction.schema";
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "@/services/transaction.services";
import { TransactionType, WalletType } from "@/types";
import { toPeso } from "@/utils/currency";
import { scale, verticalScale } from "@/utils/styling";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { where } from "firebase/firestore";
import { TrashIcon } from "phosphor-react-native";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Toast from "react-native-toast-message";

const TransactionModal = () => {
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const [transactionImage, setTransactionImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const walletConstraints = useMemo(
    () => (user?.uid ? [where("uid", "==", user.uid)] : []),
    [user?.uid]
  );

  const { data: wallets, loading: walletsLoading } = useFetchData<WalletType>(
    "wallets",
    walletConstraints
  );

  const oldTransaction: {
    id?: string;
    type?: string;
    amount?: string;
    category?: string;
    customCategory?: string;
    date?: string;
    description?: string;
    walletId?: string;
    image?: string;
  } = useLocalSearchParams();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      amount: 0,
      category: "",
      customCategory: "",
      date: new Date(),
      description: "",
      walletId: "",
    },
  });

  const transactionType = watch("type");
  const selectedCategory = watch("category");

  const goBack = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  useEffect(() => {
    if (oldTransaction?.id) {
      setValue(
        "type",
        (oldTransaction.type as "income" | "expense") || "expense"
      );
      setValue("amount", Number(oldTransaction.amount) || 0);
      setValue("category", oldTransaction.category || "");
      setValue("customCategory", oldTransaction.customCategory || "");
      setValue(
        "date",
        oldTransaction.date ? new Date(oldTransaction.date) : new Date()
      );
      setValue("description", oldTransaction.description || "");
      setValue("walletId", oldTransaction.walletId || "");
      setTransactionImage(oldTransaction.image || null);
    }
  }, [
    oldTransaction?.id,
    oldTransaction?.amount,
    oldTransaction?.category,
    oldTransaction?.customCategory,
    oldTransaction?.date,
    oldTransaction?.description,
    oldTransaction?.image,
    oldTransaction?.type,
    oldTransaction?.walletId,
    setValue,
  ]);

  const onSubmit = async (data: TransactionFormData) => {
    if (!user?.uid) return;

    // Validate expense doesn't exceed wallet balance
    if (data.type === "expense") {
      const selectedWallet = wallets.find((w) => w.id === data.walletId);
      const walletBalance = selectedWallet?.amount ?? 0;

      // For updates, add back the old amount if it was an expense from the same wallet
      let availableBalance = walletBalance;
      if (
        oldTransaction?.id &&
        oldTransaction?.walletId === data.walletId &&
        oldTransaction?.type === "expense"
      ) {
        availableBalance += Number(oldTransaction.amount) || 0;
      }

      if (data.amount > availableBalance) {
        Toast.show({
          type: "error",
          text1: "Insufficient balance",
          text2: `Wallet only has ${toPeso(availableBalance)} available`,
        });
        return;
      }
    }

    setLoading(true);

    const transactionData: Partial<TransactionType> = {
      type: data.type,
      amount: data.amount,
      category: data.type === "income" ? "income" : data.category,
      customCategory: data.category === "others" ? data.customCategory : "",
      date: data.date,
      description: data.description,
      walletId: data.walletId,
      image: transactionImage,
    };

    let result;
    if (oldTransaction?.id) {
      // Pass old transaction data for balance reversal
      const oldTransactionData: Partial<TransactionType> = {
        walletId: oldTransaction.walletId,
        amount: Number(oldTransaction.amount),
        type: oldTransaction.type,
      };
      result = await updateTransaction(
        oldTransaction.id,
        transactionData,
        oldTransactionData
      );
    } else {
      result = await createTransaction(user.uid, transactionData);
    }

    setLoading(false);

    if (result.success) {
      Toast.show({ type: "success", text1: result.msg });
      goBack();
    } else {
      Toast.show({ type: "error", text1: result.msg });
    }
  };

  const handleDelete = async () => {
    if (!oldTransaction?.id) return;

    setShowDeleteDialog(false);
    setLoading(true);

    const result = await deleteTransaction(
      oldTransaction.id,
      oldTransaction.walletId,
      Number(oldTransaction.amount),
      oldTransaction.type
    );

    setLoading(false);

    if (result.success) {
      Toast.show({ type: "success", text1: result.msg });
      goBack();
    } else {
      Toast.show({ type: "error", text1: result.msg });
    }
  };

  const categoryOptions = Object.values(expenseCategories).map((cat) => ({
    label: cat.label,
    value: cat.value,
  }));

  const walletOptions = wallets.map((wallet) => ({
    label: `${wallet.name} (${toPeso(wallet.amount ?? 0)})`,
    value: wallet.id || "",
  }));

  // Show skeleton while wallets are loading
  if (walletsLoading) {
    return (
      <ModalWrapper>
        <TransactionModalSkeleton />
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <Header
            title={
              oldTransaction?.id ? "Update Transaction" : "New Transaction"
            }
            leftIcon={<BackButton />}
            style={{ marginBottom: spacingY._10 }}
          />
          <ScrollView
            contentContainerStyle={styles.form}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Transaction Type */}
            <View style={styles.inputContainer}>
              <Typo size={14} color={colors.white} fontWeight="500">
                Transaction Type
              </Typo>
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    style={styles.dropdownContainer}
                    data={transactionTypes}
                    labelField="label"
                    valueField="value"
                    value={value}
                    onChange={(item) => onChange(item.value)}
                    placeholder="Select type"
                    placeholderStyle={styles.dropdownPlaceholder}
                    selectedTextStyle={styles.dropdownSelectText}
                    containerStyle={styles.dropdownListContainer}
                    itemTextStyle={styles.dropdownItemText}
                    itemContainerStyle={styles.dropdownItemContainer}
                    activeColor={colors.neutral700}
                  />
                )}
              />
              {errors.type && (
                <Typo size={12} color={colors.rose}>
                  {errors.type.message}
                </Typo>
              )}
            </View>

            {/* Amount */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="amount"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Amount"
                    placeholder="Enter amount"
                    keyboardType="numeric"
                    value={value ? String(value) : ""}
                    onChangeText={(text) => onChange(Number(text) || 0)}
                    error={errors.amount?.message}
                  />
                )}
              />
            </View>

            {/* Category (only for expense) */}
            {transactionType === "expense" && (
              <View style={styles.inputContainer}>
                <Typo size={14} color={colors.white} fontWeight="500">
                  Category
                </Typo>
                <Controller
                  control={control}
                  name="category"
                  render={({ field: { onChange, value } }) => (
                    <Dropdown
                      style={styles.dropdownContainer}
                      data={categoryOptions}
                      labelField="label"
                      valueField="value"
                      value={value}
                      onChange={(item) => onChange(item.value)}
                      placeholder="Select category"
                      placeholderStyle={styles.dropdownPlaceholder}
                      selectedTextStyle={styles.dropdownSelectText}
                      containerStyle={styles.dropdownListContainer}
                      itemTextStyle={styles.dropdownItemText}
                      itemContainerStyle={styles.dropdownItemContainer}
                      activeColor={colors.neutral700}
                    />
                  )}
                />
                {/* Custom Category Input (when "others" is selected) */}
                {selectedCategory === "others" && (
                  <Controller
                    control={control}
                    name="customCategory"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Specify category (e.g., Pet supplies)"
                        value={value || ""}
                        onChangeText={onChange}
                        error={errors.customCategory?.message}
                      />
                    )}
                  />
                )}
              </View>
            )}

            {/* Wallet */}
            <View style={styles.inputContainer}>
              <Typo size={14} color={colors.white} fontWeight="500">
                Wallet
              </Typo>
              {walletOptions.length === 0 ? (
                <TouchableOpacity
                  style={styles.emptyWalletContainer}
                  onPress={() => router.push("/(modals)/wallet-modal")}
                >
                  <Typo size={14} color={colors.neutral400}>
                    No wallets found. Tap to create one.
                  </Typo>
                </TouchableOpacity>
              ) : (
                <Controller
                  control={control}
                  name="walletId"
                  render={({ field: { onChange, value } }) => (
                    <Dropdown
                      style={styles.dropdownContainer}
                      data={walletOptions}
                      labelField="label"
                      valueField="value"
                      value={value}
                      onChange={(item) => onChange(item.value)}
                      placeholder="Select wallet"
                      placeholderStyle={styles.dropdownPlaceholder}
                      selectedTextStyle={styles.dropdownSelectText}
                      containerStyle={styles.dropdownListContainer}
                      itemTextStyle={styles.dropdownItemText}
                      itemContainerStyle={styles.dropdownItemContainer}
                      activeColor={colors.neutral700}
                    />
                  )}
                />
              )}
              {errors.walletId && (
                <Typo size={12} color={colors.rose}>
                  {errors.walletId.message}
                </Typo>
              )}
            </View>

            {/* Date */}
            <View style={styles.inputContainer}>
              <Typo size={14} color={colors.white} fontWeight="500">
                Date
              </Typo>
              <Controller
                control={control}
                name="date"
                render={({ field: { onChange, value } }) => (
                  <>
                    <Button
                      style={styles.dateInput}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Typo color={colors.white}>
                        {value.toLocaleDateString()}
                      </Typo>
                    </Button>
                    {showDatePicker && (
                      <DateTimePicker
                        value={value}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(
                          event: DateTimePickerEvent,
                          selectedDate?: Date
                        ) => {
                          setShowDatePicker(Platform.OS === "ios");
                          if (selectedDate) {
                            onChange(selectedDate);
                          }
                        }}
                      />
                    )}
                  </>
                )}
              />
              {errors.date && (
                <Typo size={12} color={colors.rose}>
                  {errors.date.message}
                </Typo>
              )}
            </View>

            {/* Description */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Description (optional)"
                    placeholder="Enter description"
                    value={value || ""}
                    onChangeText={onChange}
                    multiline
                    containerStyle={{
                      height: verticalScale(100),
                      alignItems: "flex-start",
                      paddingVertical: spacingY._10,
                    }}
                    inputStyle={{
                      textAlignVertical: "top",
                    }}
                    error={errors.description?.message}
                  />
                )}
              />
            </View>

            {/* Image */}
            <View style={styles.inputContainer}>
              <Typo size={14} color={colors.white} fontWeight="500">
                Receipt (optional)
              </Typo>
              <ImageUpload
                file={transactionImage}
                onClear={() => setTransactionImage(null)}
                onSelect={(file) => setTransactionImage(file)}
                placeholder="Upload Receipt"
              />
            </View>
          </ScrollView>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {oldTransaction?.id && !loading && (
            <Button
              onPress={() => setShowDeleteDialog(true)}
              style={{
                backgroundColor: colors.rose,
                paddingHorizontal: spacingX._15,
              }}
            >
              <TrashIcon
                color={colors.white}
                size={verticalScale(24)}
                weight="bold"
              />
            </Button>
          )}
          <Button
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={{ flex: 1 }}
          >
            <Typo color={colors.black} fontWeight="700">
              {oldTransaction?.id ? "Update Transaction" : "Add Transaction"}
            </Typo>
          </Button>
        </View>
      </KeyboardAvoidingView>

      <Dialog
        visible={showDeleteDialog}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor={colors.rose}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
    marginTop: verticalScale(8),
  },
  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  dropdownItemText: {
    color: colors.white,
  },
  dropdownSelectText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropdownPlaceholder: {
    color: colors.neutral400,
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  searchInput: {
    color: colors.white,
    borderColor: colors.neutral500,
    borderRadius: radius._10,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
    backgroundColor: "transparent",
  },
  emptyWalletContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderStyle: "dashed",
    borderRadius: radius._15,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacingX._15,
  },
});
