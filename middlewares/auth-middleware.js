const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  try {
    console.log(1);
    console.log(req.body);
    //const { authorization } = req.cookies;
    const { authorization } = req.body;
    console.log(authorization);
    console.log(2);
    const [tokenType, token] = authorization.split(" "); // 중괄호{} 를 대괄호[]로 수정
    console.log(3);
    if (!req.file) {
      console.log("!!!!!!!!file 없음!!!!!!!!!!");
    } else {
      req.file = "temp file from auth-middleware.js";
    }

    // # 403 Cookie가 존재하지 않을 경우
    if (!authorization) {
      return res
        .status(403)
        .json({ errorMessage: "로그인이 필요한 기능입니다." });
    }
    //console.log(tokenType);
    if (tokenType !== "Bearer") {
      return res.status(401).json({
        errorMessage:
          "tokenType != Bearer 전달된 쿠키에서 오류가 발생하였습니다.",
      });
    }
    console.log(4);
    const decodedToken = jwt.verify(token, "loneTube_key_256");
    const UserId = decodedToken.UserId;
    console.log(5);
    const user = await User.findOne({ where: { UserId } });
    if (!user) {
      res.clearCookie("authorization");
      return res.status(403).json({
        errorMessage: "!user 전달된 쿠키에서 오류가 발생하였습니다.!",
      });
    }

    res.locals.user = user;

    next();
  } catch (error) {
    res.clearCookie("authorization");
    return res.status(403).json({
      errorMessage: "catch error 전달된 쿠키에서 오류가 발생하였습니다.",
    });
  }
};
