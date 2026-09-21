// 个人中心
import setaxios from "@/utils/setaxios";
import store from "@/store";
// 品牌列表
export function getCouPonList(data) {
    return setaxios.post("Coupons/index", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        // token:localStorage.getItem("token"),
        ...data
    });
}
// 品牌详细页
export function getCouPonDetail(data) {
    return setaxios.post("Coupons/brand", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        // token:localStorage.getItem("token"),
        ...data
    });
}
// 商品详细页
export function getCouPonShopDetail(data) {
    return setaxios.post("Coupons/detail", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        // token:localStorage.getItem("token"),
        ...data
    });
}
// 增加数量
export function changeNum(data) {
    return setaxios.post("Coupons/jia", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        token:localStorage.getItem("token"),
        ...data
    });
}
// 立即支付-计算卡是否够支付
export function couponIsPayDate(data) {
    return setaxios.post("/Coupons/pay_date", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        token:localStorage.getItem("token"),
        ...data
    });
}
// 福利卡支付
export function couponFlkpay(data) {
    return setaxios.post("/Coupons/flkpay", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        token:localStorage.getItem("token"),
        ...data
    });
}
// 福利卡支付
export function couponwxpay(data) {
    return setaxios.post("/Coupons/wxpay", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        token:localStorage.getItem("token"),
        ...data
    });
}
// 支付完成后检测
export function couponPaySuccess(data) {
    return setaxios.post("Coupons/pay_success", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}