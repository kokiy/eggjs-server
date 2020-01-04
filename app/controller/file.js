'use strict'
/**
 * 文件上传
 */

const fs = require('fs')
const path = require('path')
const makeDir = require('make-dir')
const Controller = require('egg').Controller
const _ = require('lodash')
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')
const dayjs = require('dayjs')
const uplaodBasePath = 'app/public/uploads'

// 获取文件保存和读取的路径
const getSaveAndReadPath = async filename => {
  const newFilename = `${Date.now()}${Number.parseInt(
    Math.random() * 1000
  )}${path.extname(filename).toLocaleLowerCase()}`
  const dirname = dayjs(Date.now()).format('YYYY/MM/DD')
  await makeDir(path.join(uplaodBasePath, dirname))
  return {
    savePath: path.join(uplaodBasePath, dirname, newFilename),
    readPath: path.join('public/uploads', dirname, newFilename),
  }
}

const getSpliceFilePath = async ({ index, token }, filename) => {
  const newFilename = `${index}${path.extname(filename).toLocaleLowerCase()}`
  const dirname = `temp/${token}`
  await makeDir(path.join(uplaodBasePath, dirname))
  return {
    savePath: path.join(uplaodBasePath, dirname, newFilename),
    readPath: path.join('public/uploads', dirname, newFilename),
  }
}

// 合并分片文件
const mergeChunk = async ({ ctx, token, filename }) => {
  const dirname = `temp/${token}`
  const chunkfileList = fs.readdirSync(path.join(uplaodBasePath, dirname))
  const sortedChunkfileList = _.sortBy(chunkfileList, i => _.parseInt(i.split(',')[0]))
  const chunkFilePath = _.map(sortedChunkfileList, chunk => path.join(uplaodBasePath, dirname, chunk))
  // 获取读取每个片段的路径
  const { savePath, readPath } = await getSaveAndReadPath(filename)
  const writeStream = fs.createWriteStream(savePath)
  const writeFile = async () => {
    const readSlicePath = chunkFilePath.shift()
    const readStream = fs.createReadStream(readSlicePath)
    try {
      readStream.pipe(writeStream, { end: false })
      readStream.on('end', () => {
        if (!_.isEmpty(chunkFilePath)) {
          writeFile()
        }
      })
    } catch (err) {
      await sendToWormhole(readStream)
      ctx.throw(500, err)
    }
  }
  writeFile()

  return {
    url: readPath,
  }
}

class FileUploadController extends Controller {

  async index() {
    const stream = await this.ctx.getFileStream()
    const { savePath, readPath } = await getSaveAndReadPath(stream.filename)
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

  // 批量上传
  async batch() {
    const parts = this.ctx.multipart({ autoFields: true })
    let part
    const files = []
    while ((part = await parts()) != null) {
      if (!part.filename) {
        return
      }
      const { savePath, readPath } = await getSaveAndReadPath(part.filename)
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

  // 切片上传
  async chunk() {
    const { type, token, filename } = this.ctx.request.body
    if (type === 'merge') {
      const res = await mergeChunk({ ctx: this.ctx, token, filename })
      this.ctx.body = res
      return
    }
    const stream = await this.ctx.getFileStream()
    const { savePath, readPath } = await getSpliceFilePath(stream.fields, stream.filename)
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


}

module.exports = FileUploadController
