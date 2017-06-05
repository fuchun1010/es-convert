
const numericEqual = (displayName, values) => {
  let condition = {
    term: {
      [displayName]: values[0]
    }
  }
  
  return condition
}

const numericNotEqual = (displayName, values) => {
  
}

const numericGt = (displayName, values) => {
  let condition = {
      range:{
        [displayName]:{
          gt: +values[0]
        }
      }
  }
  return condition
}

const numericGte = (displayName, values) => {
  let condition = {
    range:{
      [displayName]:{
        gte: +values[0]
      }
    }
  }
  return condition
}

const numericLt = (displayName, values) => {
  let condition = {
    range:{
      [displayName]:{
        lt: +values[0]
      }
    }
  }
  return condition
}

const numericLte = (displayName, values) => {
  let condition = {
    range:{
      [displayName]:{
        lte: +values[0]
      }
    }
  }
  return condition
}

const numericIsNull = (displayName, values) => {
  const condition = {
    bool: {
      must: {
        script: {
          script: {
            inline: 'doc[`${displayName}`] === null ? true:false',
            lang: 'painless'
          }
        }
      }
    }
  }
  return condition
}

const numericIsNotNull = (displayName, values) => {
  const condition = {
    bool: {
      must: {
        script: {
          script: {
            inline: 'doc[`${displayName}`] != null ? true:false',
            lang: 'painless'
          }
        }
      }
    }
  }
  return condition
}

const numericInRange = (displayName, values) => {
  let condition = {
    range:{
      [displayName]:{
        gte: +values[0],
        lte: +values[1]
      }
    }
  }
  return condition
}

const numericOutRange = (displayName, values) => {
  let condition = {
    must_not: {
      range : {
        [displayName] : { 
          "gte" : +values[0], 
          "lte" : +values[1] 
        }
      }
    }
  }
  return condition
}

module.exports = {
  numericEqual,
  numericNotEqual,
  numericGt,
  numericGte,
  numericLt,
  numericLte,
  numericIsNull,
  numericIsNotNull,
  numericInRange,
  numericOutRange
}