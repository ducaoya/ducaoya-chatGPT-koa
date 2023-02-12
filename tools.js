import { ChatGPTAPI } from "chatgpt";

export let apis = [];

/**
 * 创建Api
 * @param {string} key
 */
export function createApi(key) {
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
export function hasApi(key) {
  const result = apis.find((item) => item.key === key);
  return result.api || false;
}
