export type ExportDatePickerProps = {
  visible: boolean;
  minDate?: Date;
  maxDate?: Date;
  hasTransactions: boolean;
  isLoadingRange: boolean;
  onClose: () => void;
  onExport: (periodStart: Date, periodEnd: Date) => void;
  transactionCount: number;
  isCheckingCount: boolean;
};
