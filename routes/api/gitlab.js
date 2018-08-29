const router = require('koa-router')()
const path = require('path')
const fs = require('fs')
const config = require('../../config')
const {
  listProjects,
  listProjectTree,
  makeCommit
} = require('../../service/gitlab_api')
const {
  initCodegenPath,
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
  const params = ctx.request.body
  console.log(params)

  try {
    const codegenPath = path.join(config.codegen_base, `gen_${Date.now()}`)

    // 生成临时路径
    await initCodegenPath(codegenPath)

    const execCommand = `
      java -jar ${path.join(config.codegen_base, 'service-code/service-code-generation.jar')} 
      -out ${codegenPath} 
      -module ${params.moduleName} 
      -clazz ${params.beanName} 
      -table ${params.tableName} 
      -package com.gzkit.backend 
      -url "${params.jdbcUrl}" 
      -driver ${params.jdbcDriver} 
      -catalog ${params.jdbcDatabase} 
      -username ${params.jdbcUsername} 
      -password ${params.jdbcPassword} 
      -template ${path.join(config.codegen_base, 'templates/platform-service-template')}`

    // 生成代码
    await execCodegen(execCommand, codegenPath)


    // 整理上传 actions 数组
    // const actions = await generateActions(path.join(codegenDir, 'src'), selectedBase)

    // 提交commit
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
