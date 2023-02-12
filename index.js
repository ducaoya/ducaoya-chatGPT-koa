import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import { createApi, hasApi } from "./tools";

const app = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
  );
  ctx.set("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  if (ctx.method == "OPTIONS") {
    ctx.body = 200;
  } else {
    await next();
  }
});

router.get("/", (ctx) => {
  ctx.body = {
    result: "ok",
    msg: "test api ok",
  };
});

router.get("/create", (ctx) => {
  const { key } = ctx.request.query;
  console.log("[get] [create] key", key);

  if (key) {
    createApi(key);
    ctx.body = {
      result: "ok",
    };
  } else {
    ctx.body = {
      result: "error",
      msg: "key 为空",
    };
  }
});

router.post("/message", async (ctx) => {
  const { key, msg, opt } = ctx.request.body;
  console.log("[post] [message] body", { key, msg, opt });

  const api = hasApi(key);
  if (api) {
    const res = await api.sendMessage(msg, opt);
    ctx.body = {
      result: "ok",
      ...res,
    };
  } else {
    ctx.body = {
      result: "error",
      msg: "请先初始化 API",
    };
  }
});

app.use(bodyParser()).use(router.routes()).use(router.allowedMethods());

app.listen(7788, () => {
  console.log("server on : http://127.0.0.1:7788");
});
