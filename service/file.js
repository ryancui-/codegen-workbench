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

const buildDirTree = async (dir) => {
  const files = await promisify(fs.readdir)(dir)

  const result = []

  for (let i = 0; i < files.length; i++) {
    const filename = files[i]
    const fullpath = path.join(dir, filename)
    const stats = await promisify(fs.stat)(fullpath)

    // 忽略以 . 开头的隐藏文件
    if (stats.isFile() && !filename.startsWith('.')) {
      result.push({
        type: 'file',
        filename,
        path: path.relative(config.codegen_base, fullpath)
      })
    } else if (stats.isDirectory()) {
      const children = await buildDirTree(fullpath)
      result.push({
        type: 'directory',
        filename,
        path: path.relative(config.codegen_base, fullpath),
        children
      })
    }
  }

  return result
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
 * 传入根目录，构造文档树结构对象
 *
 * @param rootDir
 * @return {Promise<*>}
 */
const generateDirTree = async (rootDir) => {
  const rootStats = await promisify(fs.stat)(rootDir)

  if (rootStats.isFile()) {
    throw new Error('Must be directory')
  } else {
    return await buildDirTree(path.resolve(rootDir))
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

/**
 * 返回文件内容
 *
 * @param filepath
 * @return {Promise<*>}
 */
const readFile = async (filepath) => {
  return await promisify(fs.readFile)(path.join(config.codegen_base, filepath), {
    encoding: 'utf-8'
  })
}

/**
 * 写入文件内容
 *
 * @param filepath
 * @param content
 * @return {Promise<void>}
 */
const writeFile = async (filepath, content) => {
  await promisify(fs.writeFile)(path.join(config.codegen_base, filepath), content)
}

module.exports = {
  execCodegen,
  generateActions,
  generateDirTree,
  readFile,
  writeFile
}
