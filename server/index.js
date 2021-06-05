const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();
const port = process.env.PORT || 3001;
const router = require("./routes/index.js");
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../public")));
app.use("/api/qa", router);
app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});
