const buildSuccessResponse = (data = null, message = "Success") => {
  const response = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  return response;
};

const buildErrorResponse = (
  message = "Something went wrong",
  errors = null,
) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };

  if (errors) response.errors = errors;

  return response;
};

const sendSuccess = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json(buildSuccessResponse(data, message));
};

const sendError = (
  res,
  message = "Something went wrong",
  statusCode = 500,
  errors = null,
) => {
  return res.status(statusCode).json(buildErrorResponse(message, errors));
};

module.exports = {
  buildSuccessResponse,
  buildErrorResponse,
  sendSuccess,
  sendError,
};
