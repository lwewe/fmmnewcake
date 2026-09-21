// 个人中心
import setaxios from "@/utils/setaxios";
import store from "@/store";
// 首页
export function getCakeIndex(data) {
    return setaxios.post("Cake/index", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        ...data
    });
}
//首页分类产品
export function syflProduct(data) {
    return setaxios.post("Cake/syflproduct", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        ...data
    });
}
//首页分类二级分类
export function getCategoryProduct(data) {
    return setaxios.post("Cake/syfloneproduct", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        ...data
    });
}
//首页分类 - 美味推荐
export function getCakeNominate(data) {
    return setaxios.post("Cake/nominate", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        ...data
    });
}

// 分类产品
export function getCakeProductList(data) {
    return setaxios.post("Cake/product", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        ...data
    });
}
// 生日蛋糕
export function getCakeBirthdayList(data) {
    return setaxios.post("Cake/birthday", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        ...data
    });
}
// 节日甄选/送礼优选
export function getFestival(data) {
    return setaxios.post("Cake/festival", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        ...data
    });
}
//分类
export function cakeProduct(data) {
    return setaxios.post("Cake/product", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        ...data
    });
}