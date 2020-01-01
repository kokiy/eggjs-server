'use strict'
/**
 * 文件上传
 */

const fs = require('fs')
const path = require('path')
const Controller = require('egg').Controller

const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')
const dayjs = require('dayjs')
const uplaodBasePath = 'app/public/uploads'

const mkdirsSync = dirname => {
  if (fs.existsSync(dirname)) {
    return true
  }
  if (mkdirsSync(path.dirname(dirname))) {
    fs.mkdirSync(dirname)
    return true
  }
}

const getFilePath = filename => {
  const newFilename = `${Date.now()}${Number.parseInt(
    Math.random() * 1000
  )}${path.extname(filename).toLocaleLowerCase()}`
  const dirname = dayjs(Date.now()).format('YYYY/MM/DD')

  mkdirsSync(path.join(uplaodBasePath, dirname))
  return {
    savePath: path.join(uplaodBasePath, dirname, newFilename),
    readPath: path.join('public/uploads', dirname, newFilename),
  }

}
class FileUploadController extends Controller {


  async index() {
    const stream = await this.ctx.getFileStream()
    const { savePath, readPath } = getFilePath(stream.filename)
    const writeStream = fs.createWriteStream(savePath)
    try {
      await awaitWriteStream(stream.pipe(writeStream))
    } catch (err) {
      await sendToWormhole(stream)
      this.ctx.throw(500, err)
    }
    this.ctx.body = {
      url: readPath,
      fields: stream.fields,
    }
  }

  async batch() {
    const parts = this.ctx.multipart({ autoFields: true })
    let part
    const files = []
    while ((part = await parts()) != null) {
      if (!part.filename) {
        return
      }
      const { savePath, readPath } = getFilePath(part.filename)
      const writeStream = fs.createWriteStream(savePath)
      try {
        await awaitWriteStream(part.pipe(writeStream))
        files.push({ [part.filename]: readPath })
      } catch (err) {
        await sendToWormhole(part)
        this.ctx.throw(500, err)
      }
    }
    this.ctx.body = {
      files,
      fields: parts.field,
    }
  }
}

module.exports = FileUploadController
