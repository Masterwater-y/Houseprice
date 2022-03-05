import cookie from "cookie_js";

const tokenId = "admin_Token";
const usernameKey = "username";
const uidKey = "uid";

export function getToken() {
  return cookie.get(tokenId);
}

export function setToken(token) {
  return cookie.set(tokenId, token);
}

export function removeToken() {
  return cookie.remove(tokenId);
}

export function setUsername(value) {
  return cookie.set(usernameKey, value);
}

export function getUsername() {
  return cookie.get(usernameKey);
}

export function removeUsername() {
  return cookie.remove(usernameKey);
}

export function setUid(value) {
  return cookie.set(uidKey, value);
}

export function getUid() {
  return cookie.get(uidKey);
}

export function removeUid() {
  return cookie.remove(uidKey);
}

/**
 * 时间戳格式化函数
 * @param  {string} format    格式
 * @param  {Date}    timestamp 要格式化的时间 默认为当前时间
 * @return {string}           格式化的时间字符串
 */
export function stamp2date(timestamp) {
//时间戳转换方法    date:时间戳数字
  let YY=timestamp.getFullYear()
  let MM=timestamp.getMonth()+1
  if (MM<10) MM='0'+MM
  let DD=timestamp.getDate()
  if (DD<10) DD='0'+DD
  console.log(YY+'-'+MM+'-'+DD)
  return YY+'-'+MM+'-'+DD



}
