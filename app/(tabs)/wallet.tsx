import Loading from "@/components/loading";
import ScreenWrapper from "@/components/screen-wrapper";
import Typo from "@/components/typo";
import WalletListItem from "@/components/wallet-list-item";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import useFetchData from "@/hooks/use-fetch-data";
import { WalletType } from "@/types";
import { toPeso } from "@/utils/currency";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { where } from "firebase/firestore";
import { PlusCircleIcon } from "phosphor-react-native";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

const Wallet = () => {
  const router = useRouter();
  const { user } = useAuth();

  const { data: wallets, loading } = useFetchData<WalletType>(
    "wallets",
    user?.uid ? [where("uid", "==", user.uid)] : []
  );

  const getTotalBalance = () => {
    return wallets.reduce((sum, wallet) => sum + (wallet.amount || 0), 0);
  };

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
          {loading && <Loading />}
          <FlatList
            data={wallets}
            renderItem={({ item, index }) => {
              return (
                <WalletListItem item={item} index={index} router={router} />
              );
            }}
            contentContainerStyle={styles.listStyle}
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
});
