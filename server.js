import Koa from 'koa'
import Router from 'koa-router'
import statics from 'koa-static'
import { koaBody } from 'koa-body'
//import { readFileSync } from 'fs'
//import { writeFile } from 'fs/promises'

const port = 3100
const app = new Koa
const router = new Router

app.use(koaBody())
app.use(statics('docs'))

router.get('/ping', function (ctx) {
  return ctx.body = 'pong'
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(port, function () {
  console.log(`http://localhost:${port}/`)
})

/* data related */
// const dataFilename = 'data.json'
// const data = JSON.parse(readFileSync(dataFilename))
// function saveData () {
//   writeFile(dataFilename, JSON.stringify(data))
// }
