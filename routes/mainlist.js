const express = require("express");
const mainlist_router = express.Router();
require("dotenv").config();
const env = process.env;
const authMiddleware = require("../middlewares/auth-middleware");
const { User, VideoList, Comment } = require("../models");

//구독리스트
mainlist_router.get("/sublist", authMiddleware, async (req, res, next) => {
  const { UserId } = res.locals.user;
  console.log(UserId);
  // const SubscriptResult = await User.findOne({ UserId });
  // console.log(SubscriptResult);
  // SubscriptResult.SubscriptList = SubscriptResult.SubscriptList.split(",");
  // console.log(SubscriptResult.SubscriptList);

  console.log("구독리스트 API 호출됨");
  return res.status(200);
});

//영상 재생
mainlist_router.get("/watch/:id", async (req, res, next) => {
  console.log("영상 재생 API 호출됨");
  return res.status(200);
});

//영상 리스트 조회
mainlist_router.get("/videolist", async (req, res, next) => {
  console.log("영상 리스트 조회 API 호출됨");
  var Youtube = require("youtube-node");
  var youtube = new Youtube();

  var word = ""; // 검색어 지정
  var limit = 5; // 출력 갯수

  youtube.setKey(env.YOUTUBE_API_KEY); // API 키 입력

  //// 검색 옵션 시작
  youtube.addParam("order", "rating"); // 평점 순으로 정렬
  youtube.addParam("type", "video"); // 타입 지정
  youtube.addParam("videoLicense", "youtube"); // 크리에이티브 커먼즈 아이템만 불러옴
  //// 검색 옵션 끝
  youtube.search(word, limit, function (err, result) {
    // 검색 실행
    if (err) {
      console.log(err);
      return;
    } // 에러일 경우 에러공지하고 빠져나감

    //console.log(JSON.stringify(result, null, 2)); // 받아온 전체 리스트 출력

    var items = result["items"]; // 결과 중 items 항목만 가져옴

    for (var i in items) {
      var it = items[i];
      console.log(it);
      var title = it["snippet"]["title"];
      var video_id = it["id"]["videoId"];
      var thumbnail = it["snippet"]["thumbnails"]["default"]["url"];
      var url = "https://www.youtube.com/watch?v=" + video_id;
      console.log(`${i}` + "제목 : " + title);
      console.log("URL : " + url);
      console.log("ThumbNail : " + thumbnail);
      youtube.getChannelById(
        it["snippet"]["channelId"],
        function (err, result) {
          if (err) {
            console.log(err);
            return;
          }
          //console.log(JSON.stringify(result, null, 2));
          var channel_thumbnail =
            result["items"][0]["snippet"]["thumbnails"]["default"]["url"];

          console.log("ChannelThumbNail : " + channel_thumbnail);
          console.log("-----------");
        }
      );
    }
  });

  //
  //저장된 동영상 불러오는 코드를 추가해서

  //

  const VideoListResult = await VideoList.create({
    UserId: "1",
    Title: "test",
    Like: 0,
    View: 0,
    URL: "test",
  });
  return res.status(200).json({ message: "youtube 조회 성공" });
});

module.exports = mainlist_router;
