import { colors, spacingY } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

const PrivacyDivider = () => <View style={styles.divider} />;

export default PrivacyDivider;

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.neutral700,
    marginVertical: spacingY._15,
  },
});
