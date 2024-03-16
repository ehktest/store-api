"use strict";

module.exports = (err, req, res, next) => {
  // checking response whether custom error status code is set
  const errorStatusCode = res?.errorStatusCode ?? 500;
  // trying to print error.cause first if it is set
  console.error(`Error : ${(err?.cause ?? err?.message ?? err?.stack) || err}`);
  res
    .status(errorStatusCode) // 500 Internal Server Error
    .send({
      error: true,
      code: errorStatusCode,
      message: err?.message,
      cause: err?.cause,
      stack: err?.stack,
    });
};
