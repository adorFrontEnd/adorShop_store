import Toast from "../../utils/toast";

const getOrderSaveData = (orderData) => {
  let { orderBaseInfo, orderSKUList, storageId, selectAreaData, remark, selectUser, selectSaler } = orderData;
  if (!selectUser || !selectUser.id) {
    Toast("请选择会员！");
    return
  }

  let _orderBaseInfo = validateOrderBaseInfo(orderBaseInfo);
  if (!_orderBaseInfo) {
    return;
  }

  if (!selectAreaData) {
    Toast("请选择省市区！");
    return;
  }

  if (!storageId) {
    Toast("请选择发货仓库！");
    return;
  }


  let _skuData = validateSKU(orderSKUList);
  if (!_skuData) {
    return;
  }
  let { proviceName, cityName, districtName } = selectAreaData
  let params = {
    ..._orderBaseInfo,
    ..._skuData,
    storageId,
    remark,
    userId: selectUser.id,
    contactProvince: proviceName,
    contactCity: cityName,
    contactArea: districtName
  }

  if (selectSaler && selectSaler.id) {
    params.salesmanId = selectSaler.id;
  }
  return params
}

const validateOrderBaseInfo = (orderBaseInfo) => {
  if (!orderBaseInfo) {
    Toast("请设置订单基本信息");
    return;
  }

  let { mark, contactPerson, contactPhone, contactAddress, fare } = orderBaseInfo;

  if (mark && mark.length>6) {
    Toast("订单标志最多为6位！");
    return;
  }

  if (!contactPerson) {
    Toast("请填写收货人！");
    return;
  }

  if (!contactPhone) {
    Toast("请填写联系电话！");
    return;
  }

  if (!contactAddress) {
    Toast("请填写详细地址！");
    return;
  }

  if (!fare && fare != 0) {
    Toast("请填写运费！");
    return;
  }
  return orderBaseInfo
}

const validateSKU = (orderSKUList) => {

  if (!orderSKUList || !orderSKUList.length) {
    Toast("请添加商品！");
    return;
  }
  let data = [];
  let skuIds = [];
  for (let i = 0; i < orderSKUList.length; i++) {
    let { unitPrice, buyQty, sellPrdSkuId, baseUnit } = orderSKUList[i];
    if (!unitPrice && unitPrice != 0) {
      Toast(`请输入第${i + 1}商品的价格！`);
      return;
    }

    if (!buyQty || buyQty < 1) {
      Toast(`请输入第${i + 1}商品的数量！`);
      return;
    }

    data.push({
      unitPrice, buyQty, sellPrdSkuId, baseUnit
    })
    skuIds.push(sellPrdSkuId);
  }

  return {
    data: JSON.stringify(data),
    skuIds: skuIds.join()    
  }
}

const getTotalSkuListAmount = (orderSKUList) => {
  let totalAmount = 0;
  if (!orderSKUList || !orderSKUList.length) {
    return 0;
  }
  for (let i = 0; i < orderSKUList.length; i++) {
    let { unitPrice, buyQty } = orderSKUList[i];
    totalAmount += parseInt(unitPrice * 100 * buyQty) * 0.01;
  }
  return totalAmount;
}

const parseSmartOrderResult = (data) => {

  let { productIds, quantity, specNames } = data;
  let sellProductsData = parseSellProductResult({ productIds, quantity, specNames });
  return {
    ...data,
    sellProductsData
  }
}


const parseSellProductResult = ({ productIds, quantity, specNames }) => {
  if (!productIds || !productIds.length) {
    return
  }
  let sellProductsData = productIds.map((item, index) => {
    let idArr = item.split(":");
    let produceId = idArr && idArr[0] ? idArr[0] : null;
    let qty = quantity && quantity[index] ? parseInt(quantity[index]) : 0;
    let specName = specNames && specNames[index] ? specNames[index] : null;
    return {
      produceId,
      qty,
      specName
    }
  })
  return sellProductsData
}


export {
  getOrderSaveData,
  parseSmartOrderResult,
  getTotalSkuListAmount
}