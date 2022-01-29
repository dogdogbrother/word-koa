const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const parameter = require('koa-parameter')
const static = require("koa-static")
const routing = require('./routes')

const app = new Koa()

app.use(bodyparser())

app.use(parameter(app))

app.use(static(__dirname + "/../assets"));

routing(app)
console.log(process.env.NODE_ENV);
app.listen(7009, () => console.log('7009端口已经开启'))