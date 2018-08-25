const config = require('../config')
const axios = require('axios')

/**
 * Gitlab 请求封装
 * @param url
 * @param method
 * @param data
 * @return {*}
 */
const request = (url, method, data = null) => {
  // 处理分页
  const search = []
  if (data.page) {
    search.push(['page', data.page])
  }
  if (data.per_page) {
    search.push(['per_page', data.per_page])
  }

  const searchStr = search.length === 0
    ? ''
    : `?${search.map(s => s.join('=')).join('&')}`

  return axios({
    method,
    url: `${config.gitlab_url}${url}${searchStr}`,
    data,
    headers: {
      'Private-Token': config.gitlab_token
    }
  })
}

/**
 * 列出所有项目
 * @return {Promise<Array>}
 */
const listProjects = async () => {
  let page = 1
  let per_page = 100
  let projects = []

  while (true) {
    const {headers, data} = await request('/projects', 'GET', {
      page,
      per_page,
      simple: true
    })

    projects.push(...data)
    if (page == headers['x-total-pages']) {
      break
    } else {
      page++
    }
  }

  return projects
}

/**
 * 列出项目的顶级目录树
 * @param projectId
 * @return {*}
 */
const listProjectTree = (projectId) => request(`/projects/${projectId}/repository/tree`, 'GET')

/**
 * 向 Gitlab 提交一个 commit
 * @param projectId
 * @param branch
 * @param commit_message
 * @param actions
 * @return {*}
 */
const makeCommit = (projectId, branch, commit_message, actions) =>
  request(`/projects/${projectId}/repository/commits`, 'POST', {
    branch,
    commit_message,
    actions
  })

module.exports = {
  listProjects,
  listProjectTree,
  makeCommit
}
