const { request } = require('./gitlab_api');

const listProjects = (page = 1, per_page = 100) => request('/projects', 'GET', {
  page,
  per_page
});

module.exports = {
  listProjects
};
