import { ReactNode } from "react";
import { ViewStyle } from "react-native";

export type ScreenWrapperProps = {
  style?: ViewStyle;
  children: ReactNode;
};

export type ModalWrapperProps = {
  style?: ViewStyle;
  children: ReactNode;
  bg?: string;
};

export type ResponseType = {
  success: boolean;
  data?: any;
  msg?: string;
};
