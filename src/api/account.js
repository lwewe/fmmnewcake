// 个人中心
import setaxios from "@/utils/setaxios";
import store from "@/store";
// 门店
export function getAllStore(data) {
    return setaxios.post("Cart/selshop", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        token:localStorage.getItem("token"),
        ...data
    });
}
// 结算
export function toCheckout(data) {
    return setaxios.post("Cart/checkout", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        token:localStorage.getItem("token"),
        ...data
    });
}
// 福利卡
export function getflkList(data) {
    return setaxios.post("Cart/card", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}

export function getflkLists(data) {
    return setaxios.post("Shop/card", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}

// 立即支付-计算卡是否够支付
export function cakeIsPayDate(data) {
    return setaxios.post("Cart/pay_date", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        token:localStorage.getItem("token"),
        ...data
    });
}
// 卡支付
export function cakeFlkpay(data) {
    return setaxios.post("Cart/flkpay", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        token:localStorage.getItem("token"),
        ...data
    });
}
// 微信支付
export function cakewxpay(data) {
    return setaxios.post("Cart/wxpay", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        token:localStorage.getItem("token"),
        ...data
    });
}
// 支付完成后检测
export function cakeIsPaySuccess(data) {
    return setaxios.post("Cart/pay_success", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}