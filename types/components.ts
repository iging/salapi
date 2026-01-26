import { ComponentType, ReactNode, RefObject } from "react";
import {
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

export type accountOptionType = {
  title: string;
  icon: ReactNode;
  bgColor: string;
  routeName?: any;
  category?: string;
};

export type TypoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: any | null;
  style?: TextStyle;
  textProps?: TextProps;
};

export type IconComponent = ComponentType<{
  height?: number;
  width?: number;
  strokeWidth?: number;
  color?: string;
  fill?: string;
}>;

export type IconProps = {
  name: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
  fill?: string;
};

export type HeaderProps = {
  title?: string;
  style?: ViewStyle;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export type BackButtonProps = {
  style?: ViewStyle;
  iconSize?: number;
  onPress?: () => void;
};

export interface InputProps extends TextInputProps {
  icon?: ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inputRef?: RefObject<TextInput>;
  label?: string;
  error?: string;
}

export interface CustomButtonProps extends TouchableOpacityProps {
  style?: ViewStyle;
  onPress?: () => void;
  loading?: boolean;
  children: ReactNode;
}

export type ImageUploadProps = {
  file?: any;
  onSelect: (file: any) => void;
  onClear: () => void;
  containerStyle?: ViewStyle;
  imageStyle?: ViewStyle;
  placeholder?: string;
};

export type DialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmColor?: string;
};

export type VerificationTooltipProps = {
  visible: boolean;
  status: "verified" | "unverified" | "notfound";
  onClose: () => void;
  verifiedTitle?: string;
  unverifiedTitle?: string;
  notfoundTitle?: string;
  verifiedMessage?: string;
  unverifiedMessage?: string;
  notfoundMessage?: string;
  buttonText?: string;
};
