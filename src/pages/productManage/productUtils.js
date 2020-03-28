import Toast from '../../utils/toast';
import { getSpecValue } from '../../utils/productUtils';

//保存数据
const getSaveData = (formData, stateData, isEdit) => {
  let { name, channel, baseUnit, specifications } = formData;
  let { unitListMap, isContainerUnit, containerUnitName, baseUnitQty,
    categoryIds, categoryNames, specData, imageUrl, videoFile, details, freightType, freightPrice, freightTemplateId } = stateData;

  //单位
  if (!baseUnit) {
    Toast("请设置计量单位！");
    return;
  }

  if (!categoryIds || !categoryIds.length) {
    Toast("请设置商品分类！");
    return;
  }

  if (!imageUrl || imageUrl.length < 2) {
    Toast("请上传至少两张商品图片！");
    return;
  }

  if (!details) {
    Toast("请编辑详情！");
    return;
  }

  if (freightType == 0) {
    if (!freightPrice && freightPrice != 0) {
      Toast("请填写运费价格！");
      return;
    }
  } else {
    if (!freightTemplateId) {
      Toast("请设置运费模板！");
      return;
    }
  }
  let containerUnit = null;
  if (isContainerUnit) {

    if (!containerUnitName) {
      Toast("请设置容器单位！");
      return;
    }

    if (!baseUnitQty) {
      Toast("请输入计量单位的数量！");
      return;
    }

    containerUnit = {
      containerUnitName,
      baseUnitQty
    }
  }

  //可购渠道
  channel = _getChannelValue(channel);

  let { validateData, ...specDataObj } = _getSpecData(specData, isEdit);

  if (validateData) {
    Toast(validateData);
    return;
  }

  imageUrl = imageUrl.join("|");
  let videoUrl = videoFile && videoFile.url ? videoFile.url : null;

  let params = {
    name,
    baseUnit,
    isContainerUnit: isContainerUnit ? 1 : 0,
    containerUnit: containerUnit ? JSON.stringify(containerUnit) : null,
    specifications,
    channel,
    categoryIds: categoryIds.join(','),
    categoryNames,
    imageUrl,
    videoUrl,
    details,
    freightType,
    freightPrice,
    freightTemplateId,
    ...specDataObj,
  };

  return params
}

//解析数据
const getParseDetailData = (productDetail) => {
  if (!productDetail) {
    return
  }
  let { baseUnit, categoryIds, categoryNames, channel, containerUnit, details, freightType, freightPrice, freightTemplateId,
    imageUrl, isContainerUnit, isOpenSpec, name, paramList, specifications, paramGroupList, videoUrl } = productDetail;

  channel = _parseChannelValue(channel);

  imageUrl = imageUrl.split("|");
  containerUnit = containerUnit ? JSON.parse(containerUnit) : null;
  categoryIds = categoryIds.split(",");

  let videoFile = videoUrl ? { url: videoUrl, name: "" } : null;
  let formData = {
    name, channel, baseUnit, specifications
  }
  let stateData = {
    baseUnit, categoryIds, containerUnit, details, containerUnit, freightType, freightPrice, categoryNames,
    imageUrl, isContainerUnit, isOpenSpec, paramList, paramGroupList, videoFile, freightTemplateId: freightTemplateId || null
  }
  let specData = parseSpecData({ isOpenSpec, paramList, paramGroupList });

  if (isContainerUnit) {
    let { containerUnitName, baseUnitQty } = containerUnit;
    stateData = {
      ...stateData,
      containerUnitName,
      baseUnitQty
    }
  }

  let result = {
    formData, stateData, specData
  }
  return result
}

const _getChannelValue = (channel) => {
  let result = 0;
  if (!channel || !channel.length) {
    return
  }
  channel.forEach(item => {
    result += parseInt(item);
  })
  return result
}

const _parseChannelValue = (channel) => {
  channel = parseInt(channel);
  let str = "000" + channel.toString(2);
  str = str.substr(-3, 3);
  let arr = str.split('').map(item => parseInt(item));
  let result = [];
  arr.forEach((item, index) => {
    if (item != 0) {
      result.push(item * Math.pow(2, index));
    }
  })
  return result;
}

const parseSpecData = (specData) => {
  let { isOpenSpec, paramList, paramGroupList } = specData;
  let isMultiSpec = !!isOpenSpec;
  let singleSpecData = [];
  let multiSpecData = [];
  let multiSpecClasses = [];
  if (!isOpenSpec) {
    let _singleSpecData = paramList[0];
    let { id, barCode, costPrice, marketPrice, number, imageUrl, specValue, weight } = _singleSpecData;
    singleSpecData = {
      id,
      imageUrl: imageUrl ? imageUrl.split("|") : null,
      specValue: "无",
      barCode, costPrice, marketPrice, number, weight
    }
  } else {

    if (paramGroupList && paramGroupList.length) {

      multiSpecClasses = paramGroupList.map(item => {
        let { id, name, value, status } = item;
        let _id = id || Date.now() + Math.random() * 1000;
        return {
          _id,
          id,
          name,
          value: value || [],
          status
        }
      })
    }

    if (paramList && paramList.length) {

      multiSpecData = paramList.map(item => {

        let { id, barCode, costPrice, imageUrl, marketPrice, number, productId, specValue, status, weight } = item;
        let _specValue = '';
        if (specValue) {
          _specValue = getSpecValue(specValue);
        }
        let _id = id || Date.now() + Math.random() * 1000;
        return {
          _id, id, barCode, costPrice, imageUrl, marketPrice, number, productId, status, weight,
          imageUrl: imageUrl ? imageUrl.split("|") : null,
          specValue: _specValue || ''
        }
      })
    }
  }

  return {
    isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses
  }
}

// 获取规格数据
const _getSpecData = (specData, isEdit) => {
  let { isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses } = specData;
  let paramStrList = [];
  let paramGroupStrList = [];
  let validateData = null;
  let isOpenSpec = isMultiSpec ? 1 : 0;
  if (!isMultiSpec) {

    validateData = validateSingleSpecData(singleSpecData);
    if (validateData) {
      return {
        validateData
      }
    }
    let { barCode, costPrice, marketPrice, number, imageUrl, specValue, weight, id } = singleSpecData;
    let paramData = {
      imageUrl: imageUrl.join('|'),
      number,
      barCode,
      marketPrice,
      costPrice,
      status: 1,
      weight,
      isChange: 1
    }
    if (id) {
      paramData.id = id;
    }
    paramStrList = [paramData];

    return {
      validateData,
      isOpenSpec,
      paramStrList: JSON.stringify(paramStrList)
    }
  }

  validateData = validateMultiSpecData(multiSpecData, multiSpecClasses);
  if (validateData) {
    return { validateData }
  }
  let multiData = _getMultiSpecData(multiSpecData, multiSpecClasses, isEdit);
  paramGroupStrList = multiData.paramGroupStrList;
  paramStrList = multiData.paramStrList;

  return {
    validateData,
    isOpenSpec,
    paramStrList: JSON.stringify(paramStrList),
    paramGroupStrList: JSON.stringify(paramGroupStrList)
  }
}

const _getMultiSpecData = (multiSpecData, multiSpecClasses, isEdit) => {

  let paramGroupStrList = [];
  let paramStrList = [];


  paramGroupStrList = multiSpecClasses.map(item => {

    let { name, value, id, status } = item;
    let result = {
      name,
      isChange: 1,
      status: status == -1 ? -1 : 1,
      value: value.map(child => {
        let result = {
          name: child.name,
          isChange: 1,
          status: child.status == -1 ? -1 : 1
        }
        if (child && child.id) {
          result.id = child.id;
        }
        return result
      })
    }
    if (id) {
      result.id = id;
    }
    return result
  })

  paramStrList = multiSpecData.map(item => {
    let { specValue, number, barCode, marketPrice, costPrice, status, weight, imageUrl, id } = item;
    specValue = specValue ? specValue.split(' ') : [];
    let result = {
      specValue: JSON.stringify(specValue),
      imageUrl: imageUrl ? imageUrl.join("|") : "",
      status: status == -1 ? -1 : 1,
      number, barCode, marketPrice, costPrice, weight,
      isChange: 1
    }
    if (id) {
      result.id = id;
    }
    return result
  })


  return {
    paramGroupStrList,
    paramStrList
  }
}

const validateSingleSpecData = (singleSpecData) => {
  let { barCode, costPrice, marketPrice, number, imageUrl, specValue, weight } = singleSpecData;
  if (!imageUrl || !imageUrl.length) {
    return '请上传至少1张商品图片！';
  }

  if (!number) {
    return '请设置商品编码！';
  }

  if (!barCode) {
    return '请设置条形码！';
  }

  if (!barCode) {
    return '请设置条形码！';
  }

  if ((!marketPrice && marketPrice != 0) || Number(marketPrice) < 0) {
    return '请设置划线价！';
  }

  if ((!costPrice && costPrice != 0) || Number(costPrice) < 0) {
    return '请设置成本价！';
  }


  if ((!weight && weight != 0) || Number(weight) < 0) {
    return '请设置重量！';
  }
  return;
}

const validateMultiSpecData = (multiSpecData, multiSpecClasses) => {

  let validateInfo = null;
  if (!multiSpecClasses || !multiSpecClasses.length) {
    return '未设置规格组！'
  }

  if (!multiSpecData || !multiSpecData.length) {
    return '未设置规格详情！'
  }


  if (multiSpecClasses.filter(item => item.status != -1).length <= 0) {
    return '未设置规格组！'
  }

  if (multiSpecData.filter(item => item.status != -1).length <= 0) {
    return '未设置规格详情！'
  }


  for (let i = 0; i < multiSpecClasses.length; i++) {
    if (multiSpecClasses[i].status == -1) {
      continue;
    }

    if (!multiSpecClasses[i].name) {
      return `第${i + 1}个规格组未设置名称`;
    }

    if (!multiSpecClasses[i].value || !multiSpecClasses[i].value.length) {
      return `第${i + 1}个规格组未设置规格`;
    } else {
      if (multiSpecClasses[i].value.filter(item => item.status != -1).length <= 0) {
        return `第${i + 1}个规格组未设置规格`;
      }
    }
  }



  for (let j = 0; j < multiSpecData.length; j++) {

    let specValue = multiSpecData[j].specValue;
    if (!multiSpecData[j].number) {
      return `商品-${specValue}未设置商品编码！`;
    }

    if (!multiSpecData[j].barCode) {
      return `商品-${specValue}未设置条码！`;
    }

    if (!multiSpecData[j].marketPrice || multiSpecData[j].marketPrice <= 0) {
      return `商品-${specValue}未设置市场价！`;
    }

    if (!multiSpecData[j].costPrice || multiSpecData[j].costPrice <= 0) {
      return `商品-${specValue}未设置成本价！`;
    }
  }
  return validateInfo
}

export {
  getSaveData,
  getParseDetailData,
  parseSpecData
}