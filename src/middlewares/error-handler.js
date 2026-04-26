export const globalErrorHandler = (err, req, res, next) => {
  console.error(`[ERROR] en ${req.method} ${req.originalUrl} - ${err}`);
  const statusCode = err.status || 500;

  const response = {
    status: "Error",
    message: statusCode == 500 ? "Error interno del servidor" : err.message,
  };

  res.status(statusCode).json(response);
};