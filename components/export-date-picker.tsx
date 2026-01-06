import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { ExportDatePickerProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { CalendarIcon, WarningCircleIcon, XIcon } from "phosphor-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Typo from "./typo";

const ExportDatePicker = ({
  visible,
  minDate,
  maxDate,
  hasTransactions,
  isLoadingRange,
  onClose,
  onExport,
  transactionCount,
  isCheckingCount,
}: ExportDatePickerProps) => {
  const [periodStart, setPeriodStart] = useState<Date>(new Date());
  const [periodEnd, setPeriodEnd] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Initialize dates when modal opens or date range changes
  useEffect(() => {
    if (visible && hasTransactions && minDate && maxDate) {
      // Default to current month if it has data, otherwise use most recent month with data
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const currentMonthEnd = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      );

      // Check if current month is within data range
      if (currentMonthStart <= maxDate && currentMonthEnd >= minDate) {
        // Use current month, but clamp to available data range
        setPeriodStart(
          currentMonthStart < minDate ? minDate : currentMonthStart
        );
        setPeriodEnd(currentMonthEnd > maxDate ? maxDate : currentMonthEnd);
      } else {
        // Use the most recent month with data
        const recentMonthStart = new Date(
          maxDate.getFullYear(),
          maxDate.getMonth(),
          1
        );
        setPeriodStart(recentMonthStart < minDate ? minDate : recentMonthStart);
        setPeriodEnd(maxDate);
      }
    }
  }, [visible, hasTransactions, minDate, maxDate]);

  // Validate date selection
  useEffect(() => {
    if (periodEnd < periodStart) {
      setValidationError("End date cannot be earlier than start date.");
    } else if (transactionCount === 0 && !isCheckingCount) {
      setValidationError("No data available for the selected period.");
    } else {
      setValidationError(null);
    }
  }, [periodStart, periodEnd, transactionCount, isCheckingCount]);

  const handleStartDateChange = (event: unknown, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowStartPicker(false);
    }
    if (selectedDate) {
      setPeriodStart(selectedDate);
    }
  };

  const handleEndDateChange = (event: unknown, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowEndPicker(false);
    }
    if (selectedDate) {
      setPeriodEnd(selectedDate);
    }
  };

  const handleExport = () => {
    if (validationError || transactionCount === 0) {
      return;
    }
    onExport(periodStart, periodEnd);
  };

  const formatDate = (date: Date): string => {
    return moment(date).format("MMM D, YYYY");
  };

  const canExport =
    !validationError &&
    transactionCount > 0 &&
    !isCheckingCount &&
    hasTransactions;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Typo size={18} fontWeight="700" color={colors.white}>
              Export Statement
            </Typo>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <XIcon size={verticalScale(24)} color={colors.neutral400} />
            </TouchableOpacity>
          </View>

          {isLoadingRange ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Typo
                size={14}
                color={colors.neutral400}
                style={styles.loadingText}
              >
                Loading transaction data...
              </Typo>
            </View>
          ) : !hasTransactions ? (
            <View style={styles.emptyContainer}>
              <WarningCircleIcon
                size={verticalScale(48)}
                color={colors.neutral500}
              />
              <Typo
                size={16}
                fontWeight="600"
                color={colors.neutral300}
                style={styles.emptyTitle}
              >
                No Transactions Found
              </Typo>
              <Typo
                size={14}
                color={colors.neutral500}
                style={styles.emptyText}
              >
                Add some transactions first to enable data export.
              </Typo>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Typo size={14} fontWeight="600" color={colors.white}>
                  Close
                </Typo>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Description */}
              <Typo
                size={13}
                color={colors.neutral400}
                style={styles.description}
              >
                Select a date range to export your transaction history.
              </Typo>

              {/* Date Range Info */}
              <View style={styles.dateRangeInfo}>
                <Typo size={12} color={colors.neutral500}>
                  Available data: {minDate && formatDate(minDate)} -{" "}
                  {maxDate && formatDate(maxDate)}
                </Typo>
              </View>

              {/* Start Date Picker */}
              <View style={styles.dateSection}>
                <Typo
                  size={12}
                  fontWeight="600"
                  color={colors.neutral400}
                  style={styles.dateLabel}
                >
                  FROM
                </Typo>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowStartPicker(true)}
                >
                  <CalendarIcon
                    size={verticalScale(20)}
                    color={colors.primary}
                  />
                  <Typo size={15} fontWeight="500" color={colors.neutral100}>
                    {formatDate(periodStart)}
                  </Typo>
                </TouchableOpacity>
                {showStartPicker && (
                  <DateTimePicker
                    value={periodStart}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleStartDateChange}
                    minimumDate={minDate}
                    maximumDate={maxDate}
                    themeVariant="dark"
                  />
                )}
              </View>

              {/* End Date Picker */}
              <View style={styles.dateSection}>
                <Typo
                  size={12}
                  fontWeight="600"
                  color={colors.neutral400}
                  style={styles.dateLabel}
                >
                  TO
                </Typo>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowEndPicker(true)}
                >
                  <CalendarIcon
                    size={verticalScale(20)}
                    color={colors.primary}
                  />
                  <Typo size={15} fontWeight="500" color={colors.neutral100}>
                    {formatDate(periodEnd)}
                  </Typo>
                </TouchableOpacity>
                {showEndPicker && (
                  <DateTimePicker
                    value={periodEnd}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleEndDateChange}
                    minimumDate={minDate}
                    maximumDate={maxDate}
                    themeVariant="dark"
                  />
                )}
              </View>

              {/* Transaction Count */}
              <View style={styles.countContainer}>
                {isCheckingCount ? (
                  <ActivityIndicator size="small" color={colors.neutral500} />
                ) : (
                  <Typo
                    size={13}
                    color={
                      transactionCount > 0 ? colors.neutral300 : colors.rose
                    }
                  >
                    {transactionCount > 0
                      ? `${transactionCount} transaction${
                          transactionCount !== 1 ? "s" : ""
                        } found`
                      : "No data available for the selected period."}
                  </Typo>
                )}
              </View>

              {/* Validation Error */}
              {validationError && transactionCount > 0 && (
                <View style={styles.errorContainer}>
                  <WarningCircleIcon
                    size={verticalScale(16)}
                    color={colors.rose}
                  />
                  <Typo size={12} color={colors.rose} style={styles.errorText}>
                    {validationError}
                  </Typo>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Typo size={14} fontWeight="600" color={colors.white}>
                    Cancel
                  </Typo>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.exportButton,
                    !canExport && styles.buttonDisabled,
                  ]}
                  onPress={handleExport}
                  disabled={!canExport}
                >
                  <Typo size={14} fontWeight="600" color={colors.neutral900}>
                    Export
                  </Typo>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ExportDatePicker;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacingX._20,
  },
  container: {
    width: "100%",
    backgroundColor: colors.neutral800,
    borderRadius: radius._17,
    padding: spacingX._20,
    paddingVertical: spacingY._20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._15,
  },
  description: {
    lineHeight: verticalScale(20),
    marginBottom: spacingY._10,
  },
  dateRangeInfo: {
    backgroundColor: colors.neutral700,
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._12,
    borderRadius: radius._10,
    marginBottom: spacingY._20,
  },
  dateSection: {
    marginBottom: spacingY._15,
  },
  dateLabel: {
    marginBottom: spacingY._7,
    letterSpacing: 1,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral700,
    paddingVertical: spacingY._12,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._10,
    gap: spacingX._10,
  },
  countContainer: {
    alignItems: "center",
    paddingVertical: spacingY._10,
    minHeight: verticalScale(40),
    justifyContent: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._12,
    borderRadius: radius._10,
    marginBottom: spacingY._10,
    gap: spacingX._7,
  },
  errorText: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: spacingY._15,
    gap: spacingX._12,
  },
  button: {
    flex: 1,
    paddingVertical: spacingY._12,
    borderRadius: radius._10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.neutral600,
  },
  exportButton: {
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: spacingY._40,
  },
  loadingText: {
    marginTop: spacingY._15,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: spacingY._25,
  },
  emptyTitle: {
    marginTop: spacingY._15,
  },
  emptyText: {
    textAlign: "center",
    marginTop: spacingY._7,
    lineHeight: verticalScale(20),
  },
  closeButton: {
    backgroundColor: colors.neutral600,
    paddingVertical: spacingY._12,
    paddingHorizontal: spacingX._30,
    borderRadius: radius._10,
    marginTop: spacingY._20,
  },
});
