const toAggregation = (bindingItems) => {
  let head 
  let nextPointer
  let len = bindingItems.length
  let newAgg
  let prefix = 0
  for(let i = 0; i < len; i++) {
    let {fieldId, bindingType, bindingFunction} = bindingItems[i]
    let isCategory = bindingType === 'Category'

    if(!head) {
      if(isCategory) {
        head = nextPointer = {
          aggs: {
            [prefix]: {
              terms: {
                field: fieldId
              }
            }
          }
        }
        nextPointer = head.aggs[prefix]
        prefix++
        continue
      }
      else {
        const {functionName, parameters} = bindingFunction
        fieldId = parameters && parameters[0] && parameters[0].fieldId
        head = nextPointer = {
          aggs: {
            [prefix] :{ 
              [functionName]: {
                field: fieldId
              }
            }
          }
        }
        prefix++
        nextPointer = nextPointer.aggs
        continue
      }
    }

    if(isCategory) {
      if(!nextPointer.aggs) {
        nextPointer.aggs = {}
      }
      newAgg = {
        [prefix]:{
            terms: {
              field: fieldId
            }
        }
      }

      nextPointer.aggs = {
        ...newAgg
      }
      nextPointer = nextPointer.aggs[prefix]
      prefix++
    }
    else {
      const {functionName,parameters} = bindingFunction
      fieldId = parameters && parameters[0] && parameters[0].fieldId
      if(!nextPointer.aggs) {
        nextPointer.aggs = {}
      }
      
      nextPointer.aggs[prefix] = {
        [functionName]: {
          field: fieldId
        }
      }
      prefix++
    }

  }

  const aggregation = Object.keys(head).length > 0 ? {size:1, ...head} : {}
  return aggregation
}

module.exports = {
  toAggregation
}