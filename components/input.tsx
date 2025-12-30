import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { InputProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import { Eye, EyeSlash } from "phosphor-react-native";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Input = (props: InputProps) => {
  const [isSecure, setIsSecure] = useState(props.secureTextEntry);

  const toggleSecure = () => setIsSecure(!isSecure);

  return (
    <View style={styles.wrapper}>
      {props.label && <Text style={styles.label}>{props.label}</Text>}
      <View
        style={[
          styles.container,
          props.error && styles.errorContainer,
          props.containerStyle,
        ]}
      >
        {props.icon && props.icon}
        <TextInput
          style={[styles.input, props.inputStyle]}
          placeholderTextColor={colors.neutral400}
          ref={props.inputRef}
          {...props}
          secureTextEntry={isSecure}
        />
        {props.secureTextEntry && (
          <TouchableOpacity onPress={toggleSecure}>
            {isSecure ? (
              <EyeSlash
                size={verticalScale(22)}
                color={colors.neutral400}
                weight="regular"
              />
            ) : (
              <Eye
                size={verticalScale(22)}
                color={colors.neutral400}
                weight="regular"
              />
            )}
          </TouchableOpacity>
        )}
      </View>
      {props.error && <Text style={styles.error}>{props.error}</Text>}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  wrapper: {
    gap: spacingY._7,
  },
  label: {
    color: colors.white,
    fontSize: verticalScale(14),
    fontWeight: "500",
  },
  container: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
    gap: spacingX._10,
  },
  errorContainer: {
    borderColor: colors.rose,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: verticalScale(14),
  },
  error: {
    color: colors.rose,
    fontSize: verticalScale(12),
  },
});
