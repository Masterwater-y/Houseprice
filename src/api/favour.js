import service from "@/utils/requests";
/**
 * 获取验证码
 */
export function GetFavour(data) {
  return service.request({
    method: "post",
    url: "/getFavour/",
    data, //data:data同名可以直接写 data
  });
}

export function AddFavour(data) {
  return service.request({
    method: "post",
    url: "/addFavour/",
    data, //data:data同名可以直接写 data
  });
}

export function DeleteFavour(data) {
  return service.request({
    method: "post",
    url: "/deleteFavour/",
    data, //data:data同名可以直接写 data
  });
}
