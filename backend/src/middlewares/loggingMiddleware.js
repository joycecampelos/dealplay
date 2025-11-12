import logger from "../services/loggerService.js";

export function requestLogger(req, res, next) {
  const ip = req.ip === "::1" ? "127.0.0.1" : req.ip;
  logger.info({
    event: "http_request",
    method: req.method,
    path: req.path,
    ip,
  });
  next();
}

export function errorLogger(err, req, res, next) {
  logger.error({
    event: "unhandled_error",
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  res.status(500).json({ error: "Erro interno do servidor" });
}

export function registerProcessHandlers() {
  process.on("uncaughtException", (err) => {
    logger.error({
      event: "uncaughtException",
      message: err.message, stack: err.stack
    });
  });

  process.on("unhandledRejection", (reason) => {
    logger.error({
      event: "unhandledRejection",
      message: reason?.message || String(reason),
    });
  });
}
