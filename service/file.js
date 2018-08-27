const fs = require('fs')
const path = require('path')
const child_process = require('child_process')
const config = require('../config')

/**
 * 读取文件并添加 Action
 * @param dir
 * @param actions
 */
const readDirectory = (dir, actions, rootDir, dirPrefix) => {
  const files = fs.readdirSync(dir)
  files.forEach(filename => {
    const fullpath = path.join(dir, filename)
    const stats = fs.statSync(fullpath)
    if (stats.isFile()) {
      const fileContent = fs.readFileSync(fullpath, {
        encoding: 'utf-8'
      })

      actions.push({
        action: 'create',
        file_path: path.join(dirPrefix, path.relative(rootDir, fullpath)),
        content: fileContent
      })

    } else if (stats.isDirectory()) {
      readDirectory(fullpath, actions, rootDir, dirPrefix)
    }
  })
}

/**
 * 传入根目录，构造提交 Gitlab Commit 的 Actions 数组
 */
const generateActions = (rootDir, dirPrefix) => new Promise((resolve, reject) => {
  const rootStats = fs.statSync(rootDir)
  if (rootStats.isFile()) {
    reject('Must be directory')
  } else {
    const actions = []
    readDirectory(path.resolve(rootDir), actions, path.join(rootDir, '..'), dirPrefix)
    resolve(actions)
  }
})

/**
 * 执行代码生成，同步
 * @param codeDir
 */
const execCodegen = (codeDir) => new Promise((resolve, reject) => {
  child_process.exec('sh /Users/ryancui/codegen-test/sleep.sh', {
    shell: true
  }, (err) => {
    resolve()
  })
})

module.exports = {
  execCodegen,
  generateActions
}
