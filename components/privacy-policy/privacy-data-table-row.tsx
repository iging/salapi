import Typo from "@/components/typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { PrivacyDataTableRowProps } from "@/types";
import { StyleSheet, View } from "react-native";

const PrivacyDataTableRow = ({
  dataType,
  purpose,
}: PrivacyDataTableRowProps) => (
  <View style={styles.tableRow}>
    <View style={styles.tableCell}>
      <Typo size={13} fontWeight="600" color={colors.neutral200}>
        {dataType}
      </Typo>
    </View>
    <View style={styles.tableCellWide}>
      <Typo size={13} color={colors.neutral300}>
        {purpose}
      </Typo>
    </View>
  </View>
);

export default PrivacyDataTableRow;

const styles = StyleSheet.create({
  tableRow: {
    flexDirection: "row",
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._12,
    borderTopWidth: 1,
    borderTopColor: colors.neutral700,
  },
  tableCell: {
    flex: 1,
  },
  tableCellWide: {
    flex: 2,
  },
});
