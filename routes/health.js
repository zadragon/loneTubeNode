const express = require("express");
const health_router = express.Router();

// ◎ 상태체크 API
health_router.get("/health", async (req, res, next) => {
  console.log("helath Check");
  return res.status(200).json({ message: "OK 200" });
});

module.exports = health_router;
