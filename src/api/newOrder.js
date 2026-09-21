import request from "../utils/nweRequest";

//获取接口访问令牌
export function getAccessToken(data) {
    return request.post("/api/oauth/token", data);
}
//获取城市列表
export function getCitiesList(data) {
    return request.get("/api/city/list", data);
}


//平台店铺列表
export function getShopsList(data) {
    return request.get("/api/kfc/shops", data);
}
// 店铺详情
export function getShopsDetail(data) {
    return request.get("/api/kfc/shop", data);
}
// 菜单
export function getMenusList(data) {
    return request.get("/api/kfc/menus", data);
}
// 商品详情
export function getgoods_detail(data) {
    return request.get("/api/kfc/goods_detail", data);
}
// 创建订单(
export function createNewOrder(data) {
    return request.post("/api/kfc/create_order", data);
}