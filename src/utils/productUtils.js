const getSpecValue = (specValue) => {
  if (!specValue) {
    return ""
  }
  if (specValue.indexOf('[') != -1) {
    let specValueArr = JSON.parse(specValue);
    return specValueArr.join(" ");
  } else {
    return specValue
  }

}


export {
  getSpecValue
} 