import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { ChartBar, House, User, Wallet } from "phosphor-react-native";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

export default function CustomTabs({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const tabbarIcons: Record<string, (isFocused: boolean) => React.ReactNode> = {
    index: (isFocused) => (
      <House
        size={verticalScale(30)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    statistics: (isFocused) => (
      <ChartBar
        size={verticalScale(30)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    wallet: (isFocused) => (
      <Wallet
        size={verticalScale(30)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    profile: (isFocused) => (
      <User
        size={verticalScale(30)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
  };

  return (
    <View style={styles.tabbarWrapper}>
      <View style={styles.tabbar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabbarItem}
            >
              {tabbarIcons[route.name]?.(isFocused)}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabbarWrapper: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? spacingY._25 : spacingY._15,
    left: spacingX._20,
    right: spacingX._20,
  },
  tabbar: {
    flexDirection: "row",
    backgroundColor: colors.neutral800,
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: spacingY._5,
    borderRadius: radius._30,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  tabbarItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacingX._10,
  },
});
