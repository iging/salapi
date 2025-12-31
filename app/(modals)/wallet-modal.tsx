import BackButton from "@/components/back-button";
import Button from "@/components/button";
import Dialog from "@/components/dialog";
import Header from "@/components/header";
import ImageUpload from "@/components/image-upload";
import Input from "@/components/input";
import ModalWrapper from "@/components/modal-wrapper";
import Typo from "@/components/typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import { walletSchema } from "@/schema/wallet.schema";
import {
  createWallet,
  deleteWallet,
  updateWallet,
} from "@/services/wallet.services";
import { WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TrashIcon } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

const WalletModal = () => {
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const [walletImage, setWalletImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const oldWallet: { name: string; image: string; id: string } =
    useLocalSearchParams();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ name: string }>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      name: "",
    },
  });

  const goBack = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/wallet");
    }
  };

  useEffect(() => {
    if (oldWallet?.id) {
      setValue("name", oldWallet.name);
      setWalletImage(oldWallet.image);
    }
  }, [oldWallet?.id, oldWallet?.image, oldWallet?.name, setValue]);

  const onSubmit = async (data: { name: string }) => {
    if (!user?.uid) return;

    setLoading(true);

    const walletData: Partial<WalletType> = {
      name: data.name,
      image: walletImage,
    };

    let result;
    if (oldWallet?.id) {
      result = await updateWallet(oldWallet.id, walletData);
    } else {
      result = await createWallet(user.uid, walletData);
    }

    setLoading(false);

    if (result.success) {
      Toast.show({ type: "success", text1: result.msg });
      goBack();
    } else {
      Toast.show({ type: "error", text1: result.msg });
    }
  };

  const handleDelete = async () => {
    if (!oldWallet?.id) return;

    setShowDeleteDialog(false);
    setLoading(true);

    const result = await deleteWallet(oldWallet.id);

    setLoading(false);

    if (result.success) {
      Toast.show({ type: "success", text1: result.msg });
      goBack();
    } else {
      Toast.show({ type: "error", text1: result.msg });
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldWallet?.id ? "Update Wallet" : "New wallet"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        {/* Form */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Wallet Name"
                  placeholder="Enter wallet name"
                  value={value}
                  onChangeText={onChange}
                  error={errors.name?.message}
                />
              )}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo size={14} color={colors.white} fontWeight="500">
              Wallet Icon
            </Typo>
            <ImageUpload
              file={walletImage}
              onClear={() => setWalletImage(null)}
              onSelect={(file) => setWalletImage(file)}
              placeholder="Upload Image"
            />
          </View>
        </ScrollView>
      </View>
      {/* Footer */}
      <View style={styles.footer}>
        {oldWallet?.id && !loading && (
          <Button
            onPress={() => setShowDeleteDialog(true)}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <TrashIcon
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}
        <Button
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          style={{ flex: 1 }}
        >
          <Typo color={colors.black} fontWeight="700">
            {oldWallet?.id ? "Update Wallet" : "Add Wallet"}
          </Typo>
        </Button>
      </View>
      <Dialog
        visible={showDeleteDialog}
        title="Delete Wallet"
        message="Are you sure you want to delete this wallet? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor={colors.rose}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </ModalWrapper>
  );
};

export default WalletModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
    paddingVertical: spacingY._30,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
