const express = require("express");
const profile_router = express.Router();
const multer = require("multer");
require("dotenv").config();
const env = process.env;
const authMiddleware = require("../middlewares/auth-middleware");
const { User, VideoList, Comment } = require("../models");
//const upload = multer({ dest: "uploads/" }); // 파일이 저장될 디렉토리 지정
const upload = multer({ storage: multer.memoryStorage() }); // 메모리에 파일 저장

//프로필 사진 올리기
profile_router.put(
  "/profile",
  upload.single("file"),
  async (req, res, next) => {
    //const { UserId } = res.locals.user;
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    //console.log(req.file);
    // 파일을 base64로 인코딩
    const base64Data = req.file.buffer.toString("base64");

    const profile_image_upload_result = await User.update(
      {
        //UserImage: "base64Data",
        UserImage: base64Data,
      },
      {
        where: { UserId: "kbs뉴스" },
      }
    );
    console.log("프로필 수정 API 완료");

    return res.status(200).json({ message: "프로필 수정 API 호출됨" });
  }
);

//내가 올린 동영상 목록
profile_router.get("/myvideolist", async (req, res, next) => {
  console.log("내가 올린 동영상 목록 API 호출됨");
  //const { UserId } = res.locals.user;
  const UserId = "davin3";
  const UserId_result = await User.findAll({
    attributes: ["id"],
    where: { UserId: UserId },
  });
  const MyVideoList = await VideoList.findAll({
    attributes: ["UserId", "MovieId", "Title", "Like", "View", "URL"],
    where: { UserId: UserId_result[0].id },
  });
  console.log(MyVideoList);
  return res.status(200).json({ MyVideoList });
});

//동영상 삭제
profile_router.delete("/myvideolist/:MovieId", async (req, res, next) => {
  console.log("동영상 삭제 API 호출됨");
  const { MovieId } = req.params;

  VideoList.destroy({
    where: { MovieId: MovieId },
  });

  return res.status(200).json({ message: "동영상 삭제 완료!!" });
});
//사용자 정보 (사용자 이름, 구독자수, 내가 올린 영상 갯수, 프로필 사진 url)
profile_router.get("/profile", async (req, res, next) => {
  console.log("사용자 정보 API 호출됨");
  //const { UserId } = res.locals.user;
  const UserId = "davin3";
  const UserId_result = await User.findAll({
    attributes: ["id", "UserImage", "SubscriptCount"],
    where: { UserId: UserId },
  });
  const MyVideoCount = await VideoList.count({
    where: { UserId: UserId_result[0].id },
  });

  const result_json = {
    UserId: UserId,
    SubscriptCount: UserId_result[0].SubscriptCount,
    UserImage: UserId_result[0].UserImage,
    MyVideoCount: MyVideoCount,
  };

  return res.status(200).json({ result_json });
});

//영상 올리기
profile_router.post(
  "/upload",
  upload.single("file"),
  async (req, res, next) => {
    console.log("영상 올리기 API 호출됨");
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    //console.log(req.file);
    // 파일을 base64로 인코딩
    const base64Data = req.file.buffer.toString("base64");

    const { UserId, Title, URL } = req.body;
    const video_upload_result = await VideoList.create({
      UserId: UserId,
      Title: Title,
      URL: URL,
      ThumbNail: base64Data,
    });

    return res.status(200);
  }
);
module.exports = profile_router;
