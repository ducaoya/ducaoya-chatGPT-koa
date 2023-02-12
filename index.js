import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import { ChatGPTAPI } from "chatgpt";

const app = new Koa();
const router = new Router();

let apis = [];
let log = [];

/**
 * 创建Api
 * @param {string} key
 */
function createApi(key) {
  let api = hasApi(key);
  if (!api) {
    api = new ChatGPTAPI({
      apiKey: key,
    });

    apis.push({ key, api });
  }

  return api;
}

/**
 * 判断是否有api
 * @param {string} key
 * @returns {boolean | object}
 */
function hasApi(key) {
  const result = apis.find((item) => item.key === key);
  return result?.api || false;
}

/**
 * 记录日志
 * @param {string} api 接口
 * @param {any} msg 内容
 */
function pushLog(api, content) {
  log.push({
    api,
    content,
  });
}

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

router.get("/log", (ctx) => {
  ctx.body = {
    result: "ok",
    log,
  };
});

router.get("/clean_log", (ctx) => {
  log = [];
  ctx.body = {
    result: "ok",
    log,
  };
});

router.get("/create", (ctx) => {
  const { key } = ctx.request.query;
  pushLog("[get] [create] key", key);

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
  pushLog("[post] [message] body", { key, msg, opt });

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
