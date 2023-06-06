const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(
  cors({
    //origin: "http://54.180.85.55:3000",
    //origin: "*",
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie"],
  })
);

app.set("port", process.env.LISTEN_PORT || 3000);

const {
  authosRouter,
  mainlist_router,
  profile_router,
  videoplay_router,
  health_router,
} = require("./routes/index.js");
//const { videoplay_router } = require("./routes/index.js");

//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use("/api", health_router);
app.use(
  express.json({
    limit: "5mb",
  })
);
app.use(
  express.urlencoded({
    limit: "5mb",
    extended: false,
  })
);
app.use(cookieParser());

app.use("/api", [
  authosRouter,
  mainlist_router,
  profile_router,
  videoplay_router,
]);

// app.listen(app.get("port"), () => {
//   console.log(app.get("port"), "번 포트에서 대기 중");
// });
app.listen(app.get("port"), "0.0.0.0", () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
