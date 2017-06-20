const router = require('koa-router')()

router.post('/', ctx => {
  const {request:{body}} = ctx
  debugger
  ctx.body = "vivo-es-router"
})

module.exports = router