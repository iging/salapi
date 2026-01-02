import { expenseCategories, incomeCategory } from "@/constants/data";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import {
  CategoryType,
  TransactionItemProps,
  TransactionListType,
  TransactionType,
} from "@/types";
import { toPeso } from "@/utils/currency";
import { verticalScale } from "@/utils/styling";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Loading from "./loading";
import Typo from "./typo";

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
  const router = useRouter();

  const handleClick = (item: TransactionType) => {
    router.push({
      pathname: "/(modals)/transaction-modal",
      params: {
        id: item.id,
        type: item.type,
        amount: String(item.amount),
        category: item.category || "",
        customCategory: item.customCategory || "",
        date: formatDateForParams(item.date),
        description: item.description || "",
        walletId: item.walletId,
        image: item.image || "",
      },
    });
  };

  return (
    <View style={styles.container}>
      {title && (
        <Typo size={20} fontWeight="500">
          {title}
        </Typo>
      )}
      <View style={styles.list}>
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <TransactionItem
              item={item}
              index={index}
              handleClick={handleClick}
            />
          )}
          keyExtractor={(item, index) => item.id || index.toString()}
          {...{ estimatedItemSize: 60 }}
        />
      </View>
      {!loading && data.length === 0 && (
        <Typo
          size={15}
          color={colors.neutral400}
          style={{ textAlign: "center", marginTop: spacingY._15 }}
        >
          {emptyListMessage}
        </Typo>
      )}
      {loading && (
        <View style={{ top: verticalScale(100) }}>
          <Loading />
        </View>
      )}
    </View>
  );
};

const getCategory = (item: TransactionType): CategoryType => {
  if (item.type === "income") {
    return incomeCategory;
  }
  return (
    expenseCategories[item.category || "others"] || expenseCategories.others
  );
};

const toDate = (date: Date | Timestamp | string): Date => {
  if (date instanceof Timestamp) {
    return date.toDate();
  } else if (typeof date === "string") {
    return new Date(date);
  }
  return date;
};

const formatDate = (date: Date | Timestamp | string): string => {
  return moment(toDate(date)).format("MMM D");
};

const formatDateForParams = (date: Date | Timestamp | string): string => {
  return moment(toDate(date)).toISOString();
};

const TransactionItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {
  const category = getCategory(item);
  const IconComponent = category.icon;
  const isExpense = item.type === "expense";

  // Display custom category name if category is "others" and customCategory exists
  const displayLabel =
    item.category === "others" && item.customCategory
      ? item.customCategory
      : category.label;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 70)
        .springify()
        .damping(14)}
    >
      <TouchableOpacity style={styles.row} onPress={() => handleClick(item)}>
        <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
          <IconComponent
            size={verticalScale(25)}
            weight="fill"
            color={colors.white}
          />
        </View>
        <View style={styles.categoryDes}>
          <Typo size={17}>{displayLabel}</Typo>
          <Typo
            size={12}
            color={colors.neutral400}
            textProps={{ numberOfLines: 1 }}
          >
            {item?.description || "No description"}
          </Typo>
        </View>
        <View style={styles.amountDate}>
          <Typo fontWeight="500" color={isExpense ? colors.rose : colors.green}>
            {isExpense ? "- " : "+ "}
            {toPeso(item.amount)}
          </Typo>
          <Typo size={13} color={colors.neutral400}>
            {formatDate(item.date)}
          </Typo>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._17,
  },
  list: {
    minHeight: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacingX._12,
    marginBottom: spacingY._12,
    backgroundColor: colors.neutral800,
    padding: spacingY._10,
    paddingHorizontal: spacingY._10,
    borderRadius: radius._17,
  },
  icon: {
    height: verticalScale(44),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._12,
    borderCurve: "continuous",
  },
  categoryDes: {
    flex: 1,
    gap: 2.5,
  },
  amountDate: {
    alignItems: "flex-end",
    gap: 3,
  },
});
