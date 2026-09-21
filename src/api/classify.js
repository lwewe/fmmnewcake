import setaxios from "@/utils/setaxios";
import store from "@/store";

//分类列表
export function getClassifyList() {
    return setaxios.post("/Classify/index", {
        channel_no:store.state.channel_no
    });
}
// 品牌列表
export function getBrandList(data) {
    return setaxios.post("Classify/brand", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 商品列表
export function getBrandShopList(data) {
    return setaxios.post("Product/index", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 卡券商品
export function getCardShopList(data) {
    return setaxios.post("Product/kaquan", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 卡/充值商品
export function lifeServices(data) {
    return setaxios.post("Product/lifeServices", {
        channel_no:store.state.channel_no,
        ...data
    });
}