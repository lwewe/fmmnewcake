// 个人中心
import setaxios from "@/utils/setaxios";
import store from "@/store";
// 品牌列表
export function getBrindList(data) {
    return setaxios.post("Cake/brand", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        ...data
    });
}
// 品牌详情
export function getBrindDetail(data) {
    return setaxios.post("Cake/showBrand", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        ...data
    });
}
