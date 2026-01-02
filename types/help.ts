import { Icon } from "phosphor-react-native";

export type HelpSectionType = {
  id: string;
  title: string;
  icon: Icon;
  content: HelpContentItem[];
};

export type HelpContentItem = {
  heading?: string;
  text?: string;
  bullets?: string[];
};

export type HelpTopicType = {
  id: string;
  title: string;
  description: string;
};
