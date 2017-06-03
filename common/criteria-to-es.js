
const toAgg = (bindingItems, query) => {
  let currentCategoryField
  bindingItems.forEach(item => {
    if(item.bindingType === 'Category') {
        let fieldName = global.fields.get(item.fieldId)
        currentCategoryField = fieldName
        if(!query.aggs)
          query.aggs = {}
        query.aggs = {
          [fieldName]: {
            terms:{
              field: fieldName,
              size: 5000
            }
          }
        }
      }
      else {
        const {bindingFunction: {functionName, parameters}} = item
        let currentAgg = query.aggs[currentCategoryField]
        //这个地方要考虑一下多个参数的情况
        let aggField = parameters && parameters[0] && global.fields.get(parameters[0].fieldId)
        if(!currentAgg.aggs) {
          currentAgg.aggs = {}
        }
        currentAgg.aggs[aggField] = {
          [functionName]: {
              field: aggField
          }
        }
      }
  })
  return {size:0, ...query}
}

const toQuery = (filter) => {

  let node = {}
  let rootOperator = ''

  const iterCondition = (c,p = []) => {
    let {operator, conditions} = c
    operator = operator === 'or' ? 'should': 'must' 
    let tmpCause = {
      bool: {
        [operator] : []
      }
    }
    if(!node.bool) {
      node = tmpCause
      rootOperator = operator
    }

    if(p.length === 0) {
      p = tmpCause
    }
    else 
      p.push(tmpCause)
    

    const len = conditions.length

    for(let i = 0; i < len ; i++) {
      let c = conditions[i]
      let {nodeType} = c
      const isGroup = nodeType === 'group'
      if(isGroup) {
        p = tmpCause.bool[operator]
        iterCondition(c, p)
        p = node.bool[rootOperator]
      }
      else {
        const {item:{displayName}} = c
        tmpCause.bool[operator].push({name: displayName})
      }
    }

  }
  
  iterCondition(filter, [])
  debugger
  return tmpCause
}

const transform = (analysisRequest) => {

  if(!analysisRequest)
    return {}
  
  const {dataSetId, bindingItems, filter, selectors} = analysisRequest

  const aggs = toAgg(bindingItems, {})
  const query = toQuery(filter, {})
  return {}

}

module.exports = {
  transform
}