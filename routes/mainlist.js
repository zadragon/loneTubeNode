const express = require("express");
const mainlist_router = express.Router();
require("dotenv").config();
const env = process.env;
const authMiddleware = require("../middlewares/auth-middleware");
const { User, VideoList, Comment } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var YouTube = require("youtube-node");

//구독리스트
mainlist_router.post("/sublist", authMiddleware, async (req, res, next) => {
  console.log("구독리스트 API 호출됨");
  //const UserId = "kbs뉴스";
  const { UserId } = res.locals.user;
  // const json_array = [
  //   { channelId: "kbs뉴스", Thumbnail: "URL1" },
  //   { channelId: "davin3", Thumbnail: "URL2" },
  //   { channelId: "zd99", Thumbnail: "URL3" },
  // ];
  // const sublist_create_result = await User.update(
  //   {
  //     SubscriptList: json_array,
  //   },
  //   {
  //     where: { UserId: UserId },
  //   }
  // );

  console.log(UserId);
  const SubListResult = await User.findAll({
    attributes: ["SubscriptList"],
    where: { UserId: UserId },
  });
  const Result_Json = JSON.stringify(SubListResult[0].SubscriptList);
  //console.log(`${Result_Json}`.replace(/\"/gi, ""));
  const temp = JSON.parse(`${SubListResult[0].SubscriptList}`);
  //return res.status(200).json(SubListResult);

  return res.status(200).json({ SubList: temp });

  //return res.status(200);
});

//영상 재생
mainlist_router.post("/play", async (req, res, next) => {
  console.log("영상 재생 API 호출됨");
  return res.status(200).json({ message: "영상 재생 API 호출됨" });
});

//영상 리스트 조회
mainlist_router.get("/videolist", async (req, res, next) => {
  console.log("영상 리스트 조회 API 호출됨");
  //저장된 동영상 불러오는 코드를 추가해서
  const VideoListResult = await VideoList.findAll({
    attributes: [
      "UserId",
      "MovieId",
      "Title",
      "Like",
      "View",
      "URL",
      "ThumbNail",
    ],
    include: [
      {
        model: User,
        attributes: ["UserImage"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  const Result_Json = JSON.stringify(VideoListResult);

  //console.log(`{ "VideoList": ${Result_Json} }`.replace(/\"/gi, ""));
  const temp = JSON.parse(`${Result_Json}`);
  return res.status(200).json({ VideoList: temp });
});

//무한스크롤
mainlist_router.get("/videolist/:page", async (req, res, next) => {
  console.log("무한스크롤 리스트 조회 API 호출됨");
  const { page } = req.params;
  const VideoListResult = await VideoList.findAll({
    attributes: [
      "UserId",
      "MovieId",
      "Title",
      "Like",
      "View",
      "URL",
      "ThumbNail",
    ],
    include: [
      {
        model: User,
        attributes: ["UserImage"],
      },
    ],
    order: [["createdAt", "DESC"]],
    offset: (page - 1) * 10,
    limit: 10,
  });
  const result = [];
  console.log(VideoListResult);
  VideoListResult.forEach((item) => {
    const scroll_result = {
      UserId: item.UserId,
      MovieId: item.MovieId,
      Title: item.Title,
      Like: item.Like,
      View: item.View,
      URL: item.URL,
      ThumbNail: item.ThumbNail,
      UserImage: item.User.UserImage,
    };
    result.push(scroll_result);
  });
  //console.log(result);
  //console.log("UserId:", VideoListResult.UserId);
  // const scroll_result = {
  //   UserId: VideoListResult.UserId,
  //   MovieId: VideoListResult.MovieId,
  //   Title: VideoListResult.Title,
  //   Like: VideoListResult.Like,
  //   View: VideoListResult.View,
  //   URL: VideoListResult.URL,
  //   ThumbNail: VideoListResult.ThumbNail,
  //   UserImage: VideoListResult.User.UserImage,
  // };

  const total_count = await VideoList.count();
  const total_page = Math.ceil(total_count / 10);
  const last_page = total_page == page ? true : false;
  //VideoListResult.push({ last_page: last_page });
  //VideoListResult.push({ total_page: total_page });
  const Result_Json = JSON.stringify(result);

  //console.log(`{ "VideoList": ${Result_Json} }`.replace(/\"/gi, ""));
  const temp = JSON.parse(`${Result_Json}`);
  return res
    .status(200)
    .json({ VideoList: temp, last_page: last_page, total_page: total_page });
  //return res.status(200).json({ VideoList: temp});
});

//검색기능
mainlist_router.post("/search", async (req, res, next) => {
  console.log("검색 API 호출됨");
  const { search } = req.body;
  console.log(req.body);
  console.log(search);
  const VideoSearchResult = await VideoList.findAll({
    attributes: [
      "id",
      "UserId",
      "MovieId",
      "Title",
      "Like",
      "View",
      "URL",
      "ThumbNail",
    ],
    include: [
      {
        model: User,
        attributes: ["UserImage"],
      },
    ],
    where: {
      Title: {
        [Op.like]: "%" + search + "%",
      },
    },
    order: [["createdAt", "DESC"]],
  });
  const result = [];
  VideoSearchResult.forEach((item) => {
    const scroll_result = {
      UserId: item.UserId,
      MovieId: item.MovieId,
      Title: item.Title,
      Like: item.Like,
      View: item.View,
      URL: item.URL,
      ThumbNail: item.ThumbNail,
      UserImage: item.User.UserImage,
    };
    result.push(scroll_result);
  });
  const Result_Json = JSON.stringify(result);
  const temp = JSON.parse(`${Result_Json}`);
  return res.status(200).json({ VideoList: temp });
});

//유튜브테스트
mainlist_router.get("/youtube", async (req, res, next) => {
  console.log("유튜브 API 호출됨");
  var youTube = new YouTube();

  youTube.setKey(env.YOUTUBE_API_KEY); // 여기에 실제 API 키를 입력

  youTube.search("항해99", 5, function (error, result) {
    console.log(result);
    // 'Search Keyword' 자리에 검색하고 싶은 키워드를 입력
    // result.items.forEach((item) => {
    //   console.log("Channel Name: ", item.snippet.channelTitle);
    //   console.log("Channel Thumbnail: ", item.snippet.thumbnails.default.url);
    //   console.log("Like", item.statistics.likeCount);
    //   console.log("Video Title: ", item.snippet.title);
    //   console.log("Video Thumbnail: ", item.snippet.thumbnails.high.url);
    //   console.log("---------------------------");
    // });
    const result_json = [];
    result.items.forEach((item) => {
      const temp_data = {
        //UserId: item.UserId,
        UserId: "17",
        MovieId: "Youtube",
        Title: item.snippet.title,
        Like: 99,
        View: 99999,
        URL: "TEMP URL",
        ThumbNail: "TEMP ThumbNail",
        UserImage: "USER IMAGE",
      };
      result_json.push(temp_data);
      console.log(item.snippet.title);
    });
    const Result_Json = JSON.stringify(result_json);
    const temp = JSON.parse(`${Result_Json}`);
    return res.status(200).json({ VideoList: temp });
  });
});

module.exports = mainlist_router;
