const express = require("express");
const mainlist_router = express.Router();
require("dotenv").config();
const env = process.env;
const authMiddleware = require("../middlewares/auth-middleware");
const { User, VideoList, Comment } = require("../models");

//구독리스트
mainlist_router.post("/sublist", async (req, res, next) => {
  console.log("구독리스트 API 호출됨");
  const UserId = "kbs뉴스";
  //const { UserId } = res.locals.user;
  const json_array = [
    { channelId: "kbs뉴스", Thumbnail: "URL1" },
    { channelId: "davin3", Thumbnail: "URL2" },
    { channelId: "zd99", Thumbnail: "URL3" },
  ];
  const sublist_create_result = await User.update(
    {
      SubscriptList: json_array,
    },
    {
      where: { UserId: UserId },
    }
  );

  console.log(UserId);
  const SubListResult = await User.findAll({
    attributes: ["UserId", "SubscriptList"],
    where: { UserId: UserId },
  });
  const Result_Json = JSON.stringify(SubListResult[0].SubscriptList);
  console.log(`${Result_Json}`.replace(/\"/gi, ""));
  const temp = JSON.parse(`${SubListResult[0].SubscriptList}`);
  //return res.status(200).json(SubListResult);
  return res.status(200).json({ SubList: temp });

  //return res.status(200);
});

//영상 재생
mainlist_router.get("/watch/:id", async (req, res, next) => {
  console.log("영상 재생 API 호출됨");
  return res.status(200);
});

//영상 리스트 조회
mainlist_router.get("/videolist", async (req, res, next) => {
  console.log("영상 리스트 조회 API 호출됨");
  //저장된 동영상 불러오는 코드를 추가해서
  const VideoListResult = await VideoList.findAll({
    attributes: ["UserId", "MovieId", "Title", "Like", "View", "URL"],
  });

  const Result_Json = JSON.stringify(VideoListResult);

  console.log(`{ "VideoList": ${Result_Json} }`.replace(/\"/gi, ""));
  const temp = JSON.parse(`${Result_Json}`);
  return res.status(200).json({ VideoList: temp });
});

module.exports = mainlist_router;
