const appRoot = require("app-root-path").path;
const moment = require("moment");
const logFile = `${appRoot}/logs/logfile${moment().format("YYYY-MM-DD")}.log`;
const { createLogger, format, transports } = require("winston");
const { combine, colorize, timestamp, label, printf } = format;

const myLogFormat = printf(
  ({ level, message, label, timestamp }) =>
    `${timestamp} [${label}] ${level}: ${message}`
);

const logger = createLogger({
  format: combine(label({ label: "No Label" }), timestamp(), myLogFormat),
  transports: [new transports.File({ filename: logFile })]
});

function setLabel(loggedBy = "No Label") {
  logger.format = combine(label({ label: loggedBy }), timestamp(), myLogFormat);
  if (process.env.NODE_ENV !== "production") {
    const stderror = new transports.Console({
      format: combine(
        colorize(),
        label({ label: loggedBy }),
        timestamp(),
        myLogFormat
      )
    });
    logger.add(stderror);
  }
}

module.exports = { logger, setLabel };
