import { colors } from "@/constants/theme";
import { ScreenWrapperProps } from "@/types";
import { StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          flex: 1,
          backgroundColor: colors.neutral900,
        },
        style,
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral900} />
      {children}
    </View>
  );
};

export default ScreenWrapper;
