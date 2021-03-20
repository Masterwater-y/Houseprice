import service from "@/utils/requests";
/**
 * 获取验证码
 */
export function GetCityList(data) {
  return service.request({
    method: "post",
    url: "/getCityList/",
    data, //data:data同名可以直接写 data
  });
}

export function GetTownList(data) {
  return service.request({
    method: "post",
    url: "/getTownList/",
    data, //data:data同名可以直接写 data
  });
}

export function GetBlockList(data) {
  return service.request({
    method: "post",
    url: "/getBlockList/",
    data, //data:data同名可以直接写 data
  });
}

export function GetChartData(data) {
  return service.request({
    method: "post",
    url: "/getChartData/",
    data, //data:data同名可以直接写 data
  });
}

export function GetListedBlock(data) {
  return service.request({
    method: "post",
    url: "/getListedBlock/",
    data, //data:data同名可以直接写 data
  });
}

export function GetListedData(data) {
  return service.request({
    method: "post",
    url: "/getListedData/",
    data, //data:data同名可以直接写 data
  });
}
