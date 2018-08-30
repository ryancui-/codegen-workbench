const fs = require('fs')
const path = require('path')

/**
 * 将 f 函数 Promise 化
 * @param f
 * @return {function(...[*]): Promise<any>}
 */
const promisify = (f) => {
  return function (...n) {
    return new Promise((resolve, reject) => {
      f(...n, (err, rest) => {
        if (err) {
          reject(err)
        }
        resolve(rest)
      })
    })
  }
}

/**
 * 删除文件夹
 * @param dir
 * @return {Promise<void>}
 */
const removeDir = async (dir) => {
  const stat = await promisify(fs.stat)(dir)

  if (stat.isDirectory()) {
    const files = await promisify(fs.readdir)(dir)
    for (let i = 0; i < files.length; i++) {
      const filepath = path.join(dir, files[i])
      await removeDir(filepath)
    }
    await promisify(fs.rmdir)(dir)
  } else {
    await promisify(fs.unlink)(dir)
  }
}

module.exports = {
  promisify,
  removeDir
}
