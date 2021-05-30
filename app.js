/** BizTime express application. */
const express = require("express");
const app = express();
const ExpressError = require("./expressError")


app.use(express.json());


const companyRoute = require("./routes/companies")
const invoicesRoute = require("./routes/invoices")
const industriesRoute = require("./routes/industries")


app.use("/companies",companyRoute)
app.use("/invoices",invoicesRoute)
app.use("/industries",industriesRoute)


/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
