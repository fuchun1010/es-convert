
const textEq = (displayName, values) => {
  let condition = {
    term: {
      [displayName]: values[0]
    }
  }
  
  return condition
}

const textNotEq = (displayName, values) => {
  const condition = {
    must_not: {
      [displayName]: values[0]
    }
  }
  return condition
}

const textExists = (displayName, values) => {
  const should = values.map(v => {
    bool: {
      must:{
        term: {
          [displayName]: v
        }
      }
    }
  })

  let condition = {
      "bool": {should}
  }
  return condition
}

const textNotExists = (displayName, values) => {

  const should = values.map(v => {
    bool: {
      must_not:{
        term: {
          [displayName]: v
        }
      }
    }
  })

  let condition = {
      "bool": {should}
  }

  return condition
}

const textPrefixEq = () => {

}

const textPrefixNotEq = () => {

}

const textEnd = () => {

}

const textNotEndWith = () => {

}

const textInclude = () => {

}

const textNotInclude = () => {

}

const textIsEmpty = () => {

}

const textIsNotEmpty = () => {

}

module.exports = {
  textEq,
  textNotEq,
  textExists,
  textNotExists,
  textPrefixEq,
  textPrefixNotEq,
  textEnd,
  textNotEndWith,
  textInclude,
  textNotInclude,
  textIsEmpty,
  textIsNotEmpty
}