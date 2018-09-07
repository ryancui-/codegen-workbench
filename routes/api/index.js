const router = require('koa-router')()
const path = require('path')
const fs = require('fs')
const config = require('../../config')
const {
  removeDir,
  promisify
} = require('../../utils/fs_utils')

const {
  listProjects,
  listProjectTree,
  makeCommit
} = require('../../service/gitlab_api')
const {
  execCodegen,
  generateActions,
  generateDirTree,
  readFile,
  writeFile
} = require('../../service/file')

router.prefix('/api')

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
  const params = ctx.request.body
  const serviceCodeConfig = config.codegens.find(gen => gen.id === 'service-code')
  if (!serviceCodeConfig) {
    ctx.body = {
      success: false,
      msg: '没有对应代码生成器配置'
    }
    return
  }

  const codegenPath = path.join(config.codegen_base, `gen_${Date.now()}`)

  try {
    // 生成临时路径
    await promisify(fs.mkdir)(codegenPath, 0777)

    const commandParams = []
    commandParams.push(['-out', codegenPath])
    commandParams.push(['-module', params.moduleName])
    commandParams.push(['-clazz', params.beanName])
    commandParams.push(['-table', params.tableName])
    commandParams.push(['-package', 'com.gzkit.backend'])
    commandParams.push(['-url', `"${params.jdbcUrl}"`])
    commandParams.push(['-driver', params.jdbcDriver])
    commandParams.push(['-catalog', params.jdbcDatabase])
    commandParams.push(['-username', params.jdbcUsername])
    commandParams.push(['-password', params.jdbcPassword])
    commandParams.push(['-template', path.join(config.codegen_base, serviceCodeConfig.template_path)])

    const execCommand = `java -jar ${path.join(config.codegen_base, serviceCodeConfig.executable_path)} ${commandParams.map(c => c.join(' ')).join(' ')}`

    // 生成代码
    await execCodegen(execCommand, codegenPath)

    // 整理上传 actions 数组
    const actions = await generateActions(path.join(codegenPath, 'src'), params.mergeDir)

    // 提交commit
    const commitMsg = `codegen: add ${params.beanName} files`
    await makeCommit(params.projectId, params.branchName, commitMsg, actions)

    ctx.body = {
      success: true
    }
  } catch (e) {
    console.log(e)
    ctx.body = {
      success: false,
      msg: e.message || '内部服务器错误'
    }
  } finally {
    // 删除临时目录
    await removeDir(codegenPath)
  }
})

/**
 * 返回模板文件树
 */
router.get('/listTemplateTree/:name', async (ctx, next) => {
  ctx.body = await generateDirTree(path.join(config.codegen_base, `templates/${ctx.params.name}`))
})

/**
 * 读取文件
 */
router.post('/readFile', async (ctx, next) => {
  const params = ctx.request.body

  ctx.body = await readFile(params.path)
})

/**
 * 写入文件
 */
router.post('/writeFile', async (ctx, next) => {
  const params = ctx.request.body

  try {
    await writeFile(params.path, params.content)

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
