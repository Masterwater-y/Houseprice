import cookie from "cookie_js";

const tokenId = "admin_Token";
const usernameKey = "username";

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

export function dateToString(date) {}
