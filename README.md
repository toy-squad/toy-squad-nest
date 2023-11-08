## toy-squad 서버

- [Notion 페이지](https://periodic-quokka-f6d.notion.site/Toy-Squad-c86cdb10cff44743829f0e2178416f75)

- swagger 확인
  - 로컬호스트: `localhost:3001/swagger`

## 설치

```bash
$ npm install
```

## 앱 실행

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 앱 Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

---

## 초기 셋팅



### 1) 로컬호스트 환경 셋팅

- Mysql 8.0
- Redis

```
$ docker-compose up -d
```



![image](https://media.discordapp.net/attachments/1089898822529994773/1115271204153065620/image.png?width=1920&height=498)



### 2) Redis Insight 환경셋팅

- 로컬호스트의 레디스를 사용할 경우
  - 사전에 도커를 실행 후에 등록해야합니다.

![image](https://cdn.discordapp.com/attachments/1091613369007612035/1130906798732365844/image.png)


- 프로덕션의 레디스 사용할경우

![image](https://media.discordapp.net/attachments/1091613369007612035/1130900773472051230/2023-07-19_1.34.20.png?width=748&height=936)

