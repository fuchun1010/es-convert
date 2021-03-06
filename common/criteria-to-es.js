const {toAggregation} = require('./toAggregation')

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

  const aggregation = toAggregation(bindingItems)
  const query = {
    query: toQuery(filter, {})
  }
  return {...aggregation, ...query}

}



module.exports = {
  transform,
  transformAgg
}