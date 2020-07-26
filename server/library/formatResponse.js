exports.formatResponse = (error, status, message, data) => {
  let response = {
    error: error,
    status: status,
    message: message,
    data: data,
  };
  return response;
};
