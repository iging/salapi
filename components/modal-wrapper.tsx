import { colors, spacingY } from "@/constants/theme";
import { ModalWrapperProps } from "@/types";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ModalWrapper = ({
  style,
  children,
  bg = colors.neutral800,
}: ModalWrapperProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: bg,
          paddingTop: insets.top,
          paddingBottom: insets.bottom + spacingY._10,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default ModalWrapper;
