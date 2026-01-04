import BackButton from "@/components/back-button";
import Button from "@/components/button";
import Input from "@/components/input";
import ScreenWrapper from "@/components/screen-wrapper";
import Typo from "@/components/typo";
import VerificationTooltip from "@/components/verification-tooltip";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import { LoginFormData, loginSchema } from "@/schema/auth.schema";
import { checkEmailVerificationStatus } from "@/services/user.services";
import { verticalScale } from "@/utils/styling";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

type VerificationStatus = "idle" | "checking" | "verified" | "unverified";

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("idle");
  const [showTooltip, setShowTooltip] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const email = watch("email");

  const animateStatusIcon = useCallback(() => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.5);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const isValidEmail = useCallback((emailValue: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!email || !isValidEmail(email)) {
      setVerificationStatus("idle");
      return;
    }

    setVerificationStatus("checking");

    debounceRef.current = setTimeout(async () => {
      try {
        const result = await checkEmailVerificationStatus(email);
        if (result.exists) {
          setVerificationStatus(result.verified ? "verified" : "unverified");
          animateStatusIcon();
        } else {
          setVerificationStatus("idle");
        }
      } catch {
        setVerificationStatus("idle");
      }
    }, 800);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [email, isValidEmail, animateStatusIcon]);

  const renderVerificationIndicator = () => {
    if (verificationStatus === "idle") return null;

    if (verificationStatus === "checking") {
      return (
        <View style={styles.verificationIndicator}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      );
    }

    const isVerified = verificationStatus === "verified";
    return (
      <TouchableOpacity
        onPress={() => setShowTooltip(true)}
        activeOpacity={0.7}
      >
        <Animated.View
          style={[
            styles.verificationIndicator,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {isVerified ? (
            <Icons.CheckCircleIcon
              size={verticalScale(20)}
              color={colors.green}
              weight="fill"
            />
          ) : (
            <Icons.XCircleIcon
              size={verticalScale(20)}
              color={colors.rose}
              weight="fill"
            />
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const onSubmit = async (data: LoginFormData) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      Toast.show({
        type: "success",
        text1: "Welcome Back!",
        text2: "You have successfully logged in",
      });
      router.replace("/(tabs)");
    } else {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: result.msg,
      });
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <BackButton iconSize={28} />
          <View style={{ gap: 5, marginTop: spacingY._20 }}>
            <Typo size={30} fontWeight="800">
              Hey,
            </Typo>
            <Typo size={30} fontWeight="800">
              Welcome Back
            </Typo>
          </View>
          <View style={styles.form}>
            <Typo size={16} color={colors.textLighter}>
              Log in to securely manage and track your expenses
            </Typo>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <View style={styles.emailInputWrapper}>
                  <Input
                    label="Email Address"
                    placeholder="Enter your Email"
                    error={errors.email?.message}
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    icon={
                      <Icons.AtIcon
                        size={verticalScale(26)}
                        color={colors.neutral300}
                        weight="bold"
                      />
                    }
                  />
                  {renderVerificationIndicator()}
                </View>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Password"
                  placeholder="Enter your Password"
                  error={errors.password?.message}
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  autoCapitalize="none"
                  icon={
                    <Icons.LockIcon
                      size={verticalScale(26)}
                      color={colors.neutral300}
                      weight="bold"
                    />
                  }
                />
              )}
            />
            <Pressable onPress={() => router.push("/(auth)/forgot-password")}>
              <Typo
                size={14}
                color={colors.text}
                style={{ alignSelf: "flex-end" }}
              >
                Forgot Password?
              </Typo>
            </Pressable>
            <Button loading={isSubmitting} onPress={handleSubmit(onSubmit)}>
              <Typo fontWeight="700" color={colors.black} size={21}>
                Login
              </Typo>
            </Button>
          </View>
          <View style={styles.footer}>
            <Typo size={15}>Don&apos;t have an account?</Typo>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Typo size={15} fontWeight="700" color={colors.primary}>
                Register
              </Typo>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <VerificationTooltip
        visible={showTooltip}
        isVerified={verificationStatus === "verified"}
        onClose={() => setShowTooltip(false)}
      />
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._7,
    paddingBottom: spacingY._30,
  },
  form: {
    gap: spacingY._20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  emailInputWrapper: {
    position: "relative",
  },
  verificationIndicator: {
    position: "absolute",
    right: 12,
    bottom: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
