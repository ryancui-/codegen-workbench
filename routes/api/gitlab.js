const router = require('koa-router')()
const path = require('path')
const {
  listProjects,
  listProjectTree,
  makeCommit
} = require('../../service/gitlab_api')
const {
  execCodegen,
  generateActions
} = require('../../service/file')

/**
 * 列出当前 Gitlab 所有项目
 */
router.get('/listProjects', async (ctx, next) => {
  ctx.body = await listProjects()
})

/**
 * 列出项目的顶级目录树
 */
router.get('/listProjectTree/:id', async (ctx, next) => {
  const {data} = await listProjectTree(ctx.params.id)
  ctx.body = data
})

/**
 * 代码生成
 */
router.post('/codegen', async (ctx, next) => {
  const config = ctx.request.body
  console.log(config)

  const codegenDir = ''
  const selectedBase = ''
  const projectId = ''
  const defaultBranch = ''

  try {
    // const actions = await generateActions(path.join(codegenDir, 'src'), selectedBase)

    // await makeCommit(projectId, defaultBranch, 'Codegen By workbench', actions)

    ctx.body = {
      success: true
    }
  } catch (e) {
    ctx.body = {
      success: false,
      msg: e.message || '内部服务器错误'
    }
  }

})

module.exports = router
