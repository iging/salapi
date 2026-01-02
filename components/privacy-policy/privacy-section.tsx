import Typo from "@/components/typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { PrivacySectionProps } from "@/types";
import { StyleSheet, View } from "react-native";

const PrivacySection = ({ title, icon, children }: PrivacySectionProps) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      {icon}
      <Typo size={18} fontWeight="700" color={colors.neutral100}>
        {title}
      </Typo>
    </View>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

export default PrivacySection;

const styles = StyleSheet.create({
  section: {
    marginBottom: spacingY._20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    marginBottom: spacingY._12,
  },
  sectionContent: {
    gap: spacingY._7,
  },
});
