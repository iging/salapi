import Skeleton from "@/components/skeleton";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { StyleSheet, View } from "react-native";

/**
 * Skeleton for Wallet Tab (wallet.tsx)
 * Mirrors exact layout: Balance View, My Wallets header, Wallet List items
 */
const WalletSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Balance View */}
      <View style={styles.balanceView}>
        <View style={{ alignItems: "center", gap: spacingY._10 }}>
          <Skeleton width={scale(200)} height={verticalScale(45)} />
          <Skeleton width={scale(100)} height={verticalScale(16)} />
        </View>
      </View>

      {/* Wallet Section */}
      <View style={styles.wallet}>
        {/* Header */}
        <View style={styles.walletHeader}>
          <Skeleton width={scale(100)} height={verticalScale(20)} />
          <Skeleton
            width={verticalScale(33)}
            height={verticalScale(33)}
            variant="circle"
          />
        </View>

        {/* Wallet List */}
        <View style={styles.walletList}>
          {Array.from({ length: 4 }).map((_, index) => (
            <WalletItemSkeleton key={index} />
          ))}
        </View>
      </View>
    </View>
  );
};

/**
 * Single Wallet Item Skeleton
 * Mirrors: Image/Icon, Name, Amount, Caret
 */
const WalletItemSkeleton = () => {
  return (
    <View style={styles.walletItem}>
      {/* Wallet Image/Icon */}
      <Skeleton
        width={verticalScale(45)}
        height={verticalScale(45)}
        borderRadius={radius._12}
      />

      {/* Name & Amount */}
      <View style={styles.walletInfo}>
        <Skeleton width={scale(100)} height={verticalScale(16)} />
        <Skeleton width={scale(80)} height={verticalScale(16)} />
      </View>

      {/* Caret Icon */}
      <Skeleton
        width={verticalScale(20)}
        height={verticalScale(20)}
        borderRadius={4}
      />
    </View>
  );
};

export default WalletSkeleton;

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
  wallet: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25,
  },
  walletHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  walletList: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15,
  },
  walletItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(17),
    padding: spacingX._15,
    gap: spacingX._10,
  },
  walletInfo: {
    flex: 1,
    gap: 2,
  },
});
