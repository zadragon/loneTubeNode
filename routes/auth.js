const express = require("express");
const authos_router = express.Router();
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth-middleware");
const crypto = require("crypto");
const requestIp = require("request-ip");

// ◎ 회원가입 API
authos_router.post("/signup", async (req, res, next) => {
  console.log("회원가입 API 호출됨");
  const { UserId, password } = req.body;
  console.log(UserId, password);
  try {
    // 닉네임으로 중복가입 여부 확인

    const isExistUserId = await User.findOne({
      where: { UserId: UserId },
    });
    if (isExistUserId) {
      // 이미 해당 이메일로 가입했다면,
      res.status(412).json({ errorMessage: "중복된 이메일입니다." });
      return;
    }
    console.log("중복체크 완료");
    // 패스워드 형식 확인: 특수문자(@$!%*?&)의무포함, 알파벳 소문자 의무포함, 대문자 가능, 4~20자

    const pwCheck = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    /*
    (?=.*[A-Za-z]): 알파벳 문자가 최소 하나 이상 포함되어야 함
    (?=.*\d): 숫자가 최소 하나 이상 포함되어야 함
    [A-Za-z\d]{8,}: 알파벳 또는 숫자로 구성된 문자열이 8자 이상
    ^ 와 $: 문자열의 시작과 끝을 나타냄. 이는 전체 문자열이 이 조건을 만족해야 한다는 것을 의미
    */

    if (!pwCheck.test(password)) {
      res
        .status(412)
        .json({ errorMessage: "패스워드 형식이 올바르지 않습니다." });
      return;
    }
    console.log("패스워드 형식 확인 완료");

    // 패스워드가 아이디에 포함하는지 여부 확인
    if (password.includes(UserId)) {
      res
        .status(412)
        .json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다." });
      return;
    }

    const crypyedPw = crypto
      .createHash("sha512")
      .update(password)
      .digest("base64");

    await User.create({
      UserId,
      password: crypyedPw,
    });
    console.log("회원가입 완료");

    return res.status(201).json({ message: "회원가입 성공" });
  } catch (error) {
    // 예상치 못한 에러 대응
    return res.status(400).json({ message: "요청이 올바르지 않습니다." });
  }
});

// ◎ 로그인 API
authos_router.post("/login", async (req, res, next) => {
  try {
    const ip = requestIp.getClientIp(req);
    console.log(ip);
    const { UserId, password } = req.body;
    const crypyedPw = crypto
      .createHash("sha512")
      .update(password)
      .digest("base64");

    const user = await User.findOne({ where: { UserId } });
    if (!user || user.password !== crypyedPw) {
      return res
        .status(412)
        .json({ errorMessage: "아이디 또는 패스워드를 확인해주세요." });
    }

    const token = jwt.sign(
      {
        UserId: user.UserId,
      },
      "loneTube_key_256"
    );
    //res.cookie("authorization", `Bearer ${token}`);
    res.cookie("authorization", `Bearer ${token}`, {
      domain: "localhost",
      secure: false,
      sameSite: "strict",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, //1 day
    });
    //res.body = { authorization: `Bearer ${token}` };
    //return res.status(200).json({ authorization: `Bearer ${token}` });
    return res.status(200).json({ authorization: `Bearer ${token}` });
  } catch (error) {
    return res.json({ message: "로그인에 실패하였습니다." });
  }
});

module.exports = authos_router;
