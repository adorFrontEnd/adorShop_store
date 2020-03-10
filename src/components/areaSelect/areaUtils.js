
const getTreeMapAndData = (list) => {

  let treeMap = {};
  if (!list || !list.length) {
    return treeMap
  }
  let level1List = list.filter(item => item.arealevel == '1');
  let level2List = list.filter(item => item.arealevel == '2');
  let level3List = list.filter(item => item.arealevel == '3');

  level1List.forEach(item => {
    let { id, name, parentId } = item;
    treeMap[id] = {
      id, name, parentId, title: name, key: id, children: {}, totalId: id, arealevel: "1"
    }
  })

  level2List.forEach(item => {
    let { id, name, parentId } = item;
    treeMap[parentId]["children"][id] = {
      id, name, parentId, title: name, key: id, children: {}, totalId: `${parentId}-${id}`, arealevel: "2"
    }
  })

  level3List.forEach(item => {
    let { id, name, parentId } = item;
    let grandParentId = _getParentIdById(parentId, list);
    treeMap[grandParentId]["children"][parentId]["children"][id] = {
      id, name, parentId, grandParentId, title: name, key: id, totalId: `${grandParentId}-${parentId}-${id}`, arealevel: "3"
    }
  })

  let treeData = _getTreeDataByTreeMap(treeMap);

  return { treeMap, treeData }
}

const _getParentIdById = (id, list) => {
  if (!id || !list || !list.length) {
    return
  }
  let filterArr = list.filter(item => item.id == id);
  let obj = filterArr && filterArr.length ? filterArr[0] : null;
  let result = obj ? obj.parentId : null;
  return result;
}

const _getTreeDataByTreeMap = (map) => {

  let treeData = [];
  if (!map) {
    return treeData
  }
  treeData = Object.values(map);
  let result = treeData = treeData.map(item => {
    let { children, ...other } = item;
    let values = Object.values(children);
    children = values && values.length ? values.map(childItem => {
      let _children = Object.values(childItem.children);
      return {
        ...childItem,
        children: _children,
      }

    }) : []

    return {
      ...other,
      children
    }
  })
  return result;
}

const getIdMap = (arr) => {
  let idMap = {};
  if (!arr || !arr.length) {
    return idMap;
  }
  arr.forEach(item => {
    let id = item.id;
    if (!idMap[id]) {
      idMap[id] = item;
    }
  });
  return idMap;
}

const getDisrtrictIds = (checkedAreaIds) => {
  if (!checkedAreaIds || !checkedAreaIds.length) {
    return []
  }
  let disrtrictIds = checkedAreaIds.filter(item => item.toString().substr(4, 2) != '00');
  return disrtrictIds;
}

const cityIdsIsRepeat = (list, totalList) => {

  if (!list || !totalList.length || !list.length || !totalList.length) {
    return;
  }

  let disrtrictIds = getDisrtrictIds(list);
  let totalDisrtrictIds = getDisrtrictIds(totalList);

  if (!disrtrictIds || !disrtrictIds || !totalDisrtrictIds.length || !totalDisrtrictIds.length) {
    return;
  }

  for (let i = 0; i < disrtrictIds.length; i++) {
    let item = parseInt(disrtrictIds[i]);
    let index = totalDisrtrictIds.indexOf(item);
    if (index != -1) {
      return disrtrictIds[i];
      break;
    }
  }
  return

}

export {
  getIdMap,
  getTreeMapAndData,
  getDisrtrictIds,
  cityIdsIsRepeat
}