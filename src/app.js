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

app.listen(3009, () => console.log('3009端口已经开启'))