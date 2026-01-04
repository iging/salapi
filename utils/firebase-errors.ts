export const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    // Login errors
    "auth/invalid-credential": "Invalid email or password. Please try again.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-disabled":
      "This account has been disabled. Contact support for assistance.",
    "auth/user-not-found": "Invalid email or password. Please try again.",
    "auth/wrong-password": "Invalid email or password. Please try again.",
    "auth/too-many-requests":
      "Too many failed attempts. Please try again later.",

    // Registration errors
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password":
      "Password is too weak. Please choose a stronger password.",
    "auth/operation-not-allowed":
      "Registration is currently unavailable. Please try again later.",

    // Network errors
    "auth/network-request-failed":
      "Network error. Please check your connection and try again.",

    // General errors
    "auth/internal-error": "Something went wrong. Please try again later.",
    "auth/invalid-api-key":
      "Service configuration error. Please contact support.",
  };

  return (
    errorMessages[errorCode] ||
    "An unexpected error occurred. Please try again."
  );
};

export const getPasswordChangeErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    // Password change specific errors
    "auth/invalid-credential":
      "Current password is incorrect. Please try again.",
    "auth/wrong-password": "Current password is incorrect. Please try again.",
    "auth/weak-password":
      "New password is too weak. Please choose a stronger password.",
    "auth/too-many-requests":
      "Too many failed attempts. Please try again later.",
    "auth/requires-recent-login":
      "Please sign out and sign in again before changing your password.",

    // Network errors
    "auth/network-request-failed":
      "Network error. Please check your connection and try again.",

    // General errors
    "auth/internal-error": "Something went wrong. Please try again later.",
  };

  return (
    errorMessages[errorCode] || "Failed to change password. Please try again."
  );
};
