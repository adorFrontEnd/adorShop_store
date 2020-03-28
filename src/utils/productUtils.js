const getSpecValue = (specValue) => {
  if (!specValue) {
    return ""
  }
  let specValueArr = JSON.parse(specValue);
  return specValueArr.join(" ");
}


export {
  getSpecValue
} 