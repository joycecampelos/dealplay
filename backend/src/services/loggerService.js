import fs from "fs";
import path from "path";
import winston from "winston";
import dotenv from "dotenv";

dotenv.config();

function getLogDir() {
  if (process.env.VERCEL || process.env.AWS_REGION) {
    return "/tmp/logs";
  }
  return path.resolve("logs");
}

const logDir = getLogDir();

try {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
} catch (err) {
  if (err.code === "EROFS") {
    console.warn("Logs em disco desativados (sistema somente leitura). Usando apenas console.");
  } else {
    console.error("Erro ao criar diretório de logs:", err);
  }
}

const transports = [];

if (process.env.NODE_ENV === "production") {
  transports.push(
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );
} else {
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDir, "app.log"),
      level: "info",
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports,
  silent: process.env.NODE_ENV === "test",
});

export default logger;
