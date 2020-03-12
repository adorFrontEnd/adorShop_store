const parseTree = (treeList, isReturnArr) => {
  if (!treeList || !treeList.length) {
    return []
  }
  // id: 1, name: "ceshi1", remark: "333333", parentId: 0, sort: 1
  let treeMap = {};
  for (let i = 0; i < treeList.length; i++) {
    let item = treeList[i];

    if (!item || (!item.id && item.id != 0)) {
      continue;
    }

    if (item.parentId == 0) {
      treeMap[item.id] = { index: i, children: {}, ...item };
    } else {
      let parentId = item.parentId;
      let id = item.id;
      let parentObj = findParentItemById(parentId, treeMap);
      let parent = parentObj.result;
      let hasChildren = parentObj.hasChildren;
      let index = parent['index'];
      let length = Object.keys(parent['children']).length;
      let child = { index: length, ...item };
      parent['children'][id] = parentObj.hasChildren ? { ...child, children: {} } : child;
    }
  }
  return isReturnArr ? treeMapToArr(treeMap) : treeMap;
}

const treeMapItemToArr = (treeMap) => {
  let treeArr = Object.values(treeMap).sort((a, b) => a.index - b.index);
  return treeArr
}

const treeMapToArr = (treeMap) => {
  let arr = treeMapItemToArr(treeMap);
  arr.forEach(item => {
    if (item.children) {
      item.children = treeMapItemToArr(item.children);
      item.children.forEach(subItem => {
        if (subItem.children) {
          subItem.children = treeMapItemToArr(subItem.children);
        }
      })
    }
  })
  return arr
}

const findParentItemById = (id, treeMap) => {
  if (id == 0) {
    return
  }
  for (let item in treeMap) {
    if (item == id) {
      let result = treeMap[item];
      return {
        hasChildren: true,
        result
      };
    }

    if (treeMap[item] && treeMap[item]['children']) {
      for (let subItem in treeMap[item]['children']) {
        if (subItem == id) {
          let result = treeMap[item]['children'][subItem];
          return {
            hasChildren: false,
            result
          };
        }
      }
    }
  }
}

const getTreeMapAndData = (list) => {

  let treeMap = {};
  if (!list || !list.length) {
    return treeMap
  }
  let level1List = list.filter(item => item.level == '1');
  let level2List = list.filter(item => item.level == '2');
  let level3List = list.filter(item => item.level == '3');

  level1List.forEach(item => {
    let { id, name, parentId } = item;
    treeMap[id] = {
      id, name, parentId, title: name, key: id, children: {}, totalId: id, level: "1"
    }
  })

  level2List.forEach(item => {
    let { id, name, parentId } = item;
    treeMap[parentId]["children"][id] = {
      id, name, parentId, title: name, key: id, children: {}, totalId: `${parentId}-${id}`, level: "2"
    }
  })

  level3List.forEach(item => {
    let { id, name, parentId } = item;
    let grandParentId = _getParentIdById(parentId, list);
    treeMap[grandParentId]["children"][parentId]["children"][id] = {
      id, name, parentId, grandParentId, title: name, key: id, totalId: `${grandParentId}-${parentId}-${id}`, level: "3"
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

const getListMapAndData = (list) => {

  let listMap = {};
  if (!list || !list.length) {
    return listMap
  }

  list.forEach(item => {
    let { id, name, parentId } = item;
    listMap[id] = {
      id, name, parentId, title: name, key: id, totalId: id
    }
  })

  let listData = _geListDataByListMap(listMap);

  return { treeMap: listMap, treeData: listData }
}

const _geListDataByListMap = (map) => {

  let listData = [];
  if (!map) {
    return listData
  }
  listData = Object.values(map);
  return listData;
}
export {
  parseTree,
  getTreeMapAndData,
  getListMapAndData
}