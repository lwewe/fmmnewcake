import setaxios from "@/utils/setaxios";
import store from "@/store";

//点餐城市

export function WyDiancanWydclist(data) {
    return setaxios.post("/WyDiancan/wydclist", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        url:'api/v2/City/GetList',
        ...data
    });
}

export function CateringStores(data) {
    return setaxios.post("/WyDiancan/wydclist", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        url:'api/Catering/Stores',
        ...data
    });
}


export function CateringMenus(data) {
    return setaxios.post("/WyDiancan/wydclist", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        url:'api/Catering/Menus',
        ...data
    });
}

export function CateringGoodsdetail(data) {
    return setaxios.post("/WyDiancan/wydclist", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        url:'api/Catering/GoodsDetail',
        ...data
    });
}



// 商品校验
export function DetailCheckgoods(data) {
    return setaxios.post("/WyDiancan/checkgoods", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        
        ...data
    });
}

// 获取logo
export function getLogo() {
    return setaxios.post("/Login/index", {
        channel_no: store.state.channel_no,


    });
}

// 列表图
export function getBannerList(data) {
    return setaxios.post("/Diancan/banner", {
        channel_no: store.state.channel_no,
        ...data
    });
}
export function getBannerLists(data) {
    return setaxios.post("/WyDiancan/banner", {
        channel_no: store.state.channel_no,
        ...data
    });
}
// 底部信息/点餐提示/公告
export function getdbtext(data) {
    return setaxios.post("/WyDiancan/dbtext", {
        channel_no: store.state.channel_no,

        ...data
    });
}
// export function getdbtext(data) {
//     return setaxios.post("/Diancan/dbtext", {
//         channel_no: store.state.channel_no,

//         ...data
//     });
// }
// 温馨提示 / 购买须知 / 友情提示
// hCatering/single
export function getsingle(data) {
    return setaxios.post("/Diancan/single", {
        channel_no: store.state.channel_no,
        ...data
    });
}

export function getsingles(data) {
    return setaxios.post("/WyDiancan/single", {
        channel_no: store.state.channel_no,
        ...data
    });
}

// 获取收藏列表
export function getCollect(data) {
    return setaxios.post("Diancan/collect", {
        channel_no: store.state.channel_no,
        ...data
    })
}

// 收藏/取消收藏店铺
export function getAddCollect(data) {
    return setaxios.post("Diancan/addcollect", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}

// 地址列表
// diancan/addresslist
export function getAddressList(data) {
    return setaxios.post("Diancan/dcaddress", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}

// 添加地址
// diancan/addressadd

export function getAddressAdd(data) {
    return setaxios.post("Diancan/adddcaddress", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}

// 查询地址
// diancan/addressadd

export function showdcaddress(data) {
    return setaxios.post("Diancan/showdcaddress", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}

// 修改地址
// diancan/addressedit
export function getAddressEdit(data) {
    return setaxios.post("Diancan/editdcaddress", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}

// 删除地址
// diancan/addressdelete
export function getAddressDelete(data) {
    return setaxios.post("Diancan/deldcaddress", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}

// 获取当前登录人的手机号
// /Member/index
export function getPhone(data) {
    return setaxios.post("/Member/index", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}


// 订单详细页
// Catering/order
// export function getOderdetail(data) {
//     return setaxios.post("Catering/show", {
//         channel_no: store.state.channel_no,
//         ...data
//     })
// }

// 订单列表
export function getOderList(data) {
    return setaxios.post("Catering/order", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}

// 检测受否展示点餐
export function getIsShowOder(data) {
    return setaxios.post("Cake/xzcard", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}
export function getIsShowOders(data) {
    return setaxios.post("Cake/xzdiancan", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}

// 创建订单
export function create_order(data) {
    return setaxios.post("Diancan/create_order", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}
// 结算-订单详情
export function showorder(data) {
    return setaxios.post("Diancan/showorder", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}
//结算-福利卡列表
export function getDiancanCard(data) {
    return setaxios.post("Diancan/card", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}
export function getDiancanCards(data) {
    return setaxios.post("WyDiancan/card", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}


// 计算卡是否够支付
export function diancanPay_date(data) {
    return setaxios.post("Diancan/pay_date", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}
export function diancanPay_dates(data) {
    return setaxios.post("WyDiancan/pay_date", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}

// 福利卡支付
export function diancanflkpay(data) {
    return setaxios.post("Diancan/flkpay", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}
export function diancanflkpays(data) {
    return setaxios.post("WyDiancan/flkpay", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}

// 微信支付
export function diancanwxpay(data) {
    return setaxios.post("Diancan/wxpay", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}
export function diancanwxpays(data) {
    return setaxios.post("WyDiancan/wxpay", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}

// 支付完成后检测
export function diancanpay_success(data) {
    return setaxios.post("Diancan/pay_success", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}

export function diancanpay_successend(data) {
    return setaxios.post("WyDiancan/pay_success", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}
// 订单详细页
export function getOderdetail(data) {
    return setaxios.post("Diancan/show", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}
//订单详细页
export function getOderdetails(data) {
    return setaxios.post("WyDiancan/show", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    })
}
