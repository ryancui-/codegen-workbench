const router = require('koa-router')();
const { listProjects } = require('../../service/repository');

/**
 * 列出当前 Gitlab 所有项目
 */
router.get('/listProjects', async (ctx, next) => {
  const { data } = await listProjects();
  ctx.body = data;
});

module.exports = router;
