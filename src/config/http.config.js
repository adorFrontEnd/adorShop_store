let domain = '';




// 博文
domain = "http://192.168.20.58:9092";

// // 俊宝
domain = "http://192.168.20.53:9092";

//测试服
// domain = "http://47.103.71.160:9092";

let uploadDomain = "http://fi.adorsmart.com";

let uploadApiUrlPrefix = uploadDomain + "/";
let apiUrlPrefix = domain + "/";
let picUrlPrefix = "";
let signKey = "94a7cbbf8511a288d22d4cf8705d61d0";
let commonSign = '561wd03kkr86615s1de3x45s1d';
let qrcodeSign = '00461do1156916w1141c56r2ggw2';
let upLoadConfigData = {
  project: "adorShop"
}

export {
  apiUrlPrefix,
  picUrlPrefix,
  domain,
  signKey,
  commonSign,
  qrcodeSign,
  uploadApiUrlPrefix,
  upLoadConfigData
}