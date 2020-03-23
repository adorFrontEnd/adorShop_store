import Toast from '../../utils/toast';

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
    imageUrl, isContainerUnit, isOpenSpec, name, paramList, specifications, videoUrl } = productDetail;

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
    imageUrl, isContainerUnit, isOpenSpec, paramList, videoFile, freightTemplateId:freightTemplateId || null
  }
  let specData = parseSpecData({ isOpenSpec, paramList });

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
  let { isOpenSpec, paramList } = specData;
  let isMultiSpec = !!isOpenSpec;
  let singleSpecData = [];
  let multiSpecData = []
  if (!isOpenSpec) {
    let _singleSpecData = paramList[0];
    let { id, barCode, costPrice, marketPrice, number, imageUrl, specValue, weight } = _singleSpecData;
    singleSpecData = {
      id,
      imageUrl: imageUrl.split("|"),
      specValue: "无",
      barCode, costPrice, marketPrice, number, weight     
    }
  }

  return {
    isMultiSpec, singleSpecData, multiSpecData
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


  let multiData = _getMultiSpecData(multiSpecData, multiSpecClasses, isEdit);
  paramGroupStrList = multiData.paramGroupStrList;

  return {
    validateData,
    isOpenSpec,
    paramStrList: JSON.stringify(paramStrList),
    paramGroupStrList: JSON.stringify(paramGroupStrList)
  }
}

const _getMultiSpecData = (multiSpecData, multiSpecClasses, isEdit) => {

  let paramGroupStrList = [];

  if (!isEdit) {
    paramGroupStrList = multiSpecClasses.map(item => {

      let { specName, specValues } = item;
      return {
        name: specName,
        isChange: true,
        status: 1,
        value: specValues.map(child => {
          return {
            name: child,
            isChange: true,
            status: 1
          }
        })
      }
    })
  }

  return {
    paramGroupStrList
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

export {
  getSaveData,
  getParseDetailData,
  parseSpecData
}