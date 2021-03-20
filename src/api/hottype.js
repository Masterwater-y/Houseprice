import service from "@/utils/requests";
/**
 * 获取验证码
 */
export function GetHotType(data) {
  return service.request({
    method: "post",
    url: "/getHotType/",
    data, //data:data同名可以直接写 data
  });
}
