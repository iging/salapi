import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { DialogProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import Typo from "./typo";

const Dialog = ({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmColor = colors.primary,
}: DialogProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Typo size={20} fontWeight="700" color={colors.white}>
            {title}
          </Typo>
          <Typo size={14} color={colors.neutral300} style={styles.message}>
            {message}
          </Typo>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Typo size={14} fontWeight="600" color={colors.white}>
                {cancelText}
              </Typo>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: confirmColor }]}
              onPress={onConfirm}
            >
              <Typo size={14} fontWeight="600" color={colors.white}>
                {confirmText}
              </Typo>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Dialog;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacingX._20,
  },
  container: {
    width: "100%",
    backgroundColor: colors.neutral800,
    borderRadius: radius._17,
    padding: spacingX._20,
    paddingVertical: spacingY._25,
  },
  message: {
    marginTop: spacingY._10,
    lineHeight: verticalScale(20),
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: spacingY._25,
    gap: spacingX._12,
  },
  button: {
    flex: 1,
    paddingVertical: spacingY._12,
    borderRadius: radius._10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.neutral600,
  },
});
