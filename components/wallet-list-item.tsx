import { colors, radius, spacingX } from "@/constants/theme";
import { WalletType } from "@/types";
import { toPeso } from "@/utils/currency";
import { verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { Router } from "expo-router";
import { CaretRightIcon, WalletIcon } from "phosphor-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Typo from "./typo";

const WalletListItem = ({
  item,
  index,
  router,
}: {
  item: WalletType;
  index: number;
  router: Router;
}) => {
  const openWallet = () => {
    router.push({
      pathname: "/(modals)/wallet-modal",
      params: {
        id: item?.id,
        name: item?.name,
        image: item?.image,
      },
    });
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)
        .springify()
        .damping(13)}
    >
      <TouchableOpacity style={styles.container} onPress={openWallet}>
        <View style={styles.imageContainer}>
          {item?.image ? (
            <Image
              style={{ flex: 1 }}
              source={item.image}
              contentFit="cover"
              transition={100}
            />
          ) : (
            <View style={styles.fallbackIcon}>
              <WalletIcon
                size={verticalScale(24)}
                weight="fill"
                color={colors.white}
              />
            </View>
          )}
        </View>
        <View style={styles.nameContainer}>
          <Typo size={16}>{item?.name}</Typo>
          <Typo size={16} color={colors.neutral400}>
            {toPeso(item?.amount ?? 0)}
          </Typo>
        </View>
        <CaretRightIcon
          size={verticalScale(20)}
          weight="bold"
          color={colors.white}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default WalletListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(17),
    padding: spacingX._15,
  },
  imageContainer: {
    height: verticalScale(45),
    width: verticalScale(45),
    borderWidth: 1,
    borderColor: colors.neutral600,
    borderRadius: radius._12,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  fallbackIcon: {
    flex: 1,
    backgroundColor: colors.neutral700,
    justifyContent: "center",
    alignItems: "center",
  },
  nameContainer: {
    flex: 1,
    gap: 2,
    marginLeft: spacingX._10,
  },
});
