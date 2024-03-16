// yarn add date-fns
const { format } = require("date-fns");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "yyyy.MM.dd  HH:mm:ss")}`;
  const logItem = `${dateTime} -- ${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "..", "logs"));
    }

    // fsPromises.appendFile(path, data[, options])
    await fsPromises.appendFile(
      path.join(__dirname, "..", "..", "logs", logName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) => {
  const origin = req.headers.origin ?? "localhost";
  logEvents(`${req.method}\t${origin}\t${req.url}`, "reqLog.txt");
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logger, logEvents };
