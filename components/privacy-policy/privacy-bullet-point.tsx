import Typo from "@/components/typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { PrivacyBulletPointProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import { StyleSheet, View } from "react-native";

const PrivacyBulletPoint = ({ text, subText }: PrivacyBulletPointProps) => (
  <View style={styles.bulletContainer}>
    <View style={styles.bullet} />
    <View style={styles.bulletTextContainer}>
      <Typo size={14} color={colors.neutral200} style={styles.bulletText}>
        {text}
      </Typo>
      {subText && (
        <Typo size={12} color={colors.neutral400} style={styles.subText}>
          {subText}
        </Typo>
      )}
    </View>
  </View>
);

export default PrivacyBulletPoint;

const styles = StyleSheet.create({
  bulletContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: spacingX._10,
    marginVertical: spacingY._5,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: verticalScale(6),
    marginRight: spacingX._10,
  },
  bulletTextContainer: {
    flex: 1,
  },
  bulletText: {
    lineHeight: verticalScale(20),
  },
  subText: {
    marginTop: spacingY._5,
    lineHeight: verticalScale(18),
  },
});
