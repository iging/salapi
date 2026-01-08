import Typo from "@/components/typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { VerificationTooltipProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import { CheckCircleIcon, XCircleIcon } from "phosphor-react-native";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const VerificationTooltip = ({
  visible,
  status,
  onClose,
  verifiedTitle = "Email Verified",
  unverifiedTitle = "Email Not Verified",
  notfoundTitle = "Account Not Found",
  verifiedMessage = "Your email address has been successfully verified. You can proceed to log in to your account.",
  unverifiedMessage = "Your email address has not been verified yet. Please check your inbox (including spam/junk folder) for the verification link we sent during registration.",
  notfoundMessage = "No account exists with this email address. Please check your email or create a new account.",
  buttonText = "Got it",
}: VerificationTooltipProps) => {
  const isVerified = status === "verified";
  const isNotFound = status === "notfound";

  const getTitle = () => {
    if (isVerified) return verifiedTitle;
    if (isNotFound) return notfoundTitle;
    return unverifiedTitle;
  };

  const getMessage = () => {
    if (isVerified) return verifiedMessage;
    if (isNotFound) return notfoundMessage;
    return unverifiedMessage;
  };

  const getColor = () => {
    return isVerified ? colors.green : colors.rose;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.container,
                {
                  borderColor: getColor(),
                },
              ]}
            >
              <View style={styles.header}>
                {isVerified ? (
                  <CheckCircleIcon
                    size={verticalScale(24)}
                    color={colors.green}
                    weight="fill"
                  />
                ) : (
                  <XCircleIcon
                    size={verticalScale(24)}
                    color={colors.rose}
                    weight="fill"
                  />
                )}
                <Typo size={16} fontWeight="700" color={getColor()}>
                  {getTitle()}
                </Typo>
              </View>
              <Typo size={14} color={colors.textLight} style={styles.message}>
                {getMessage()}
              </Typo>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: getColor(),
                  },
                ]}
                onPress={onClose}
              >
                <Typo size={14} fontWeight="600" color={colors.white}>
                  {buttonText}
                </Typo>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default VerificationTooltip;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacingX._20,
  },
  container: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._15,
    padding: spacingX._20,
    width: "100%",
    maxWidth: 340,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: spacingY._10,
  },
  message: {
    lineHeight: 22,
    marginBottom: spacingY._15,
  },
  button: {
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._20,
    borderRadius: radius._10,
    alignItems: "center",
  },
});
