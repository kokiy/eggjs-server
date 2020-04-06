'use strict'

const webpush = require('web-push')


module.exports = app => {
  // 开始前执行
  app.beforeStart(async () => {

  })
  // 准备好执行
  app.ready(async () => {
    // webpush.setGCMAPIKey('<Your GCM API Key Here>')
    webpush.setVapidDetails(
      'mailto:zghong1993@gmail.com', // 值为 URL 或 'mailto:' 格式信息
      'BO3o2_MBU8ry7R7CWCd088pa864aT8Mce-HeEfHZSAtWg2ybMDPCITgsB-Oa-A4kQDiaYblzqz-_G8mRrB7eQJ8', // 公钥
      'MtRVivufCseMclpogGpaNFG4sHd0EcH_2I_jj2GdkgI' // 私钥
    )
  })
  // 关闭前执行
  app.beforeClose(async () => {

  })
}

