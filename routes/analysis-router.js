var router = require('koa-router')();
const {transform} = require('../common/criteria-to-es')

router.get('/', async ctx => {
  const {request:{body}} = ctx
  debugger
  const query = transform(body)
  ctx.body = 'es analysis response'

})
module.exports = router