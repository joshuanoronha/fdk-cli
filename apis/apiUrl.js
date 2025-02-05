const { readFile, writeFile } = require('../utils/file-utlis');
const fs = require('fs');
const rimraf = require('rimraf');
const urlJoin = require('url-join');
let url = '';

const getAPIUrl = host => {
  return `https://${host}`
};

const getSlingshotUrl = host => {
  const baseURl = getAPIUrl(host);
  const slingshot = urlJoin(baseURl, '/slingshot/v1');
  return slingshot;
};
const getPlatformUrl = host => {
  const baseURl = getAPIUrl(host);
  const platform = urlJoin(baseURl, '/platform/common/v1');
  return platform;
};
const getGrimlockUrl = host => {
  const baseURl = getAPIUrl(host);
  const grimlock = urlJoin(baseURl, '/auth/auth');
  return grimlock;
};

const getSkywarpUrl = host => {
  const baseURl = getAPIUrl(host);
  const skywarp = urlJoin(baseURl, '/service/panel/authentication');
  return skywarp;
};

const getFreewayUrl = host => {
  const baseURl = getAPIUrl(host);
  const freeway = urlJoin(baseURl, '/platform/custom/v1/application/current/pages');
  return freeway
};
const getGrindorUrl = host => {
  const baseURl = getAPIUrl(host);
  const grindor = urlJoin(baseURl, '/service/platform/assets');
  return grindor
};
const getBlitzkriegUrl = host => {
  const baseURl = getAPIUrl(host);
  const blitzkrieg = urlJoin(baseURl, '/platform/theme');
  return blitzkrieg
};
module.exports = {
  getSlingshotUrl,
  getGrimlockUrl,
  getPlatformUrl,
  getFreewayUrl,
  getGrindorUrl,
  getBlitzkriegUrl,
  getSkywarpUrl
};
