
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

const toQuery = (filter, clause) => {

  let node = {}
  let  p = {}
  let rootOperator = {}
  const iterCondition = (c,p) => {
    let {operator, conditions} = c
    operator = operator === 'or' ? 'should': 'must' 
    let tmpCause = {
      bool: {
        [operator] : []
      }
    }

   if(Object.keys(node).length === 0) {
      rootOperator = operator
      node = {
        bool: {
          [rootOperator]:[]
        }
      }
      p = node.bool[rootOperator]
   }

    const len = conditions.length
    for(let i = 0; i < len; i++) {
      let c = conditions[i]
      const {nodeType} = c
      if(nodeType === 'group') {
        p.push(tmpCause)
        p = tmpCause.bool[operator]
        const rs = iterCondition(c, p)
        debugger
        p.push(rs)
        debugger
        p = node.bool[rootOperator]
        debugger
      }
      else {
        const {item:{displayName, fieldType}, values, comparisonOperator} = c
        let condition 
        //TODO要处理values是个多的情况
        let value = values.length > 0 ? values[0]: values
        let op
        if(fieldType === 'Text') {
          condition = {
            term: {
              [displayName]:  value
            }
          }
        }
        else if(fieldType === 'Numeric' ) {
          
          op = comparisonOperator === '>' ? 'gt':'lt'
          condition = {
            range : {
              [displayName]: {
                [op]: value
              }
            }
          }
        }
        
        tmpCause.bool[operator].push(condition)
       
      }
    }

    return tmpCause

  }
  
  iterCondition(filter, {})
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