const config = require('../config');
const axios = require('axios');

/**
 * Gitlab 请求封装
 * @param url
 * @param method
 * @param data
 * @return {*}
 */
const request = (url, method, data = null) => {
  // 处理分页
  const search = [];
  if (data.page) {
    search.push(['page', data.page]);
  }
  if (data.per_page) {
    search.push(['per_page', data.per_page]);
  }

  const searchStr = search.length === 0
    ? ''
    : `?${search.map(s => s.join('=')).join('&')}`;

  return axios({
    method,
    url: `${config.gitlab_url}${url}${searchStr}`,
    data,
    headers: {
      'Private-Token': config.gitlab_token
    }
  });
};

module.exports = {
  request
};
