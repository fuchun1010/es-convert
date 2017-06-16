
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
              size: 200
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
        const {item:{displayName, fieldType}, values, comparisonOperator} = c
        let condition = {}
        if(fieldType === 'Text') {
          condition.term = {
            [displayName]: values[0]
          }
        }
        else if(fieldType === 'Numeric') {
          let compareOp = comparisonOperator === '>' ? 'gt':'lt'
          condition.range = {
            [displayName]: +values[0]
          }
        }
        tmpCause.bool[operator].push(condition)
      }
    }

  }
  
  iterCondition(filter, [])
  return node
}

const transform = (analysisRequest) => {

  if(!analysisRequest)
    return {}
  
  const {dataSetId, bindingItems, filter, selectors} = analysisRequest

  const aggs = toAgg(bindingItems, {})
  const query = {
    query: toQuery(filter, {})
  }
  return {...aggs, ...query}

}

const transformAgg = (bindingItems) => {
  let head 
  let nextPointer
  let len = bindingItems.length
  let newAgg
  for(let i = 0; i < len; i++) {
    let {fieldId, bindingType, bindingFunction} = bindingItems[i]
    let isCategory = bindingType === 'Category'

    if(!head) {
      if(isCategory) {
        head = nextPointer = {
          aggs: {
            [fieldId]: {
              terms: {
                field: fieldId
              }
            }
          }
        }
        nextPointer = head.aggs[fieldId]
        continue
      }
      else {
        debugger
        continue
      }
    }

    if(isCategory) {
      if(!nextPointer.aggs) {
        nextPointer.aggs = {}
      }
      newAgg = {
        [fieldId]:{
            terms: {
              field: fieldId
            }
        }
      }

      nextPointer.aggs = {
        ...newAgg
      }
      nextPointer = nextPointer.aggs[fieldId]
    }
    else {
      const {functionName,parameters} = bindingFunction
      fieldId = parameters[0] && parameters[0].fieldId
      if(!nextPointer.aggs) {
        nextPointer.aggs = {}
      }
      let key = `${functionName}_${fieldId}`
      nextPointer.aggs[key] = {
        [functionName]: {
          field: fieldId
        }
      }
    }

  }
  debugger
  return head
}

module.exports = {
  transform,
  transformAgg
}