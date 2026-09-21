import setaxios from "@/utils/setaxios";
import store from "@/store";

//省
export function getBookScprovince() {
    return setaxios.post("/Personal/showtsprovince", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token")
    });
}
// 市
export function getBookCity(data) {
    return setaxios.post("/Personal/showtscity", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 县/区
export function getBookCounty(data) {
    return setaxios.post("/Personal/showtscounty", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 地址列表
export function getBookAddress(data) {
    return setaxios.post("/Personal/tsaddress", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 添加地址
export function addBookAddress(data) {
    return setaxios.post("Personal/addtsaddress", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 查看收货地址
export function showBookaddress(data) {
    return setaxios.post("Personal/showtsaddress", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 修改地址
export function editbookaddress(data) {
    return setaxios.post("Personal/edittsaddress", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 删除收货地址
export function delbookaddress(data) {
    return setaxios.post("Personal/deltsaddress", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 设置默认收货地址
export function mrbookaddress(data) {
    return setaxios.post("Personal/mrtsaddress", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}