class UploadCtl {
  async wordImg(ctx) {
    const file = ctx.req.files['file']
    console.log(file);
    const fileName = file.path.split('/word-koa/assets/')[1]
    ctx.body = `http://localhost:3009/${fileName}`
  }
}

module.exports = new UploadCtl()