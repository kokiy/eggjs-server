'use strict'
const fs = require('fs')
const path = require('path')
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

const uploadFile = async (ctx, category = '') => {
  const stream = await ctx.getFileStream()
  const filename = `${Date.now()}${Number.parseInt(
    Math.random() * 1000
  )}${path.extname(stream.filename).toLocaleLowerCase()}`
  const dirname = dayjs(Date.now()).format('YYYY/MM/DD')

  mkdirsSync(path.join(uplaodBasePath, category, dirname))
  const target = path.join(uplaodBasePath, category, dirname, filename)
  const writeStream = fs.createWriteStream(target)
  try {
    await awaitWriteStream(stream.pipe(writeStream))
  } catch (err) {
    await sendToWormhole(stream)
    ctx.throw(500, err)
  }
  return {
    url: path.join('public/uploads', category, dirname, filename),
    fields: stream.fields,
  }
}

module.exports = uploadFile
