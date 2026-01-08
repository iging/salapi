import { HelpSectionType, HelpTopicType } from "@/types";
import {
  ChartLineUp,
  CurrencyCircleDollar,
  Export,
  Question,
  ShieldCheck,
  Wallet,
} from "phosphor-react-native";

/**
 * Quick help topics displayed at the top of the Help Center
 */
export const helpTopics: HelpTopicType[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics of tracking your finances with Salapi.",
  },
  {
    id: "transactions",
    title: "Managing Transactions",
    description: "How to add, edit, and categorize your income and expenses.",
  },
  {
    id: "wallets",
    title: "Using Wallets",
    description: "Organize your finances across multiple accounts.",
  },
  {
    id: "reports",
    title: "Exporting Reports",
    description: "Generate PDF reports of your financial data.",
  },
];

/**
 * Detailed help sections with comprehensive documentation
 */
export const helpSections: HelpSectionType[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Question,
    content: [
      {
        heading: "Welcome to Salapi",
        text: "Salapi is your personal finance companion designed to help you track income, manage expenses, and gain insights into your spending habits. Here is how to get started:",
      },
      {
        bullets: [
          "Create your first wallet to represent a bank account, cash, or any financial source.",
          "Add transactions to record your income and expenses.",
          "View your dashboard to see your total balance and recent activity.",
          "Use the Statistics tab to analyze your spending patterns over time.",
        ],
      },
    ],
  },
  {
    id: "transactions",
    title: "Managing Transactions",
    icon: CurrencyCircleDollar,
    content: [
      {
        heading: "Adding a Transaction",
        text: "To record a new transaction, tap the plus button on the Home screen. You will need to provide the following information:",
      },
      {
        bullets: [
          "Transaction Type: Choose between Income or Expense.",
          "Amount: Enter the transaction amount.",
          "Category: For expenses, select a category such as Groceries, Transportation, or Entertainment. You can also create a custom category by selecting Others.",
          "Wallet: Select which wallet this transaction belongs to.",
          "Date: The date of the transaction (defaults to today).",
          "Description: Add an optional note for your reference.",
          "Receipt: Optionally attach an image of your receipt.",
        ],
      },
      {
        heading: "Editing and Deleting Transactions",
        text: "Tap any transaction in your list to view its details. From there, you can modify any field and save your changes, or delete the transaction entirely. Note that deleting a transaction will automatically update your wallet balance.",
      },
      {
        heading: "Expense Categories",
        text: "Salapi includes predefined categories to help you organize your expenses:",
      },
      {
        bullets: [
          "Groceries: Food and household supplies",
          "Rent: Housing and accommodation costs",
          "Utilities: Electricity, water, internet, and similar services",
          "Transportation: Fuel, public transit, and vehicle expenses",
          "Entertainment: Leisure activities and subscriptions",
          "Food: Dining out and takeaway meals",
          "Shopping: Retail purchases and online orders",
          "Healthcare: Medical expenses and pharmacy",
          "Personal: Personal care and miscellaneous items",
          "Education: Courses, books, and learning materials",
          "Subscriptions: Recurring digital services",
          "Travel: Trips and vacation expenses",
          "Others: Custom categories for anything else",
        ],
      },
    ],
  },
  {
    id: "wallets",
    title: "Using Wallets",
    icon: Wallet,
    content: [
      {
        heading: "What Are Wallets?",
        text: "Wallets in Salapi represent your different financial accounts or sources of funds. You might create separate wallets for your bank account, cash on hand, savings, or credit cards.",
      },
      {
        heading: "Creating a Wallet",
        text: "Navigate to the Wallet tab and tap the plus icon. Give your wallet a name and optionally add an image to help identify it quickly.",
      },
      {
        heading: "Wallet Balances",
        text: "Each wallet automatically tracks its balance based on the transactions you record. Income transactions increase the balance, while expenses decrease it. You can view each wallet's total income and expenses in the wallet details.",
      },
      {
        bullets: [
          "Wallet balances update automatically when you add, edit, or delete transactions.",
          "You cannot record an expense that exceeds your wallet's available balance.",
          "Deleting a wallet will also remove all associated transactions.",
        ],
      },
    ],
  },
  {
    id: "statistics",
    title: "Statistics and Insights",
    icon: ChartLineUp,
    content: [
      {
        heading: "Understanding Your Spending",
        text: "The Statistics tab provides a visual breakdown of your financial activity. You can analyze your spending patterns and identify areas where you might want to adjust your habits.",
      },
      {
        bullets: [
          "View income versus expenses over different time periods.",
          "See which categories consume most of your budget.",
          "Track your financial trends over weeks and months.",
          "Filter transactions by date range for detailed analysis.",
        ],
      },
    ],
  },
  {
    id: "reports",
    title: "Exporting Reports",
    icon: Export,
    content: [
      {
        heading: "PDF Report Export",
        text: "Salapi allows you to export your financial data as a professionally formatted PDF report. Access this feature from Settings and then Data Export.",
      },
      {
        heading: "What's Included",
        text: "The PDF report includes a financial summary with total income, expenses, and net balance, along with a complete transaction history. This format is perfect for printing, sharing, or keeping records.",
      },
      {
        heading: "Date Range Selection",
        text: "When exporting, you can select a specific date range to include only the transactions you need. The system will show you how many transactions fall within your selected period before you confirm the export.",
      },
    ],
  },
  {
    id: "security",
    title: "Security and Privacy",
    icon: ShieldCheck,
    content: [
      {
        heading: "How We Protect Your Data",
        text: "Your financial information is sensitive, and Salapi takes your privacy seriously. Here is how we keep your data secure:",
      },
      {
        bullets: [
          "Authentication: Your account is protected by Firebase Authentication with email verification required before first login.",
          "Data Storage: All data is stored securely in Google Cloud Firestore with access restricted to your account only.",
          "Password Security: Passwords are never stored in plain text and are handled entirely by Firebase's secure authentication system.",
          "Local Processing: Financial calculations and data analysis happen on your device.",
        ],
      },
      {
        heading: "Account Management",
        text: "You have full control over your account and data:",
      },
      {
        bullets: [
          "Change your password anytime from the Account settings.",
          "Export all your data before making account changes.",
          "Delete your account and all associated data permanently if needed.",
        ],
      },
      {
        text: "For complete details about data collection and usage, please review our Privacy Policy accessible from the Profile screen.",
      },
    ],
  },
];
