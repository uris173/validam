const remove_prop = (arr, ...params) => {
  arr.forEach(obj => {
    params.forEach(props => {
      delete obj[props]
    })
  })
  return arr
}


module.exports = {
  remove_prop
}