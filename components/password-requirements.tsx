import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { Check, X } from "phosphor-react-native";
import { StyleSheet, View } from "react-native";
import Typo from "./typo";

interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements = ({ password }: PasswordRequirementsProps) => {
  const requirements = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter", met: /[a-z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
    {
      label: "Special character",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  if (!password) return null;

  return (
    <View style={styles.container}>
      {requirements.map((req, index) => (
        <View key={index} style={styles.requirement}>
          {req.met ? (
            <Check
              size={verticalScale(16)}
              color={colors.green}
              weight="bold"
            />
          ) : (
            <X size={verticalScale(16)} color={colors.rose} weight="bold" />
          )}
          <Typo size={12} color={req.met ? colors.green : colors.rose}>
            {req.label}
          </Typo>
        </View>
      ))}
    </View>
  );
};

export default PasswordRequirements;

const styles = StyleSheet.create({
  container: {
    gap: spacingY._7,
    paddingHorizontal: spacingX._5,
  },
  requirement: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._7,
  },
});
