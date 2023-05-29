const express = require("express");
const profile_router = express.Router();
require("dotenv").config();
const env = process.env;
//프로필 사진 올리기
profile_router.put("api/profile", async (req, res, next) => {
  console.log("프로필 수정 API 호출됨");
  return res.status(200);
});

//내가 올린 동영상 목록
profile_router.get("api/myvideolist", async (req, res, next) => {
  console.log("내가 올린 동영상 목록 API 호출됨");
  return res.status(200);
});

//동영상 삭제
profile_router.delete("api/myvideolist/:id", async (req, res, next) => {
  console.log("동영상 삭제 API 호출됨");
  return res.status(200);
});
//사용자 정보 (사용자 이름, 구독자수, 내가 올린 영상 갯수, 프로필 사진 url)
profile_router.get("api/profile", async (req, res, next) => {
  console.log("사용자 정보 API 호출됨");
  return res.status(200);
});

//영상 올리기
profile_router.post("api/upload", async (req, res, next) => {
  console.log("영상 올리기 API 호출됨");
  return res.status(200);
});
