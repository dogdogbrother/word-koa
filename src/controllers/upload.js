class UploadCtl {
  async wordImg(ctx) {
    console.log(ctx.request.body);
    // const file = ctx.req.files['file']
    // console.log(file);
    ctx.body = 123
  }
}

module.exports = new UploadCtl()