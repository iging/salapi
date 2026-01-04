import BackButton from "@/components/back-button";
import Button from "@/components/button";
import Input from "@/components/input";
import ScreenWrapper from "@/components/screen-wrapper";
import Typo from "@/components/typo";
import { auth } from "@/config/firebase";
import { colors, spacingX, spacingY } from "@/constants/theme";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/schema/auth.schema";
import { getAuthErrorMessage } from "@/utils/firebase-errors";
import { verticalScale } from "@/utils/styling";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import { AtIcon, EnvelopeIcon } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Toast from "react-native-toast-message";

const ForgotPassword = () => {
  const router = useRouter();
  const [emailSent, setEmailSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const MAX_RESEND_ATTEMPTS = 3;
  const COOLDOWN_SECONDS = 60;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      setEmailSent(true);
      setResendCooldown(COOLDOWN_SECONDS);
      Toast.show({
        type: "success",
        text1: "Email Sent",
        text2: "Check your inbox for password reset instructions",
      });
    } catch (error) {
      const firebaseError = error as FirebaseError;
      Toast.show({
        type: "error",
        text1: "Reset Failed",
        text2: getAuthErrorMessage(firebaseError.code),
      });
    }
  };

  const handleResend = async () => {
    // Check rate limiting
    if (resendCooldown > 0) {
      Toast.show({
        type: "error",
        text1: "Please Wait",
        text2: `You can resend in ${resendCooldown} seconds`,
      });
      return;
    }

    if (resendCount >= MAX_RESEND_ATTEMPTS) {
      Toast.show({
        type: "error",
        text1: "Too Many Attempts",
        text2: "Please try again later or contact support",
      });
      return;
    }

    const email = getValues("email");
    try {
      await sendPasswordResetEmail(auth, email);
      setResendCount(resendCount + 1);
      setResendCooldown(COOLDOWN_SECONDS);
      Toast.show({
        type: "success",
        text1: "Email Resent",
        text2: "Check your inbox for password reset instructions",
      });
    } catch (error) {
      const firebaseError = error as FirebaseError;
      Toast.show({
        type: "error",
        text1: "Resend Failed",
        text2: getAuthErrorMessage(firebaseError.code),
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

          {!emailSent ? (
            <>
              <View style={{ gap: 5, marginTop: spacingY._20 }}>
                <Typo size={30} fontWeight="800">
                  Forgot
                </Typo>
                <Typo size={30} fontWeight="800">
                  Password?
                </Typo>
              </View>

              <View style={styles.form}>
                <Typo size={16} color={colors.textLighter}>
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
                </Typo>

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Email Address"
                      placeholder="Enter your Email"
                      error={errors.email?.message}
                      value={value}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      icon={
                        <AtIcon
                          size={verticalScale(26)}
                          color={colors.neutral300}
                          weight="bold"
                        />
                      }
                    />
                  )}
                />

                <Button loading={isSubmitting} onPress={handleSubmit(onSubmit)}>
                  <Typo fontWeight="700" color={colors.black} size={21}>
                    Send Reset Link
                  </Typo>
                </Button>
              </View>
            </>
          ) : (
            <>
              <View style={styles.successContainer}>
                <View style={styles.iconContainer}>
                  <EnvelopeIcon
                    size={verticalScale(60)}
                    color={colors.primary}
                    weight="fill"
                  />
                </View>

                <View style={{ gap: 5, alignItems: "center" }}>
                  <Typo size={24} fontWeight="800">
                    Check Your Email
                  </Typo>
                  <Typo
                    size={14}
                    color={colors.textLighter}
                    style={{ textAlign: "center", marginTop: spacingY._10 }}
                  >
                    We&apos;ve sent a password reset link to{" "}
                    <Typo size={14} fontWeight="600" color={colors.white}>
                      {getValues("email")}
                    </Typo>
                  </Typo>
                  <Typo
                    size={13}
                    color={colors.neutral400}
                    style={{ textAlign: "center", marginTop: spacingY._15 }}
                  >
                    Click the link in the email to reset your password. If you
                    don&apos;t see it, check your spam folder.
                  </Typo>
                </View>

                <View style={styles.buttonGroup}>
                  <Button onPress={() => router.replace("/(auth)/login")}>
                    <Typo fontWeight="700" color={colors.black} size={18}>
                      Back to Login
                    </Typo>
                  </Button>

                  <Button
                    style={
                      {
                        ...styles.resendButton,
                        ...(resendCooldown > 0 ||
                        resendCount >= MAX_RESEND_ATTEMPTS
                          ? { opacity: 0.6 }
                          : {}),
                      } as ViewStyle
                    }
                    onPress={handleResend}
                  >
                    <Typo fontWeight="600" color={colors.white} size={16}>
                      {resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : resendCount >= MAX_RESEND_ATTEMPTS
                        ? "Max attempts reached"
                        : "Resend Email"}
                    </Typo>
                  </Button>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default ForgotPassword;

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
  successContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: spacingY._40,
    gap: spacingY._25,
  },
  iconContainer: {
    backgroundColor: colors.neutral800,
    padding: spacingX._20,
    borderRadius: 100,
  },
  buttonGroup: {
    width: "100%",
    gap: spacingY._12,
    marginTop: spacingY._20,
  },
  resendButton: {
    backgroundColor: colors.neutral700,
  },
});
