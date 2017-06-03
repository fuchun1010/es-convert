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



const transform = (analysisRequest) => {

  if(!analysisRequest)
    return {}
  
  const {dataSetId, bindingItems, filter, selectors} = analysisRequest

  const aggs = toAgg(bindingItems, {})
  return aggs

}

module.exports = {
  transform
}