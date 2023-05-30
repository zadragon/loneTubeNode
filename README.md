[항해99 파트타임 1기][Chapter 5] 클론코딩 프로젝트

```
# express, sequelize, mysql2 라이브러리를 설치합니다.
npm install express sequelize mysql2

# sequelize-cli, nodemon 라이브러리를 DevDependency로 설치합니다.
npm install -D sequelize-cli nodemon

# 설치한 sequelize를 초기화 하여, sequelize를 사용할 수 있는 구조를 생성합니다.
npx sequelize init
```

```
#.env 파일 내용
  DB_USERNAME= DB유저 이름 (ex : root)
  DB_PASSWORD= DB암호 (ex : 1q2w3e4r)
  DB_DATABASE= DB이름 (ex : lonetube)
  DB_HOST=HOST 주소 (ex : DATABASE.c1dkpbd3eny.ap-northeast-2.rds.amazonaws.com)
  LISTEN_PORT=포트번호 (ex : 3000)
```

```
내 프로젝트 폴더 이름
├── config
│   └── config.js
├── middlewares
│   └── auth-middleware.js
├── migrations
├── models
│   ├── comment.js
│   ├── index.js
│   ├── user.js
│   └── videolist.js
│
├── routes
│   ├── auth.js
│   ├── index.js
│   ├── mainlist.js
│   ├── profile.js
│   └── videoplay.js
│
├── package-lock.json
│
├── package.json
│
└── app.js
```

```
npx sequelize db:create
```

```
npx sequelize model:generate --name User --attributes UserId:string,password:string,ChannelTitle:string,UserImage:string,SubscriptCount:integer,SubscriptList:json
npx sequelize model:generate --name VideoList --attributes UserId:string,MovieId:string,Title:string,Like:integer,View:integer,URL:string
npx sequelize model:generate --name Comment --attributes MovieId:string,CommentId:string,UserId:string,Comment:string
```

```
npx sequelize db:migrate
```
