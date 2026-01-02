import { colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import {
  Animated,
  DimensionValue,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  variant?: "rect" | "circle";
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  /** Animation duration in ms. Default: 1200 */
  duration?: number;
  /** Whether to show shimmer animation. Default: true */
  animated?: boolean;
}

interface SkeletonGroupProps {
  direction?: "row" | "column";
  gap?: number;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Skeleton = ({
  width = "100%",
  height = 16,
  borderRadius = 8,
  variant = "rect",
  style,
  children,
  duration = 1200,
  animated = true,
}: SkeletonProps) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;

    const animation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      })
    );
    animation.start();

    return () => animation.stop();
  }, [shimmerAnim, duration, animated]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  const calculatedBorderRadius =
    variant === "circle" && typeof height === "number"
      ? height / 2
      : borderRadius;

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius: calculatedBorderRadius,
        },
        style,
      ]}
    >
      {animated && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <LinearGradient
            colors={[
              "transparent",
              colors.neutral600,
              colors.neutral500,
              colors.neutral600,
              "transparent",
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[
              StyleSheet.absoluteFill,
              { borderRadius: calculatedBorderRadius, opacity: 0.4 },
            ]}
          />
        </Animated.View>
      )}
      {children}
    </View>
  );
};

const SkeletonGroup = ({
  direction = "column",
  gap = 12,
  children,
  style,
}: SkeletonGroupProps) => {
  return (
    <View
      style={[
        {
          flexDirection: direction,
          gap,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

Skeleton.Group = SkeletonGroup;

export default Skeleton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral700,
    overflow: "hidden",
    position: "relative",
  },
});
