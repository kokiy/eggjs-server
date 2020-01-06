'use strict'
const fs = require('fs')
const _ = require('lodash')

function deleteDir(path) {
  let files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    _.each(files, file => {
      const curPath = `${path}/${file}`
      if (fs.statSync(curPath).isDirectory()) {
        deleteDir(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

module.exports = deleteDir

