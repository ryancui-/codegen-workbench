const fs = require('fs')
const path = require('path')
const child_process = require('child_process')
const config = require('../config')
const {promisify} = require('../utils/fs_utils')

/**
 * 读取文件并添加 Action
 * @param dir
 * @param actions
 */
const readDirectory = async (dir, actions, rootDir, dirPrefix) => {
  const files = await promisify(fs.readdir)(dir)

  for (let i = 0; i < files.length; i++) {
    const filename = files[i]
    const fullpath = path.join(dir, filename)
    const stats = await promisify(fs.stat)(fullpath)
    if (stats.isFile()) {
      const fileContent = await promisify(fs.readFile)(fullpath, {
        encoding: 'utf-8'
      })

      actions.push({
        action: 'create',
        file_path: path.join(dirPrefix, path.relative(rootDir, fullpath)),
        content: fileContent
      })

    } else if (stats.isDirectory()) {
      await readDirectory(fullpath, actions, rootDir, dirPrefix)
    }
  }
}

/**
 * 传入根目录，构造提交 Gitlab Commit 的 Actions 数组
 */
const generateActions = async (rootDir, dirPrefix) => {
  const rootStats = await promisify(fs.stat)(rootDir)

  if (rootStats.isFile()) {
    throw new Error('Must be directory')
  } else {
    const actions = []
    await readDirectory(path.resolve(rootDir), actions, path.join(rootDir, '..'), dirPrefix)
    return actions
  }
}

/**
 * 执行代码生成，同步
 * @param codegenPath
 */
const execCodegen = (command, codegenPath) => new Promise((resolve, reject) => {
  child_process.exec(command, {
    shell: true
  }, (err) => {
    resolve()
  })
})

module.exports = {
  execCodegen,
  generateActions
}
