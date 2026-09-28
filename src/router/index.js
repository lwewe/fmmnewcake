import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from "@/HelloWorld.vue";
import OrderFood from "@/views/store/OrderFood.vue";
import Select from '@/views/store/Select.vue'
import DistanceStore from "@/views/store/DistanceStore.vue"
import DistanceStorenew from "@/views/store/DistanceStorenew.vue"

import CityList from "@/views/city/CityList.vue"
import VueRouter from "vue-router";
import IndexView from "@/views/IndexView.vue";
import ShopCart from "@/views/cart/ShopCart.vue";
import PersonCenter from "@/views/mine/PersonCenter.vue";
import OrderInfo from "@/views/order/OrderInfo.vue";
import OrderDetail from "@/views/order/OrderDetail.vue";
import OrderPay from '@/views/order/OrderPay.vue';
import OrderPaynew from '@/views/order/OrderPaynew.vue';

import OrderPaynx from '@/views/order/OrderPaynx.vue';

import LocationCity from '@/views/mine/LocationCity.vue';
// 商品列表
import SelectProduct from '@/views/store/SelectProduct.vue';


import SelectProductMDL from '@/views/store/SelectProductMDL.vue';
import ProductDetailMDLNew from '@/views/store/ProductDetailMDLNew.vue';


import SelectProductwmkdj from '@/views/store/SelectProductwmkdj.vue';
import ProductDetailwmkdj from '@/views/store/ProductDetailwmkdj.vue';



import SelectProductKDJ from '@/views/store/SelectProductKDJ.vue';
import ProductDetailKDJ from '@/views/store/ProductDetailKDJ.vue';

import SelectProductnew from '@/views/store/SelectProductnew.vue';





import SelectnxProduct from '@/views/store/SelectnxProduct.vue';

import SelectProductadd from '@/views/store/SelectProductadd.vue';
import SelectProductXBK from '@/views/store/SelectProductXBK.vue'
import SelectProductBSK from '@/views/store/SelectProductBSK.vue';
import SelectProductNX from '@/views/store/SelectProductNX.vue';

// 商品详情
import ProductDetailKFC from '@/views/store/ProductDetailKFC.vue';


import ProductDetailMDL from '@/views/store/ProductDetailMDL.vue';


import ProductDetailnew from '@/views/store/ProductDetailnew.vue';

import ProductDetailXBK from '@/views/store/ProductDetailXBK.vue';
import ProductDetailBSK from '@/views/store/ProductDetailBSK.vue';
import ProductDetailNX from '@/views/store/ProductDetailNX.vue'

import ProductnxDetail from '@/views/store/ProductnxDetail.vue'



import AddressManagement from "@/views/store/AddressManagement.vue";
import AddAdress from "@/views/store/AddAdress.vue";
import QuickLogin from "@/views/login/QuickLogin.vue";
import Login from "@/views/login/Login.vue";
import AfternoonTea from "@/views/cake/AfternoonTea.vue";
import NiceBirthday from "@/views/cake/NiceBirthday.vue";
import ExchangeList from "@/views/cake/ExchangeList.vue";
import ProductDetail from "@/views/cake/ProductDetail.vue";
import ConfirmOrder from "@/views/order/ConfirmOrder.vue";
import CakeOrderDetail from "@/views/order/CakeOrderDetail.vue";
import BrandDetail from "@/views/brand/BrandDetail.vue";
import BirthdayCake from "@/views/cake/BirthdayCake.vue";
import AllCakeBrand from "@/views/cake/AllCakeBrand.vue";
import BrandSelection from "@/views/cake/BrandSelection.vue";
import BrandSelectiondetails from "@/views/cake/BrandSelectiondetails.vue";
import BrandSelectiondetailsadd from "@/views/cake/BrandSelectiondetailsAdd.vue";
import BrandSelectiondetailsone from "@/views/cake/BrandSelectiondetailsone.vue";
import BrandSelectiondetailsclassfy from "@/views/cake/BrandSelectiondetailsclassfy.vue";


import BrandCouPon from "@/views/brand/BrandCouPon.vue";
import CouPonDetail from "@/views/brand/CouPonDetail.vue";
import CakeCityList from "@/views/city/CakeCityList.vue";
import CouPonConfirmOrder from "@/views/order/CouPonConfirmOrder.vue";
import AllStore from "@/views/city/AllStore.vue";
import CouPonOrderDetail from "@/views/order/CouPonOrderDetail.vue";
import ShopDetail from "@/views/cake/ShopDetail.vue";
import CakeExitAdress from "@/views/mine/CakeExitAdress.vue";
import CakeAddressList from "@/views/mine/CakeAddressList.vue";
import Setting from "@/views/mine/Setting.vue";
import DirectCharge from "@/views/service/DirectCharge.vue";
import DirectChargeOrder from "@/views/order/DirectChargeOrder.vue";
import newCityList from "@/views/city/newCityList.vue";
import Checkstand from "@/views/order/Checkstand.vue";
import Checkstandnew from "@/views/order/Checkstandnew.vue";


import Notification from "@/views/service/Notification.vue";
Vue.use(Router)


const routes = [
    {
        path: '',
        redirect: "/index"
    },
    {
        path: '/helloWord',
        component: HelloWorld,
        meta: {
            title: 'helloWord'
        }
    }, {
        path: '/index',
        component: IndexView,
        meta: {
            title: '蛋糕',
            keepAlive:true,
            keep:true,
            active:0
        }
    }, {
        path: '/shopCart',
        component: ShopCart,
        meta: {
            title: '购物车'
        }
    }, {
        path: '/mine',
        component: PersonCenter,
        meta: {
            title: '我的',
            keepAlive:true,
            keep:true,
            active:3
        }
    }, {
        path: '/order',
        component: OrderInfo,
        meta: {
            title: '我的订单'
        }
    }, {
        path: '/orderDetail',
        component: OrderDetail,
        meta: {
            title: '订单详情'
        }
    },
    {
        path: '/quickLogin',
        component: QuickLogin,
        meta: {
            title: '快捷登录'
        }
    },{
        path: '/login',
        component: Login,
        meta: {
            title: '登录'
        }
    },{
        path: '/afternoonTea',
        component: AfternoonTea,
        meta: {
            title: '下午茶',
            keepAlive:true,
            keep:true,
        }
    },{
        path: '/niceBirthday',
        component: NiceBirthday,
        meta: {
            title: '生日好礼',
            keepAlive:true,
            keep:true,
        }
    },{
        path: '/exchangeList',
        component: ExchangeList,
        meta: {
            title: '兑换榜单',
            keepAlive:true,
            keep:true,
        }
    },{
        path: '/productDetail',
        component: ProductDetail,
        meta: {
            title: '商品详情'
        }
    },{
        path: '/confirmOrder',
        component: ConfirmOrder,
        meta: {
            title: '确认订单'
        }
    },{
        path: '/cakeOrderDetail',
        component: CakeOrderDetail,
        meta: {
            title: '订单详情'
        }
    },{
        path: '/brandDetail',
        component: BrandDetail,
        meta: {
            title: '品牌详情'
        }
    },{
        path: '/birthdayCake',
        component: BirthdayCake,
        meta: {
            title: '生日蛋糕',
            keepAlive:true,
            keep:true,
        }
    },{
        path: '/allCakeBrand',
        component: AllCakeBrand,
        meta: {
            title: '蛋糕品牌',
            keepAlive:true,
            keep:true,
        }
    },{
        path: '/brandSelection',
        component: BrandSelection,
        meta: {
            title: '品牌精选',
            keepAlive:true,
            keep:true,
        }
    },
    {
        path: '/brandaelectiondetails',
        component: BrandSelectiondetails,
        meta: {
            title: '品牌精选详情',
            keepAlive:true,
            keep:true,
        }
    },
    {
        path: '/brandselectiondetailsadd',
        component: BrandSelectiondetailsadd,
        meta: {
            title: '详情',
            keepAlive:true,
            keep:true,
        }
    },
    {
        path: '/brandselectiondetailsone',
        component: BrandSelectiondetailsone,
        meta: {
            title: '详情',
            keepAlive:true,
            keep:true,
        }
    },

    {
        path: '/BrandSelectiondetailsclassfy',
        component: BrandSelectiondetailsclassfy,
        meta: {
            title: '详情',
            keepAlive:true,
            keep:true,
        }
    },
    {
        path: '/brandCouPon',
        component: BrandCouPon,
        meta: {
            title: '品牌详情'
        }
    },{
        path: '/couPonDetail',
        component: CouPonDetail,
        meta: {
            title: '卡券详情'
        }
    },{
        path: '/cakeCityList',
        component: CakeCityList,
        meta: {
            title: '城市'
        }
    },{
        path: '/couPonConfirmOrder',
        component: CouPonConfirmOrder,
        meta: {
            title: '确认订单'
        }
    },{
        path: '/allStore',
        component: AllStore,
        meta: {
            title: '所有门店'
        }
    },{
        path: '/couPonOrderDetail',
        component: CouPonOrderDetail,
        meta: {
            title: '订单详情'
        }
    },{
        path: '/ShopDetail',
        component: ShopDetail,
        meta: {
            title: '商品详情'
        }
    },{
        path: '/cakeAddressList',
        component: CakeAddressList,
        meta: {
            title: '地址管理'
        }
    },{
        path: '/cakeExitAdress',
        component: CakeExitAdress,
        meta: {
            title: '添加地址'
        }
    },{
        path: '/setting',
        component: Setting,
        meta: {
            title: '设置',
            keepAlive:true,
            keep:true,
        }
    },
    // 到店消费页面
    {
        path: '/orderfood',
        component: OrderFood,
        meta: {
            title: '到店消费',
            keepAlive:true,
            keep:true,
        }
    },

    {
        path: '/select',
        component: Select,
        meta: {
            title: '选择方式',
        }
    },
    {
        path: '/distancestore',
        component: DistanceStore,
        meta: {
            title: '附近门店',
        }
    },{
        path: '/distancestorenew',
        component: DistanceStorenew,
        meta: {
            title: '附近门店',
        }
    },

    {
        path: '/citylist',
        component: CityList,
        meta: {
            title: '城市'
        }
    },
    {
        path: '/newCityList',
        component: newCityList,
        meta: {
            title: '城市'
        }
    },
    {
        path: '/selectproduct',
        component: SelectProduct,
        meta: {
            title: '选餐',
        }
    },

{
        path: '/selectproductmdl',
        component: SelectProductMDL,
        meta: {
            title: '麦当劳选餐',
        }
    },
    {
        path: '/SelectProductKDJ',
        component: SelectProductKDJ,
        meta: {
            title: '肯德基选餐',
        }
    },
{
        path: '/selectproductnew',
        component: SelectProductnew,
        meta: {
            title: '选餐',
        }
    },

    {
        path: '/selectnxproduct',
        component: SelectnxProduct,
        meta: {
            title: '选餐',
        }
    },
    {
        path: '/selectproductadd',
        component: SelectProductadd,
        meta: {
            title: '选餐',
        }
    },
    {
        path: '/selectproductxbk',
        component: SelectProductXBK,
        meta: {
            title: '选餐',
        }
    },
    {
        path: '/selectproductbsk',
        component: SelectProductBSK,
        meta: {
            title: '选餐',
        }
    },
    {
        path: '/selectproductnx',
        component: SelectProductNX,
        meta: {
            title: '选餐',
        }
    },
    {
        path: '/productdetailkfc',
        component: ProductDetailKFC,
        meta: {
            title: '详情'
        }
    },
    {
        path: '/productdetailmdl',
        component: ProductDetailMDL,
        meta: {
            title: '详情'
        }
    },

     {
        path: '/productdetailmdlnew',
        component: ProductDetailMDLNew,
        meta: {
            title: '详情'
        }
    },

    {
        path: '/ProductDetailwmkdj',
        component: ProductDetailwmkdj,
        meta: {
            title: '肯德基外卖详情'
        }
    }, 
    {
        path: '/SelectProductwmkdj',
        component: SelectProductwmkdj,
        meta: {
            title: '肯德基外卖'
        }
    },

    

 {
        path: '/productdetailkdj',
        component: ProductDetailKDJ,
        meta: {
            title: '详情'
        }
    },



{
        path: '/productdetailnew',
        component: ProductDetailnew,
        meta: {
            title: '详情'
        }
    },
    {
        path: '/productnxdetail',
        component: ProductnxDetail,
        meta: {
            title: '详情'
        }
    },
    {
        path: '/productdetailxbk',
        component: ProductDetailXBK,
        meta: {
            title: '详情'
        }
    },
    {
        path: '/productdetailbsk',
        component: ProductDetailBSK,
        meta: {
            title: '详情'
        }
    },
    {
        path: '/productdetailnx',
        component: ProductDetailNX,
        meta: {
            title: '详情'
        }
    },
    {
        path: '/orderpay',
        component: OrderPay,
        meta: {
            title: '支付'
        }
    },
    {
        path: '/orderpaynew',
        component: OrderPaynew,
        meta: {
            title: '支付'
        }
    },
    {
        path: '/orderpaynx',
        component: OrderPaynx,
        meta: {
            title: '支付'
        }
    },

    {
        path: '/checkstand',
        component: Checkstand,
        meta: {
            title: '收银台'
        }
    },
 {
        path: '/checkstandnew',
        component: Checkstandnew,
        meta: {
            title: '收银台'
        }
    },

    {
        path: '/address',
        component: AddressManagement,
        meta: {
            title: '地址管理'
        }
    }, {
        path: '/addAddress',
        component: AddAdress,
        meta: {
            title: '新建地址'
        }
    },
    {
        path: '/locationcity',
        component: LocationCity,
        meta: {
            title: '获取位置'
        }
    },{
        path: '/directCharge',
        component: DirectCharge,
        meta: {
            title: '直充详情'
        }
    },
    {
        path: '/notification',
        component: Notification,
        meta: {
            title: '直充详情'
        }
    },
    {
        path: '/directChargeOrder',
        component: DirectChargeOrder,
        meta: {
            title: '订单详情'
        }
    },
]

const router = new Router({
    routes,
    mode: 'hash',
    scrollBehavior(to, from, savedPosition) {
        // 对于 keepAlive 的页面，不做滚动处理
        if (to.meta.keepAlive) {
            return false;
        }
        
        // 浏览器前进/后退时使用保存的位置
        if (savedPosition) {
            return savedPosition;
        }
        
        // 其他情况滚动到顶部
        return { x: 0, y: 0 };
    }
})
// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location, onResolve, onReject) {

    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)

    return originalPush.call(this, location).catch(err => err)

}
router.beforeEach((to, from, next) => {
    document.title = to.meta.title
//     document.body.scrollTop = 0
// // firefox
//     document.documentElement.scrollTop = 0
// // safari
//     window.pageYOffset = 0
 if (!to.meta.keepAlive) {
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
        window.pageYOffset = 0
    }
    next()
})

export default router