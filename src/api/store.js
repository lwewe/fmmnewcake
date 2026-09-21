import request from "../utils/request";

//星巴克
// 获取星巴克附近门店
export function getXBKStoreList(data){
    return request.post("/diancan/xbkstore" , data )
}
// 获取星巴克门店商品
export function getXBKProductList(data){
    return request.post("/diancan/xbkgoods" , data )
}
// 获取星巴克商品详情
// /diancan/xbkgoodsdetail
export function getXBKProductDetail(data){
    return request.post("/diancan/xbkgoodsdetail" , data )
}
// 获取星巴克商品订单校验
// diancan/xbkordercheck
export function getXBKVerify(data){
    return request.post("/diancan/xbkordercheck" , data )
}


// 麦当劳
// 获取麦当劳门附近门店
export function getMDLStoreList(data){
    return request.post("/diancan/mdlstorenear" , data )
}
// 获取麦当劳门店商品
// diancan/mdlgoods
export function getMDLProductList(data){
    return request.post("/diancan/mdlgoods" , data )
}
// 获取麦当劳商品详情
// diancan/mdlgoodsdetail
export function getMDLProductDetail(data){
    return request.post("/diancan/mdlgoodsdetail" , data )
}
// 麦当劳订单校验
// mdlordercheck
export function getMDLVerify(data){
    return request.post("/diancan/mdlordercheck" , data )
}



// 奈雪的茶
// nxstore
// 获取奈雪附近门店
export function getNXStoreList(data){
    return request.post("/diancan/nxstore" , data )
}
// 获取奈雪的茶门店商品
export function getNXProductList(data){
    return request.post("/diancan/nxgoods" , data )
}
// 获取奈雪商品详情
export function getNXProductDetail(data){
    return request.post("/diancan/nxgoodsdetail" , data )
}
// 奈雪的茶订单校验
export function getNXVerify(data){
    return request.post("/diancan/nxordercheck" , data )
}


//必胜客

// 获取必胜客附近门店
export function getBSKStoreList(data){
    return request.post("/diancan/bskstore" , data )
}
// 获取必胜客门店商品
export function getBSKProductList(data){
    return request.post("/diancan/bskgoods" , data )
}
// 获取必胜客商品详情
export function getBSKProductDetail(data){
    return request.post("/diancan/bskgoodsdetail" , data )
}
// 获取必胜客订单校验
// /diancan/bskordercheck
export function getBSKVerify(data){
    return request.post("/diancan/bskordercheck" , data )
}



// 肯德基diancan/kfcstorenear
export function getKFCStoreList(data){
    return request.post("/diancan/kfcstorenear" , data )
}
// 获取肯德基门店商品
// /kfcgoods
export function getKFCProductList(data){
    return request.post("/diancan/kfcgoods" , data )
}
// 获取肯德基商品详情
export function getKFCProductDetail(data){
    return request.post("/diancan/kfcgoodsdetail" , data )
}
// 肯德基订单校验
// /kfcordercheck
// 肯德基订单校验
export function getKFCVerify(data){
    return request.post("/diancan/kfcordercheck" , data )
}



// 
// // diancan/orderdetail
// export function getorderdetail(data){
//     return request.post("/diancan/orderdetail" , data )
// }