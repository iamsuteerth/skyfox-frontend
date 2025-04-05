export const API_ROUTES = {
    LOGIN: `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
    SHOWS: `${process.env.NEXT_PUBLIC_API_BASE_URL}/shows`,
    SECURITY_QUESTIONS: `${process.env.NEXT_PUBLIC_API_BASE_URL}/security-questions`,
    VERIFY_SECURITY_ANSWER: `${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-security-answer`,
    CUSTOMER_SIGNUP: `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer/signup`,
    FORGOT_PASSWORD: `${process.env.NEXT_PUBLIC_API_BASE_URL}/forgot-password`,
    SECURITY_QUESTION_BY_EMAIL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/security-question/by-email`,
};

export const APP_ROUTES = {
    LOGIN: `/login`,
    SHOWS: `/shows`,
    SIGNUP: `/signup`,
    FORGOT_PASSWORD: `/forgot-password`,
    RESET_PASSWORD: `/reset-password`,
};

export const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: `Invalid username or password`,
    VALIDATION_ERROR: `Please check your input and try again`,
    UNAUTHORIZED: `You are not authorized to access this resource`,
    NETWORK_ERROR: `Network error. Please check your connection`,
    GENERIC_ERROR: `Something went wrong. Please try again later`,
    FORBIDDEN: `You do not have permission to access this resource`,
    INVALID_REQUEST: "Please check your input!",
};

export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: `Logged in successfully!`,
    SIGNUP_SUCCESS: `Signed up successfully!`,
    PASSWORD_RESET_SUCCESS: `Password has been reset successfully!`,
};
