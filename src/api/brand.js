// 品牌直充
import setaxios from "@/utils/setaxios";
import store from "@/store";
// 品牌列表
export function getBrandDirect(data) {
    return setaxios.post("/Electron/lists", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 卡/充值商品详情页
export function cartDetailed(data) {
    return setaxios.post("/Electron/show", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 获取logo
export function getLogo() {
    return setaxios.post("/Login/index", {
        channel_no:store.state.channel_no,
    });
}
// 直充订单详情
export function getZcshow(data) {
    return setaxios.post("Order/zcshow", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 结算- 福利卡列表
export function getCardList(data) {
    return setaxios.post("Shop/card", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 福利卡列表-悦享卡
export function getEnjoyCardList(data) {
    return setaxios.post("Product/card", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
//////////////////////支付//
// 卡券微信支付
export function KaquanWxpay(data) {
    return setaxios.post("/Electron/wxpay", {
        channel_no: store.state.channel_no,
        ...data
    });
}
// 卡券支付完成后检测
export function KaquanPaySuccess(data) {
    return setaxios.post("/Electron/pay_success", {
        channel_no: store.state.channel_no,
        ...data
    });
}
//立即支付-计算卡是否够支付
export function toPay_date(data){
    return setaxios.post("/Electron/pay_date",{
        channel_no: store.state.channel_no,
        ...data
    })
}
// 福利卡支付
export function getflkpay(data){
    return setaxios.post("/Electron/flkpay",{
        channel_no: store.state.channel_no,
        ...data
    })
}