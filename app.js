const express = require("express");
const app = express();
require("dotenv").config();
const router = require("./router/index.js");
const path = require("path");
const connectDb = require("./db.js");
const cors = require("cors");

var corsOptions = {
  credential: true,
  allowOrigin: ["https://memories1508.vercel.app/"],
  optionsSuccessStatus: 200,
};

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static("images"));
app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.use(cors(corsOptions));

router(app);

connectDb();

app.listen(process.env.PORT, () => {
  console.log("Listening on port " + process.env.PORT);
});
