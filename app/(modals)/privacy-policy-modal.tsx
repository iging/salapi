import BackButton from "@/components/back-button";
import Header from "@/components/header";
import ModalWrapper from "@/components/modal-wrapper";
import {
  PrivacyBulletPoint,
  PrivacyDataTableRow,
  PrivacyDivider,
  PrivacySection,
} from "@/components/privacy-policy";
import Typo from "@/components/typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import {
  Database,
  Eye,
  Lock,
  ShieldCheck,
  Trash,
  UserCircle,
  Wallet,
} from "phosphor-react-native";
import { ScrollView, StyleSheet, View } from "react-native";

const EFFECTIVE_DATE = "January 1, 2026";
const APP_NAME = "SALAPI";

const PrivacyPolicyModal = () => {
  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Privacy Policy"
          leftIcon={<BackButton iconSize={26} />}
          style={styles.header}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <Typo size={14} fontWeight="600" color={colors.primary}>
              Quick Summary
            </Typo>
            <Typo
              size={13}
              color={colors.neutral200}
              style={styles.summaryText}
            >
              {APP_NAME} collects only the information necessary to help you
              track your finances. We store your account details, wallet
              information, and transactions securely using industry-standard
              encryption. We do not sell your data to third parties.
            </Typo>
          </View>

          <Typo
            size={12}
            color={colors.neutral400}
            style={styles.effectiveDate}
          >
            Effective Date: {EFFECTIVE_DATE}
          </Typo>

          {/* Introduction */}
          <PrivacySection title="Introduction">
            <Typo size={14} color={colors.neutral300} style={styles.paragraph}>
              Welcome to {APP_NAME}. This Privacy Policy explains how we
              collect, use, and protect your personal information when you use
              our expense tracking application. We are committed to safeguarding
              your privacy and ensuring transparency in our data practices.
            </Typo>
            <Typo size={14} color={colors.neutral300} style={styles.paragraph}>
              This policy is designed to comply with the Philippine Data Privacy
              Act of 2012 (Republic Act No. 10173) and follows international
              best practices including GDPR and CCPA principles where
              applicable.
            </Typo>
          </PrivacySection>

          <PrivacyDivider />

          {/* Data We Collect */}
          <PrivacySection
            title="Information We Collect"
            icon={
              <Database
                size={verticalScale(20)}
                color={colors.primary}
                weight="bold"
              />
            }
          >
            <Typo
              size={14}
              color={colors.neutral300}
              style={styles.sectionIntro}
            >
              We collect only the information necessary to provide you with our
              expense tracking services:
            </Typo>

            {/* Data Table */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <View style={styles.tableCell}>
                  <Typo size={12} fontWeight="700" color={colors.primary}>
                    Data Type
                  </Typo>
                </View>
                <View style={styles.tableCellWide}>
                  <Typo size={12} fontWeight="700" color={colors.primary}>
                    Why We Need It
                  </Typo>
                </View>
              </View>
              <PrivacyDataTableRow
                dataType="Name"
                purpose="To personalize your experience and display on your profile"
              />
              <PrivacyDataTableRow
                dataType="Email Address"
                purpose="To create your account, verify your identity, and send important notifications"
              />
              <PrivacyDataTableRow
                dataType="Password"
                purpose="To secure your account (stored encrypted, never in plain text)"
              />
              <PrivacyDataTableRow
                dataType="Wallet Information"
                purpose="To track your different accounts and calculate balances"
              />
              <PrivacyDataTableRow
                dataType="Transactions"
                purpose="To provide spending insights and track your income and expenses"
              />
              <PrivacyDataTableRow
                dataType="Images (Optional)"
                purpose="Profile photos and receipt images you choose to upload"
              />
            </View>
          </PrivacySection>

          <PrivacyDivider />

          {/* Account Information */}
          <PrivacySection
            title="Account Information"
            icon={
              <UserCircle
                size={verticalScale(20)}
                color={colors.primary}
                weight="bold"
              />
            }
          >
            <Typo size={14} color={colors.neutral300} style={styles.paragraph}>
              When you create an account, we collect:
            </Typo>
            <PrivacyBulletPoint
              text="Your name"
              subText="Displayed on your profile and used for personalization"
            />
            <PrivacyBulletPoint
              text="Your email address"
              subText="Used for account verification and authentication"
            />
            <PrivacyBulletPoint
              text="Your password"
              subText="Securely encrypted by Firebase Authentication"
            />
            <PrivacyBulletPoint
              text="Profile photo (optional)"
              subText="Stored securely on Cloudinary if you choose to upload one"
            />
          </PrivacySection>

          <PrivacyDivider />

          {/* Financial Information */}
          <PrivacySection
            title="Financial Information"
            icon={
              <Wallet
                size={verticalScale(20)}
                color={colors.primary}
                weight="bold"
              />
            }
          >
            <Typo size={14} color={colors.neutral300} style={styles.paragraph}>
              To provide expense tracking features, we store:
            </Typo>
            <PrivacyBulletPoint
              text="Wallet details"
              subText="Names you assign to your wallets and current balances"
            />
            <PrivacyBulletPoint
              text="Transaction records"
              subText="Amount, category, date, and optional descriptions"
            />
            <PrivacyBulletPoint
              text="Income and expense totals"
              subText="Calculated automatically to show your financial overview"
            />
            <PrivacyBulletPoint
              text="Receipt images (optional)"
              subText="Only if you choose to attach them to transactions"
            />

            <View style={styles.infoBox}>
              <Typo size={13} color={colors.neutral200}>
                Important: {APP_NAME} does not connect to your bank accounts or
                access any real banking information. All financial data is
                manually entered by you.
              </Typo>
            </View>
          </PrivacySection>

          <PrivacyDivider />

          {/* How We Use Your Data */}
          <PrivacySection
            title="How We Use Your Information"
            icon={
              <Eye
                size={verticalScale(20)}
                color={colors.primary}
                weight="bold"
              />
            }
          >
            <Typo size={14} color={colors.neutral300} style={styles.paragraph}>
              We use your information solely to:
            </Typo>
            <PrivacyBulletPoint text="Provide and maintain the expense tracking service" />
            <PrivacyBulletPoint text="Display your spending patterns and financial insights on your dashboard" />
            <PrivacyBulletPoint text="Authenticate your identity and secure your account" />
            <PrivacyBulletPoint text="Send email verification when you register" />
            <PrivacyBulletPoint text="Improve our application based on aggregated, anonymized usage patterns (web only)" />

            <View style={styles.emphasisBox}>
              <Typo size={13} fontWeight="600" color={colors.primary}>
                We do not:
              </Typo>
              <PrivacyBulletPoint text="Sell your personal data to third parties" />
              <PrivacyBulletPoint text="Share your financial information with advertisers" />
              <PrivacyBulletPoint text="Use your data for purposes other than providing our service" />
            </View>
          </PrivacySection>

          <PrivacyDivider />

          {/* Third-Party Services */}
          <PrivacySection
            title="Third-Party Services"
            icon={
              <ShieldCheck
                size={verticalScale(20)}
                color={colors.primary}
                weight="bold"
              />
            }
          >
            <Typo size={14} color={colors.neutral300} style={styles.paragraph}>
              We use trusted third-party services to operate {APP_NAME}:
            </Typo>

            <View style={styles.serviceCard}>
              <Typo size={14} fontWeight="600" color={colors.neutral100}>
                Firebase (by Google)
              </Typo>
              <Typo size={13} color={colors.neutral400}>
                Authentication and secure data storage
              </Typo>
              <PrivacyBulletPoint text="Handles user login and registration" />
              <PrivacyBulletPoint text="Stores your account and financial data in the cloud" />
              <PrivacyBulletPoint text="Analytics on web platform only (anonymized usage data)" />
            </View>

            <View style={styles.serviceCard}>
              <Typo size={14} fontWeight="600" color={colors.neutral100}>
                Cloudinary
              </Typo>
              <Typo size={13} color={colors.neutral400}>
                Image hosting service
              </Typo>
              <PrivacyBulletPoint text="Stores profile photos and receipt images you upload" />
              <PrivacyBulletPoint text="Images are transmitted securely via HTTPS" />
            </View>

            <Typo size={13} color={colors.neutral400} style={styles.paragraph}>
              These services have their own privacy policies and comply with
              international data protection standards.
            </Typo>
          </PrivacySection>

          <PrivacyDivider />

          {/* Data Security */}
          <PrivacySection
            title="Data Security"
            icon={
              <Lock
                size={verticalScale(20)}
                color={colors.primary}
                weight="bold"
              />
            }
          >
            <Typo size={14} color={colors.neutral300} style={styles.paragraph}>
              We implement industry-standard security measures to protect your
              information:
            </Typo>
            <PrivacyBulletPoint
              text="Encryption in Transit"
              subText="All data transmitted between your device and our servers uses HTTPS/TLS encryption"
            />
            <PrivacyBulletPoint
              text="Secure Authentication"
              subText="Passwords are handled by Firebase Authentication and never stored in plain text"
            />
            <PrivacyBulletPoint
              text="Email Verification"
              subText="Required before account activation to prevent unauthorized access"
            />
            <PrivacyBulletPoint
              text="Session Security"
              subText="Authentication tokens are stored securely on your device"
            />
          </PrivacySection>

          <PrivacyDivider />

          {/* Your Rights */}
          <PrivacySection
            title="Your Rights"
            icon={
              <UserCircle
                size={verticalScale(20)}
                color={colors.primary}
                weight="bold"
              />
            }
          >
            <Typo size={14} color={colors.neutral300} style={styles.paragraph}>
              Under the Philippine Data Privacy Act and international standards,
              you have the right to:
            </Typo>
            <PrivacyBulletPoint
              text="Access Your Data"
              subText="View all your personal information stored in the app"
            />
            <PrivacyBulletPoint
              text="Correct Your Data"
              subText="Update your profile information at any time through the Edit Profile feature"
            />
            <PrivacyBulletPoint
              text="Delete Your Data"
              subText="Remove individual transactions, wallets, or request complete account deletion"
            />
            <PrivacyBulletPoint
              text="Data Portability"
              subText="Request a copy of your data in a readable format"
            />
            <PrivacyBulletPoint
              text="Withdraw Consent"
              subText="Stop using the service and delete your account at any time"
            />

            <View style={styles.infoBox}>
              <Typo size={13} fontWeight="600" color={colors.neutral200}>
                To exercise these rights, you can:
              </Typo>
              <PrivacyBulletPoint text="Use in-app features to edit or delete your data" />
              <PrivacyBulletPoint text="Contact us via email for data export or account deletion requests" />
            </View>
          </PrivacySection>

          <PrivacyDivider />

          {/* Data Deletion */}
          <PrivacySection
            title="Data Deletion"
            icon={
              <Trash
                size={verticalScale(20)}
                color={colors.primary}
                weight="bold"
              />
            }
          >
            <Typo size={14} color={colors.neutral300} style={styles.paragraph}>
              You have full control over your data:
            </Typo>
            <PrivacyBulletPoint
              text="Delete Transactions"
              subText="Remove individual transactions directly from the transaction screen"
            />
            <PrivacyBulletPoint
              text="Delete Wallets"
              subText="Deleting a wallet will also remove all associated transactions"
            />
            <PrivacyBulletPoint
              text="Delete Account"
              subText="Permanently delete your account and all associated data directly from the app"
            />

            <View style={styles.infoBox}>
              <Typo size={13} fontWeight="600" color={colors.neutral200}>
                What happens when you delete your account:
              </Typo>
              <PrivacyBulletPoint text="Your profile information (name, email, profile photo) is permanently deleted" />
              <PrivacyBulletPoint text="All your wallets are permanently deleted" />
              <PrivacyBulletPoint text="All your transactions are permanently deleted" />
              <PrivacyBulletPoint text="All uploaded images (receipts, profile photos) are permanently removed" />
            </View>

            <Typo size={13} color={colors.neutral400} style={styles.paragraph}>
              Account deletion is immediate and irreversible. Once deleted, your
              data cannot be recovered. We recommend exporting any data you wish
              to keep before deleting your account.
            </Typo>
          </PrivacySection>

          <PrivacyDivider />

          {/* Data Retention */}
          <PrivacySection title="Data Retention">
            <Typo size={14} color={colors.neutral300} style={styles.paragraph}>
              We retain your personal information only for as long as necessary
              to provide our services:
            </Typo>
            <PrivacyBulletPoint
              text="Active Account"
              subText="Data is retained while your account remains active"
            />
            <PrivacyBulletPoint
              text="Account Deletion"
              subText="All data is permanently and immediately deleted when you delete your account"
            />
            <PrivacyBulletPoint
              text="No Backup Retention"
              subText="We do not retain copies of your data after account deletion"
            />
          </PrivacySection>

          <PrivacyDivider />

          {/* Children's Privacy */}
          <PrivacySection title="Children's Privacy">
            <Typo size={14} color={colors.neutral300} style={styles.paragraph}>
              {APP_NAME} is not intended for use by individuals under the age of
              18. We do not knowingly collect personal information from minors.
              If you believe a child has provided us with personal information,
              please contact us immediately so we can remove such data.
            </Typo>
          </PrivacySection>

          <PrivacyDivider />

          {/* Changes to Policy */}
          <PrivacySection title="Changes to This Policy">
            <Typo size={14} color={colors.neutral300} style={styles.paragraph}>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or legal requirements. When we make
              significant changes:
            </Typo>
            <PrivacyBulletPoint text="We will update the 'Effective Date' at the top of this policy" />
            <PrivacyBulletPoint text="We may notify you through the app or via email for material changes" />
            <Typo size={13} color={colors.neutral400} style={styles.paragraph}>
              We encourage you to review this policy periodically to stay
              informed about how we protect your information.
            </Typo>
          </PrivacySection>

          <PrivacyDivider />

          {/* Contact Information */}
          <PrivacySection title="Contact Us">
            <Typo size={14} color={colors.neutral300} style={styles.paragraph}>
              If you have questions about this Privacy Policy, wish to exercise
              your data rights, or have concerns about how your information is
              handled, we are here to help.
            </Typo>
            <View style={styles.comingSoonBox}>
              <Typo size={14} fontWeight="600" color={colors.neutral200}>
                Contact Feature Coming Soon
              </Typo>
              <Typo
                size={13}
                color={colors.neutral400}
                style={{ marginTop: spacingY._5 }}
              >
                We are currently building a dedicated support channel to better
                assist you with privacy-related inquiries. This feature will be
                available in a future update.
              </Typo>
            </View>
            <Typo size={13} color={colors.neutral400} style={styles.paragraph}>
              Once available, we aim to respond to all inquiries within 30 days
              as required by the Data Privacy Act of 2012.
            </Typo>
          </PrivacySection>

          {/* Footer */}
          <View style={styles.footer}>
            <Typo size={12} color={colors.neutral500} style={styles.footerText}>
              This Privacy Policy was last updated on {EFFECTIVE_DATE}.
            </Typo>
            <Typo size={12} color={colors.neutral500} style={styles.footerText}>
              {APP_NAME} - Your Personal Expense Tracker
            </Typo>
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default PrivacyPolicyModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  header: {
    marginTop: spacingY._10,
    marginBottom: spacingY._15,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacingY._40,
  },
  summaryCard: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._12,
    padding: spacingX._15,
    marginBottom: spacingY._15,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  summaryText: {
    marginTop: spacingY._7,
    lineHeight: verticalScale(20),
  },
  effectiveDate: {
    marginBottom: spacingY._20,
    textAlign: "center",
  },
  sectionIntro: {
    marginBottom: spacingY._10,
    lineHeight: verticalScale(20),
  },
  paragraph: {
    lineHeight: verticalScale(20),
  },
  table: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._10,
    overflow: "hidden",
    marginTop: spacingY._10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.neutral800,
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._12,
  },
  tableCell: {
    flex: 1,
  },
  tableCellWide: {
    flex: 2,
  },
  infoBox: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._10,
    padding: spacingX._15,
    marginTop: spacingY._15,
  },
  emphasisBox: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._10,
    padding: spacingX._15,
    marginTop: spacingY._15,
    borderWidth: 1,
    borderColor: colors.neutral700,
  },
  serviceCard: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._10,
    padding: spacingX._15,
    marginBottom: spacingY._10,
  },
  comingSoonBox: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._10,
    padding: spacingX._15,
    marginTop: spacingY._10,
    marginBottom: spacingY._10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.neutral600,
  },
  footer: {
    marginTop: spacingY._20,
    paddingTop: spacingY._20,
    borderTopWidth: 1,
    borderTopColor: colors.neutral700,
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
    marginBottom: spacingY._5,
  },
});
