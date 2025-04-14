export const API_ROUTES = {
  LOGIN: '/api/login',
  CUSTOMER_SIGNUP: '/api/customer/signup',
  PROFILE_IMAGE: '/api/customer/profile-image',
  SECURITY_QUESTIONS: '/api/security-questions',
  FORGOT_PASSWORD: '/api/forgot-password',
  VERIFY_SECURITY_ANSWER: '/api/verify-security-answer',
  SECURITY_QUESTION_BY_EMAIL: '/api/security-questions/by-email',
  SHOWS: '/api/shows',
  MOVIES: '/api/shows/movies',
  SLOTS: '/api/slot',
};

export const APP_ROUTES = {
  LOGIN: `/login`,
  SHOWS: `/shows`,
  SIGNUP: `/signup`,
  FORGOT_PASSWORD: `/forgot-password`,
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

export const ROLES = {
  CUSTOMER: `customer`,
  ADMIN: `admin`,
  STAFF: `staff`
}