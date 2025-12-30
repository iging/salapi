import BackButton from "@/components/back-button";
import Button from "@/components/button";
import Input from "@/components/input";
import ScreenWrapper from "@/components/screen-wrapper";
import Typo from "@/components/typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import { LoginFormData, loginSchema } from "@/schema/auth.schema";
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

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

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
            <Typo
              size={14}
              color={colors.text}
              style={{ alignSelf: "flex-end" }}
            >
              Forgot Password?
            </Typo>
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
});
