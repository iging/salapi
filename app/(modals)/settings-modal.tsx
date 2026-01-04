import BackButton from "@/components/back-button";
import ExportDatePicker from "@/components/export-date-picker";
import Header from "@/components/header";
import ModalWrapper from "@/components/modal-wrapper";
import Typo from "@/components/typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import {
  exportToCSVWithDateRange,
  exportToPDFWithDateRange,
  getTransactionDateRange,
  hasTransactionsInRange,
} from "@/services/export.services";
import { verticalScale } from "@/utils/styling";
import { ExportIcon, FileTextIcon, TableIcon } from "phosphor-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const SettingsModal = () => {
  const { user } = useAuth();
  const [csvLoading, setCsvLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [exportType, setExportType] = useState<"csv" | "pdf">("csv");
  const [isLoadingRange, setIsLoadingRange] = useState(false);
  const [minDate, setMinDate] = useState<Date | undefined>(undefined);
  const [maxDate, setMaxDate] = useState<Date | undefined>(undefined);
  const [hasTransactions, setHasTransactions] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const [isCheckingCount, setIsCheckingCount] = useState(false);
  const [selectedPeriodStart, setSelectedPeriodStart] = useState<Date>(
    new Date()
  );
  const [selectedPeriodEnd, setSelectedPeriodEnd] = useState<Date>(new Date());

  // Load transaction date range when modal opens
  const loadDateRange = useCallback(async () => {
    if (!user?.uid) return;

    setIsLoadingRange(true);
    try {
      const range = await getTransactionDateRange(user.uid);
      setMinDate(range.minDate);
      setMaxDate(range.maxDate);
      setHasTransactions(range.hasTransactions);

      if (range.hasTransactions && range.minDate && range.maxDate) {
        // Initialize default period selection
        const now = new Date();
        const currentMonthStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        );
        const currentMonthEnd = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0
        );

        // Check if current month is within data range
        if (
          currentMonthStart <= range.maxDate &&
          currentMonthEnd >= range.minDate
        ) {
          setSelectedPeriodStart(
            currentMonthStart < range.minDate
              ? range.minDate
              : currentMonthStart
          );
          setSelectedPeriodEnd(
            currentMonthEnd > range.maxDate ? range.maxDate : currentMonthEnd
          );
        } else {
          // Use the most recent month with data
          const recentMonthStart = new Date(
            range.maxDate.getFullYear(),
            range.maxDate.getMonth(),
            1
          );
          setSelectedPeriodStart(
            recentMonthStart < range.minDate ? range.minDate : recentMonthStart
          );
          setSelectedPeriodEnd(range.maxDate);
        }
      }
    } catch (error) {
      if (__DEV__) {
        console.error("Error loading date range:", error);
      }
    } finally {
      setIsLoadingRange(false);
    }
  }, [user?.uid]);

  // Check transaction count when period changes
  const checkTransactionCount = useCallback(async () => {
    if (!user?.uid || !hasTransactions) return;

    setIsCheckingCount(true);
    try {
      const result = await hasTransactionsInRange(
        user.uid,
        selectedPeriodStart,
        selectedPeriodEnd
      );
      setTransactionCount(result.count);
    } catch (error) {
      if (__DEV__) {
        console.error("Error checking transaction count:", error);
      }
      setTransactionCount(0);
    } finally {
      setIsCheckingCount(false);
    }
  }, [user?.uid, selectedPeriodStart, selectedPeriodEnd, hasTransactions]);

  // Load date range when component mounts
  useEffect(() => {
    loadDateRange();
  }, [loadDateRange]);

  // Check count when period changes
  useEffect(() => {
    if (showDatePicker && hasTransactions) {
      checkTransactionCount();
    }
  }, [
    showDatePicker,
    selectedPeriodStart,
    selectedPeriodEnd,
    checkTransactionCount,
    hasTransactions,
  ]);

  const openDatePicker = (type: "csv" | "pdf") => {
    setExportType(type);
    setShowDatePicker(true);
    // Reload date range in case new transactions were added
    loadDateRange();
  };

  const handleExportWithDateRange = async (
    periodStart: Date,
    periodEnd: Date
  ) => {
    if (!user?.uid) {
      Toast.show({
        type: "error",
        text1: "Export Failed",
        text2: "Please log in to export data",
      });
      return;
    }

    setShowDatePicker(false);

    if (exportType === "csv") {
      await handleExportCSV(periodStart, periodEnd);
    } else {
      await handleExportPDF(periodStart, periodEnd);
    }
  };

  const handleExportCSV = async (periodStart: Date, periodEnd: Date) => {
    if (!user?.uid) {
      Toast.show({
        type: "error",
        text1: "Export Failed",
        text2: "Please log in to export data",
      });
      return;
    }

    setCsvLoading(true);
    try {
      const result = await exportToCSVWithDateRange(
        user.uid,
        periodStart,
        periodEnd
      );

      if (result.success) {
        Toast.show({
          type: "success",
          text1: "Export Complete",
          text2: "Your transactions have been exported to CSV",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Export Failed",
          text2: result.msg || "Unable to export CSV",
        });
      }
    } catch {
      Toast.show({
        type: "error",
        text1: "Export Failed",
        text2: "An unexpected error occurred",
      });
    } finally {
      setCsvLoading(false);
    }
  };

  const handleExportPDF = async (periodStart: Date, periodEnd: Date) => {
    if (!user?.uid) {
      Toast.show({
        type: "error",
        text1: "Export Failed",
        text2: "Please log in to export data",
      });
      return;
    }

    setPdfLoading(true);
    try {
      const result = await exportToPDFWithDateRange(
        user.uid,
        user.name || "User",
        periodStart,
        periodEnd
      );

      if (result.success) {
        Toast.show({
          type: "success",
          text1: "Export Complete",
          text2: "Your financial report has been generated",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Export Failed",
          text2: result.msg || "Unable to generate PDF",
        });
      }
    } catch {
      Toast.show({
        type: "error",
        text1: "Export Failed",
        text2: "An unexpected error occurred",
      });
    } finally {
      setPdfLoading(false);
    }
  };

  const isExporting = csvLoading || pdfLoading;

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Settings"
          leftIcon={<BackButton iconSize={26} />}
          style={styles.header}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Data Export Section */}
          <View style={styles.section}>
            <Typo size={14} fontWeight="600" color={colors.neutral400}>
              Data Export
            </Typo>
            <View style={styles.settingCard}>
              <Typo
                size={13}
                color={colors.neutral400}
                style={styles.exportDescription}
              >
                Export your complete transaction history and financial data.
                Files will be saved to your device for sharing or backup.
              </Typo>

              <TouchableOpacity
                style={[
                  styles.exportButton,
                  isExporting && styles.exportButtonDisabled,
                ]}
                onPress={() => openDatePicker("csv")}
                disabled={isExporting}
                activeOpacity={0.7}
              >
                <View style={styles.exportIconContainer}>
                  {csvLoading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <TableIcon
                      size={verticalScale(22)}
                      color={colors.primary}
                      weight="fill"
                    />
                  )}
                </View>
                <View style={styles.exportButtonText}>
                  <Typo size={15} fontWeight="600" color={colors.neutral100}>
                    {csvLoading ? "Exporting..." : "Export as CSV"}
                  </Typo>
                  <Typo size={12} color={colors.neutral400}>
                    Spreadsheet compatible format
                  </Typo>
                </View>
                <ExportIcon
                  size={verticalScale(18)}
                  color={colors.neutral500}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.exportButton,
                  isExporting && styles.exportButtonDisabled,
                ]}
                onPress={() => openDatePicker("pdf")}
                disabled={isExporting}
                activeOpacity={0.7}
              >
                <View style={styles.exportIconContainer}>
                  {pdfLoading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <FileTextIcon
                      size={verticalScale(22)}
                      color={colors.primary}
                      weight="fill"
                    />
                  )}
                </View>
                <View style={styles.exportButtonText}>
                  <Typo size={15} fontWeight="600" color={colors.neutral100}>
                    {pdfLoading ? "Exporting..." : "Export as PDF"}
                  </Typo>
                  <Typo size={12} color={colors.neutral400}>
                    Professional printable report
                  </Typo>
                </View>
                <ExportIcon
                  size={verticalScale(18)}
                  color={colors.neutral500}
                />
              </TouchableOpacity>

              <View style={styles.exportNote}>
                <Typo size={11} color={colors.neutral500}>
                  Exports include all transactions with category, date, and
                  amount details.
                </Typo>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Date Picker Modal */}
        <ExportDatePicker
          visible={showDatePicker}
          exportType={exportType}
          minDate={minDate}
          maxDate={maxDate}
          hasTransactions={hasTransactions}
          isLoadingRange={isLoadingRange}
          onClose={() => setShowDatePicker(false)}
          onExport={handleExportWithDateRange}
          transactionCount={transactionCount}
          isCheckingCount={isCheckingCount}
        />
      </View>
    </ModalWrapper>
  );
};

export default SettingsModal;

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
  section: {
    marginBottom: spacingY._25,
  },
  settingCard: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._12,
    padding: spacingX._15,
    marginTop: spacingY._10,
  },
  exportDescription: {
    marginBottom: spacingY._15,
    lineHeight: verticalScale(20),
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacingX._15,
    backgroundColor: colors.neutral800,
    borderRadius: radius._10,
    marginBottom: spacingY._10,
  },
  exportButtonDisabled: {
    opacity: 0.6,
  },
  exportIconContainer: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: radius._10,
    backgroundColor: colors.neutral700,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacingX._12,
  },
  exportButtonText: {
    flex: 1,
  },
  exportNote: {
    alignItems: "center",
    paddingTop: spacingY._5,
  },
});
