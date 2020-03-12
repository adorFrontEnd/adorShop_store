
const getIdMap = (arr, totalName) => {
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
  if (totalName) {
    let totalNameIdMap = {};
    arr.forEach(item => {
      let id = item.id;
      if (!totalNameIdMap[id]) {
        let totalName = getTotalName(id, idMap, '-');
        totalNameIdMap[id] = { ...item, name: totalName };
      }
    });
    return totalNameIdMap;
  }

  return idMap;
}




const getTotalName = (id, idMap, seprator) => {
  let item = idMap[id];
  seprator = seprator || '-';
  let parentId = item.parentId;
  if (parentId == '0') {
    return item.name
  } else {
    let parent = idMap[parentId];
    if (parent.parentId == '0') {
      return `${parent.name}${seprator}${item.name}`;
    } else {
      let grandParentId = idMap[parentId]['parentId'];
      let grandParent = idMap[grandParentId];
      return `${grandParent.name}${seprator}${parent.name}${seprator}${item.name}`;
    }
  }
}

const getSelectArrTotalName = (selecdArr, idMap) => {
  if (!selecdArr || !selecdArr.length) {
    return;
  }
  let result = selecdArr.map(id => {
    let totalName = getTotalName(id, idMap);
    return {
      id, totalName
    }
  });
  return result;
}

const getCheckedNamesByIds = (idMap, ids, seprator) => {
  if (!idMap || !ids || !ids.length) {
    return
  }
  let names = ids.map(id => idMap[id]['name']);
  return seprator ? names.join(seprator) : names;
}

const getRelativeIds = (id, idMap, rawClassifyList) => {
  if (!id) {
    return
  }
  let item = idMap[id];
  let level = item['level'];

  if (level == 3) {
    let parentId = item['parentId'];
    let grandParentId = idMap[parentId]['parentId'];
    return [parentId, grandParentId];
  }

  if (level == 2) {
    let parentId = item['parentId'];
    let childIds = rawClassifyList.filter(item => item.parentId == id).map(item => item.id);
    return [parentId, ...childIds]
  }

  if (level == 1) {

    let childIds = rawClassifyList.filter(item => item.parentId == id).map(item => item.id);
    let totalGrandChildIds = [];
    childIds.forEach(childId => {
      let grandChildIds = rawClassifyList.filter(item => item.parentId == childId).map(item => item.id);
      totalGrandChildIds = totalGrandChildIds.concat(grandChildIds);
    })
    return [...childIds, ...totalGrandChildIds]
  }
}

const getCleanRelativeIdsById = (id, ids, idMap, rawClassifyList) => {
  let cleanIds = [];
  if (!id || !ids || !ids.length) {
    return ids;
  }
  let relativeIds = getRelativeIds(id, idMap, rawClassifyList);
  if (!relativeIds || !relativeIds.length) {
    return ids;
  }
  ids.forEach(item => {
    let exist = relativeIds.filter(i => i == item).length;
    if (exist <= 0) {
      cleanIds.push(item);
    }
  })
  return cleanIds;
}



export {
  getSelectArrTotalName,
  getIdMap,
  getCheckedNamesByIds,
  getRelativeIds,
  getCleanRelativeIdsById
}