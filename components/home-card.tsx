import { colors, spacingX, spacingY } from "@/constants/theme";
import { toPeso } from "@/utils/currency";
import { scale, verticalScale } from "@/utils/styling";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DotsThreeOutlineIcon,
} from "phosphor-react-native";
import { ImageBackground, StyleSheet, View } from "react-native";
import Typo from "./typo";

type HomeCardProps = {
  totalBalance?: number;
  totalIncome?: number;
  totalExpense?: number;
};

const HomeCard = ({
  totalBalance = 0,
  totalIncome = 0,
  totalExpense = 0,
}: HomeCardProps) => {
  return (
    <ImageBackground
      source={require("../assets/images/card.png")}
      resizeMode="stretch"
      style={styles.bgImage}
    >
      <View style={styles.container}>
        <View>
          {/* Total Balance */}
          <View style={styles.totalBalanceRow}>
            <Typo size={17} color={colors.neutral800} fontWeight="500">
              Total Balance
            </Typo>
            <DotsThreeOutlineIcon
              size={verticalScale(23)}
              color={colors.black}
              weight="fill"
            />
          </View>
          <Typo size={30} color={colors.black} fontWeight="bold">
            {toPeso(totalBalance)}
          </Typo>
        </View>
        {/* Total expense and income */}
        <View style={styles.stats}>
          {/* Income */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <ArrowDownIcon
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight="500">
                Income
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={17} color={colors.green} fontWeight="600">
                {toPeso(totalIncome)}
              </Typo>
            </View>
          </View>
          {/* Expense */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <ArrowUpIcon
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight="500">
                Expense
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={17} color={colors.rose} fontWeight="600">
                {toPeso(totalExpense)}
              </Typo>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  bgImage: {
    height: scale(210),
    width: "100%",
  },
  container: {
    padding: spacingX._20,
    paddingHorizontal: scale(23),
    height: "87%",
    width: "100%",
    justifyContent: "space-between",
  },
  totalBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._5,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsIcon: {
    backgroundColor: colors.neutral350,
    padding: spacingY._5,
    borderRadius: 50,
  },
  incomeExpense: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingY._7,
  },
});
