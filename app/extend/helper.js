'use strict'
module.exports = {
  formatDate(timeStamp) {
    return timeStamp
  },
  generateCaptcha() {
    const svgCaptcha = require('svg-captcha')
    const { text, data } = svgCaptcha.create({ color: true, size: 4, width: 100, height: 40, background: '#cc9966' })
    return {
      text,
      data,
    }
  },

}
