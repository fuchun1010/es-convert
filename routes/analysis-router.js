var router = require('koa-router')();
const {transform, transformAgg} = require('../common/criteria-to-es')

router.get('/', async ctx => {
  const {request:{body}} = ctx
  //const query = transform(body)
  const {dataSetId, bindingItems, filter, selectors} = body
  transformAgg(bindingItems)
  ctx.body = 'es analysis response'

})
module.exports = router