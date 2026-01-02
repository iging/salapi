import BackButton from "@/components/back-button";
import Header from "@/components/header";
import ModalWrapper from "@/components/modal-wrapper";
import Typo from "@/components/typo";
import { helpSections } from "@/constants/help-content";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { HelpContentItem } from "@/types";
import { verticalScale } from "@/utils/styling";
import { CaretDownIcon } from "phosphor-react-native";
import { useState } from "react";
import {
  Animated,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const HelpCenterModal = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "getting-started"
  );

  const toggleSection = (sectionId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection((prev) => (prev === sectionId ? null : sectionId));
  };

  const isExpanded = (sectionId: string) => expandedSection === sectionId;

  const renderContentItem = (item: HelpContentItem, index: number) => {
    return (
      <View key={index} style={styles.contentItem}>
        {item.heading && (
          <Typo
            size={14}
            fontWeight="600"
            color={colors.white}
            style={styles.heading}
          >
            {item.heading}
          </Typo>
        )}
        {item.text && (
          <Typo size={13} color={colors.neutral300} style={styles.text}>
            {item.text}
          </Typo>
        )}
        {item.bullets && (
          <View style={styles.bulletList}>
            {item.bullets.map((bullet, bulletIndex) => (
              <View key={bulletIndex} style={styles.bulletItem}>
                <View style={styles.bulletDot} />
                <Typo
                  size={13}
                  color={colors.neutral300}
                  style={styles.bulletText}
                >
                  {bullet}
                </Typo>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Help Center"
          leftIcon={<BackButton iconSize={26} />}
          style={styles.header}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Introduction */}
          <View style={styles.introSection}>
            <Typo size={14} color={colors.neutral400} style={styles.introText}>
              Find answers to common questions and learn how to get the most out
              of Salapi.
            </Typo>
          </View>

          {/* Accordion Sections */}
          <View style={styles.accordionContainer}>
            {helpSections.map((section) => {
              const IconComponent = section.icon;
              const expanded = isExpanded(section.id);

              return (
                <View key={section.id} style={styles.accordionItem}>
                  {/* Accordion Header */}
                  <TouchableOpacity
                    style={[
                      styles.accordionHeader,
                      expanded && styles.accordionHeaderExpanded,
                    ]}
                    onPress={() => toggleSection(section.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.accordionHeaderLeft}>
                      <View
                        style={[
                          styles.iconContainer,
                          expanded && styles.iconContainerExpanded,
                        ]}
                      >
                        <IconComponent
                          size={verticalScale(20)}
                          color={expanded ? colors.neutral900 : colors.primary}
                          weight="fill"
                        />
                      </View>
                      <Typo
                        size={15}
                        fontWeight="600"
                        color={colors.white}
                        style={styles.accordionTitle}
                      >
                        {section.title}
                      </Typo>
                    </View>
                    <Animated.View
                      style={[
                        styles.caretContainer,
                        expanded && styles.caretContainerExpanded,
                      ]}
                    >
                      <CaretDownIcon
                        size={verticalScale(18)}
                        color={colors.neutral400}
                        weight="bold"
                      />
                    </Animated.View>
                  </TouchableOpacity>

                  {/* Accordion Content */}
                  {expanded && (
                    <View style={styles.accordionContent}>
                      {section.content.map((item, index) =>
                        renderContentItem(item, index)
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Contact Section */}
          <View style={styles.contactSection}>
            <Typo
              size={13}
              color={colors.neutral500}
              style={styles.contactText}
            >
              Still need help? Check for app updates that may address your
              question or contact support for assistance.
            </Typo>
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default HelpCenterModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  header: {
    marginTop: spacingY._10,
    marginBottom: spacingY._10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacingY._40,
  },
  introSection: {
    marginBottom: spacingY._20,
  },
  introText: {
    lineHeight: verticalScale(22),
  },
  accordionContainer: {
    gap: spacingY._10,
  },
  accordionItem: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacingX._15,
    paddingVertical: spacingY._15,
  },
  accordionHeaderExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral800,
  },
  accordionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: verticalScale(38),
    height: verticalScale(38),
    borderRadius: radius._10,
    backgroundColor: colors.neutral800,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacingX._12,
  },
  iconContainerExpanded: {
    backgroundColor: colors.primary,
  },
  accordionTitle: {
    flex: 1,
  },
  caretContainer: {
    transform: [{ rotate: "0deg" }],
  },
  caretContainerExpanded: {
    transform: [{ rotate: "180deg" }],
  },
  accordionContent: {
    padding: spacingX._15,
    paddingTop: spacingY._15,
    paddingBottom: spacingY._20,
  },
  contentItem: {
    marginBottom: spacingY._15,
  },
  heading: {
    marginBottom: spacingY._7,
  },
  text: {
    lineHeight: verticalScale(20),
  },
  bulletList: {
    marginTop: spacingY._7,
    gap: spacingY._7,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: verticalScale(7),
    marginRight: spacingX._10,
  },
  bulletText: {
    flex: 1,
    lineHeight: verticalScale(20),
  },
  contactSection: {
    marginTop: spacingY._25,
    paddingTop: spacingY._20,
    borderTopWidth: 1,
    borderTopColor: colors.neutral800,
  },
  contactText: {
    textAlign: "center",
    lineHeight: verticalScale(20),
  },
});
