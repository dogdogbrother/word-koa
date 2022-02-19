const HOST = require('../utils/host')
class UploadCtl {
  async wordImg(ctx) {
    const file = ctx.req.files['file']
    const fileName = file.path.split('/word-koa/assets/')[1]
    ctx.body = `${HOST}/${fileName}`
  }
}

module.exports = new UploadCtl()