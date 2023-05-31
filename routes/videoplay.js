const express = require("express");
const videoplay_router = express.Router();
require("dotenv").config();
const env = process.env;

const authMiddleware = require("../middlewares/auth-middleware");
const { User, VideoList, Comment } = require("../models");


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
videoplay_router.post(
  "/:id/comment",
  authMiddleware,
  async (req, res, next) => {
    try {
      console.log(req.body);
      const MovieId = req.params.id;
      const { commentText } = req.body;
      const userId = res.locals.user.UserId;

      console.log(MovieId);
      console.log(commentText);

      if (!MovieId || MovieId.length === 0) {
        res.status(404).json({ errorMessage: "MovieId 를 찾을수 없습니다." });
        return;
      }

      if (!commentText || commentText === "") {
        res.status(404).json({ errorMessage: "comment 를 입력해 주세요." });
        return;
      }

      const createadComment = await Comment.create({
        MovieId,
        UserId: userId,
        Comment: commentText,
        // CommentId: createadComment.id,
      });
      console.log(createadComment);
      res.status(200).json({ message: "댓글이 성공적으로 작성되었습니다." });
    } catch (error) {
      console.log(error);
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
      const MovieId = req.params.id;
      const commentId = req.params.commentId;

      console.log(MovieId);
      console.log(commentId);

      if (!MovieId || MovieId.length === 0) {
        res.status(404).json({ errorMessage: "영상 ID를 찾을 수 없습니다." });
        return;
      }

      if (!commentId || commentId.length === 0) {
        res.status(404).json({ errorMessage: "댓글 ID를 찾을 수 없습니다." });
        return;
      }

      // 댓글 조회 후 삭제
      const comment = await Comment.findOne({
        where: { MovieId: MovieId, id: commentId },
      });
      console.log(comment);

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

module.exports = videoplay_router;
