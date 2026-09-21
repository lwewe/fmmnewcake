import setaxios from "@/utils/setaxios";
import store from "@/store";


// 结算-福利卡列表
export function getcardList(data) {
    return setaxios.post("Catering/card", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
//lanyan ka
export function getcardLists(data) {
    return setaxios.post("WyDiancan/card", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}



// 福利卡是否够支付
// Catering/pay_date
export function getcardPay(data) {
    return setaxios.post("Catering/pay_date", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}

// 福利卡是否够支付 lanyan
// Catering/pay_date
export function getcardPays(data) {
    return setaxios.post("WyDiancan/pay_date", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}



// 福利卡支付
// Catering/flkpay
export function flkpay(data) {
    return setaxios.post("Catering/flkpay", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}


// 微信支付
// Catering/wxpay

export function wxpay(data) {
    return setaxios.post("Catering/wxpay", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
export function wxpays(data) {
    return setaxios.post("WyDiancan/wxpay", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}

// 支付完成检测
// Catering/pay_success
export function pay_success(data) {
    return setaxios.post("Catering/pay_success", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}