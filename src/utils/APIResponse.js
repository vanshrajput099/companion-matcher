export const apiResponse = (statusCode, message, data = null) => ({
  statusCode,
  message,
  success: statusCode >= 200 && statusCode < 400,
  data,
});