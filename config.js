require('dotenv').config();

const { VK, API } = require('vk-io');

const _VK = new VK({
  token: process.env.LONG_POLL_TOKEN,
  apiVersion: '5.199',
});

const _API_VK = new API({
  token: process.env.USER_TOKEN,
  apiVersion: '5.199',
});

PAGE_ID = process.env.PAGE_ID;

USER_ID = process.env.USER_ID;

GROUP_ID = process.env.GROUP_ID;

PAGE_URL = process.env.PAGE_URL;

module.exports = {
  _VK,
  _API_VK,
  PAGE_ID,
  USER_ID,
  GROUP_ID,
  PAGE_URL,
};
