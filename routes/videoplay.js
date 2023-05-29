const express = require("express");
const videoplay_router = express.Router();
require("dotenv").config();
const env = process.env;

//영상정보
videoplay_router.get("/api/videoinfo/:id", async (req, res, next) => {
  console.log("영상 정보 API 호출됨");
  return res.status(200);
});

//구독버튼
videoplay_router.post("/api/subscript", async (req, res, next) => {
  console.log("구독 API 호출됨");
  return res.status(200);
});

//좋아요버튼
videoplay_router.post("/api/:id/like", async (req, res, next) => {
  console.log("좋아요 API 호출됨");
  return res.status(200);
});

//댓글정보
videoplay_router.get("/api/:id/comment", async (req, res, next) => {
  console.log("댓글 정보 API 호출됨");
  return res.status(200);
});

//댓글입력
videoplay_router.post("/api/:id/comment", async (req, res, next) => {
  console.log("댓글 입력 API 호출됨");
  return res.status(200);
});

//댓글삭제
videoplay_router.delete("/api/:movieid/comment/:id", async (req, res, next) => {
  console.log("댓글 삭제 API 호출됨");
  return res.status(200);
});
