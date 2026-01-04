import BackButton from "@/components/back-button";
import Button from "@/components/button";
import Input from "@/components/input";
import PasswordRequirements from "@/components/password-requirements";
import ScreenWrapper from "@/components/screen-wrapper";
import Typo from "@/components/typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import { RegisterFormData, registerSchema } from "@/schema/auth.schema";
import { verticalScale } from "@/utils/styling";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const Register = () => {
  const router = useRouter();
  const { register } = useAuth();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    const result = await register(
      data.name,
      data.email,
      data.password,
      data.confirmPassword
    );
    if (result.success) {
      Toast.show({
        type: "success",
        text1: "Account Created!",
        text2:
          result.msg ||
          "Please check your email (including spam/junk folder) to verify your account",
        visibilityTime: 7000,
      });
      router.push("/(auth)/login");
    } else {
      Toast.show({
        type: "error",
        text1: "Registration Failed",
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
              Let&apos;s,
            </Typo>
            <Typo size={30} fontWeight="800">
              Get Started
            </Typo>
          </View>
          <View style={styles.form}>
            <Typo size={16} color={colors.textLighter}>
              Create an account to manage and track your expenses securely
            </Typo>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Name"
                  placeholder="Enter your Name"
                  error={errors.name?.message}
                  value={value}
                  onChangeText={onChange}
                  icon={
                    <Icons.UserIcon
                      size={verticalScale(26)}
                      color={colors.neutral300}
                      weight="bold"
                    />
                  }
                />
              )}
            />
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
                    <Icons.AtIcon
                      size={verticalScale(26)}
                      color={colors.neutral300}
                      weight="bold"
                    />
                  }
                />
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
            <PasswordRequirements password={password} />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Confirm Password"
                  placeholder="Confirm your Password"
                  error={errors.confirmPassword?.message}
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
            <Button loading={isSubmitting} onPress={handleSubmit(onSubmit)}>
              <Typo fontWeight="700" color={colors.black} size={21}>
                Sign Up
              </Typo>
            </Button>
          </View>
          <View style={styles.footer}>
            <Typo size={15}>Already have an account?</Typo>
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Typo size={15} fontWeight="700" color={colors.primary}>
                Login
              </Typo>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default Register;

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
});
