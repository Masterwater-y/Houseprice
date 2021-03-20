// 过滤所有特殊字符
export function stripscript(s) {
  var pattern = new RegExp(
    "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？↵\r\n]"
  );
  var rs = "";
  for (var i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, "");
  }
  return rs;
}

export function validateEmail(s) {
  let reg = /^([a-zA-Z|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  let res = reg.test(s);
  return res;
}

export function validatePwd(s) {
  let reg = /^(?!\d+$)(?![^a-zA-Z]+$)\S{6,20}$/;
  let res = reg.test(s);
  return res;
}

export function validateVcode(s) {
  let reg = /^[a-z0-9]{6}$/;
  let res = reg.test(s);
  return res;
}
