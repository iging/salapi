import { ReactNode } from "react";

export type PrivacySectionProps = {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
};

export type PrivacyBulletPointProps = {
  text: string;
  subText?: string;
};

export type PrivacyDataTableRowProps = {
  dataType: string;
  purpose: string;
};
