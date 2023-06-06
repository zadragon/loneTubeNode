const express = require("express");
const videoplay_router = express.Router();
require("dotenv").config();
const env = process.env;

const authMiddleware = require("../middlewares/auth-middleware");
const { User, VideoList, Comment } = require("../models");

//영상정보
videoplay_router.get("/videoinfo/:id", async (req, res, next) => {
  try {
    const MovieId = req.params.id;

    if (!MovieId || MovieId.length === 0) {
      res.status(404).json({ errorMessage: "영상 ID를 찾을 수 없습니다." });
      return;
    }

    // 해당 영상의 정보 조회
    const movie = await VideoList.findOne({
      where: { MovieId },
      attributes: ["UserId", "Title", "Like", "View", "URL"],
    });
    console.log(movie);
    const UserId = movie.UserId;

    const User_Info = await User.findOne({
      where: { id: UserId },
      attributes: ["UserId", "UserImage", "SubscriptCount"],
    });

    res.status(200).json({
      movie,
      User_Info,
    });
  } catch (error) {
    console.error("영상 조회 실패:", error);
    res.status(500).json({ error: "영상정보 조회에 실패했습니다." });
  }
});

//구독버튼
videoplay_router.post("/subscript", authMiddleware, async (req, res, next) => {
  try {
    // 로그인 사용자 확인
    const loginUser = res.locals.user;
    const loginUserId = loginUser.UserId;
    // 구독할 사용자 아이디
    const { userId } = req.body;
    // Sender 사용자 확인
    const senderUser = await User.findOne({ where: { UserId: loginUserId } });
    // console.log("센더유저:", senderUser);
    if (!senderUser) {
      res.status(404).json({ errorMessage: "사용자를 찾을 수 없습니다." });
      return;
    }
    // Receiver 사용자 확인
    const receiverUser = await User.findOne({ where: { UserId: userId } });
    if (!receiverUser) {
      res
        .status(404)
        .json({ errorMessage: "구독할 사용자를 찾을 수 없습니다." });
      return;
    }
    // 구독 체크
    // const existingSubscription = senderUser.SubscriptList.find(
    //   (subscription) => subscription.UserId === userId
    // );
    // if (existingSubscription) {
    //   res.status(400).json({ errorMessage: "이미 구독 중입니다." });
    //   return;
    // }
    // Receiver 사용자의 구독자수 추가
    if (!receiverUser.SubscriptCount) {
      receiverUser.SubscriptCount = 1;
    } else {
      receiverUser.SubscriptCount += 1;
    }
    await receiverUser.save();
    // Sender 사용자의 구독 리스트 추가
    console.log(1);
    //console.log(receiverUser.UserImage)
    const senderUserSublist = {
      UserId: userId,
      Thumbnail: receiverUser.UserImage,
    };
    console.log("receiverimage :", receiverUser.UserImage);
    if (!senderUser.SubscriptList) {
      senderUser.SubscriptList = [senderUserSublist];
    } else {
      let existingSubscriptions = [];
      if (typeof senderUser.SubscriptList === "string") {
        existingSubscriptions = JSON.parse(senderUser.SubscriptList);
      } else {
        existingSubscriptions = senderUser.SubscriptList;
      }
      existingSubscriptions.push(senderUserSublist);
      senderUser.SubscriptList = existingSubscriptions;
    }
    // console.log(senderUser.SubscriptList);
    console.log(senderUser.SubscriptList);
    await senderUser.save();
    res.status(200).json({ message: "구독이 추가되었습니다." });
  } catch (error) {
    console.error("구독 추가 실패:", error);
    res.status(500).json({ error: "구독 추가에 실패했습니다." });
  }
});

//좋아요버튼
videoplay_router.post("/:id/like", async (req, res, next) => {
  try {
    //const loginUser = res.locals.user;
    // const loginUserId = loginUser.UserId;

    const MovieId = req.params.id;

    // 영상 조회
    //const Movie = await VideoList.findByPk(MovieId);
    const Movie = await VideoList.findOne({ where: { MovieId } });

    if (!Movie) {
      res.status(404).json({ errorMessage: "영상을 찾을 수 없습니다." });
      return;
    }

    // 좋아요 수 증가
    Movie.Like += 1;
    await Movie.save();

    res
      .status(200)
      .json({ message: "영상에 좋아요를 눌렀습니다.", likes: Movie.Like });
  } catch (error) {
    console.error("좋아요 처리 실패:", error);
    res.status(500).json({ error: "좋아요 처리에 실패했습니다." });
  }
});

//댓글정보
videoplay_router.get("/:id/comment", async (req, res, next) => {
  try {
    const MovieId = req.params.id;

    if (!MovieId || MovieId.length === 0) {
      res.status(404).json({ errorMessage: "영상 ID를 찾을 수 없습니다." });
      return;
    }

    // 해당 영상의 댓글 목록 조회
    const comments = await Comment.findAll({
      where: { MovieId },
      attributes: ["UserId", "Comment"],
      order: [["createdAt", "DESC"]],
    });

    // 총 댓글 수량
    const commentCount = comments.length;

    res.status(200).json({
      comments,
      commentCount,
    });
  } catch (error) {
    console.error("댓글 조회 실패:", error);
    res.status(500).json({ error: "댓글 목록 조회에 실패했습니다." });
  }
});

//댓글입력
videoplay_router.post(
  "/:id/comment",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { commentText } = req.body;
      //const userId = req.body
      const userId = res.locals.user.UserId;

      if (!id || id.length === 0) {
        res.status(404).json({ errorMessage: "MovieId를 찾을 수 없습니다." });
        return;
      }

      if (!commentText || commentText === "") {
        res.status(404).json({ errorMessage: "comment를 입력해 주세요." });
        return;
      }

      // videolist에서 해당 영상의 정보조회
      const movie = await VideoList.findOne({ where: { MovieId: id } });

      if (!movie) {
        res.status(404).json({ errorMessage: "영상을 찾을 수 없습니다." });
        return;
      }

      const createdComment = await Comment.create({
        MovieId: movie.MovieId,
        UserId: userId,
        Comment: commentText,
        CommentId: null, // 초기에는 null로 설정
      });

      // CommentId를 생성된 댓글의 id로 업데이트
      createdComment.CommentId = createdComment.id;
      await createdComment.save();

      console.log(createdComment);
      res.status(200).json({ message: "댓글이 성공적으로 작성되었습니다." });
    } catch (error) {
      console.error("댓글 입력 실패:", error);
      res.status(400).json({ errorMessage: "댓글 입력을 실패하였습니다." });
    }
  }
);

//댓글삭제
videoplay_router.delete(
  "/movie/:id/comment/:commentId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { id, commentId } = req.params;

      console.log(id);
      console.log(commentId);

      if (!id || id.length === 0) {
        res.status(404).json({ errorMessage: "영상 ID를 찾을 수 없습니다." });
        return;
      }

      if (!commentId || commentId.length === 0) {
        res.status(404).json({ errorMessage: "댓글 ID를 찾을 수 없습니다." });
        return;
      }

      // 댓글 조회 후 삭제
      const comment = await Comment.findOne({
        where: { MovieId: id, CommentId: commentId },
      });

      if (!comment) {
        res
          .status(404)
          .json({ errorMessage: "삭제할 댓글을 찾을 수 없습니다." });
        return;
      }

      await comment.destroy();

      res.status(200).json({ message: "댓글이 성공적으로 삭제되었습니다." });
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      res.status(500).json({ error: "댓글 삭제에 실패했습니다." });
    }
  }
);

//조회수 증가
videoplay_router.get("/:id/view", async (req, res, next) => {
  const MovieId = req.params.id;
  const video_views_result = await VideoList.findOne({ where: { MovieId } });

  video_views_result.View += 1;
  await video_views_result.save();
  res
    .status(200)
    .json({ message: "조회수 증가", views: video_views_result.View });
});

module.exports = videoplay_router;
