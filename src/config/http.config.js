let domain = '';
//sorta
// domain = "http://192.168.20.82:8095"; 

//俊宝
// domain = "http://192.168.20.94:9300";
// domain = "http://192.168.20.95:7100";
// domain = "https://api.trace.adorsmart.com";
// domain='http://test.com:9300'
// domain='http://sys.trace.adorsmart.com:7100'
// 博文
domain = "http://47.101.42.194:5054";
// domain = "http://192.168.20.56:5054";
let apiUrlPrefix = domain + "/";
let picUrlPrefix = "";
let signKey = "94a7cbbf8511a288d22d4cf8705d61d0";
let commonSign = '561wd03kkr86615s1de3x45s1d';
let qrcodeSign = '00461do1156916w1141c56r2ggw2';

export {
  apiUrlPrefix,
  picUrlPrefix,
  domain,
  signKey,
  commonSign,
  qrcodeSign
}