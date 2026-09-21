import setaxios from "@/utils/setaxios";
import store from "@/store";

//购物车
export function getCartList(data) {
    return setaxios.post("Cart/index", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        cid:sessionStorage.getItem("cityId"),
        ...data
    });
}

//加减购物车
export function editCartNumber(data) {
    return setaxios.post("Cart/edit_cart", {
        channel_no: store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}

//删除购物车
export function delCart(data) {
    return setaxios.post("Cart/del_cart", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
// 结算
export function goCheckout(data) {
    return setaxios.post("Shop/checkout", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
// 立即支付-计算卡是否够支付
export function isPayDate(data) {
    return setaxios.post("Shop/pay_date", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
// 卡支付
export function toflkpay(data) {
    return setaxios.post("Shop/flkpay", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
// 微信支付
export function toWxpay(data) {
    return setaxios.post("Shop/wxpay", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
// 商城支付完成后检测
export function shopPaySuccess(data) {
    return setaxios.post("/Shop/pay_success", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
// 绑定卡-温馨提示
export function bindingcard(data) {
    return setaxios.post("/Card/bindingcard", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
// 二维码绑卡
export function qrcodeBinging(data) {
    return setaxios.post("/Card/scanbinding", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}