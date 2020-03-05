
const _getSpecDataBySpecClasses = (multiSpecClasses, seprator) => {
  let list = multiSpecClasses.map(item => item.specValues);
  let titles = _getSpecDataTitles(list, seprator);
  let specData = _getSpecDataByTitles(titles);
  return specData;
}

const _getSpecDataByTitles = (titles) => {
  if (!titles || !titles.length) {
    return []
  }

  let specData = titles.map(specTitle => {
    return {
      specTitle,
      productUrls: [],
      productCode: "",
      barCode: "",
      originalPrice: null,
      costPrice: null,
    }
  })
  return specData
}

const _getSpecDataTitles = (multiSpecClasses, seprator) => {
  if (!multiSpecClasses || !multiSpecClasses.length) {
    return
  }
  let list1_2 = _getSpecDataTitlesFromLists(multiSpecClasses[0], multiSpecClasses[1]);

  if (multiSpecClasses.length <= 2) {
    return list1_2;
  }

  let list3 = _getSpecDataTitlesFromLists(list1_2, multiSpecClasses[2]);
  return list3
}

const _getSpecDataTitlesFromLists = (list1, list2, seprator) => {
  seprator = seprator || " ";
  if ((!list1 || list1.length == 0) && (!list2 || list2.length == 0)) {
    return
  }

  if ((!list1 || list1.length == 0) && list2 && list2.length > 0) {
    return list2
  }

  if ((!list2 || list2.length == 0) && list1 && list1.length > 0) {
    return list1
  }

  if (list1 && list1.length > 0 && list2 && list2.length > 0) {
    let arr = [];
    list1.forEach(item1 => {
      list2.forEach(item2 => {
        arr.push(`${item1}${seprator}${item2}`)
      })
    })
    return arr
  }
}

export {
  _getSpecDataBySpecClasses,
  _getSpecDataByTitles,
  _getSpecDataTitles,
  _getSpecDataTitlesFromLists
}