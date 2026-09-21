import Vue from 'vue'
import App from './App.vue'
import router from "./router";
// 时间格式化过滤器
import moment from 'moment';
Vue.filter('dateFormat',(dateStr,pattern = 'YYYY-DD-MM HH:mm:ss')=>{
    return moment(dateStr).format(pattern)
})
import $ from 'jquery'
Vue.prototype.$ = $


// 导入进度条插件
import NProgress from './components/EnterLoging.vue';
import loading from './components/loding.vue';
// vue vant 组件
// import Vant from 'vant';
import 'vant/lib/index.css'
import {Tabbar, TabbarItem} from 'vant';
import { Loading } from 'vant';
Vue.use(Loading);
Vue.use(Tabbar).use(TabbarItem);
import {Field} from 'vant';

Vue.use(Field);
import {Button} from 'vant';

Vue.use(Button);

Vue.use(Swipe).use(SwipeItem);
import { Cell, CellGroup,Search,Icon,Swipe, SwipeItem,Tab, Tabs,Checkbox, CheckboxGroup,Lazyload,Toast,Overlay,Radio,RadioGroup,Badge} from 'vant';
Vue.use(Cell).use(CellGroup).use(Search).use(Icon).use(Swipe).use(SwipeItem).use(Tab).use(Tabs).use(Checkbox).use(CheckboxGroup).use(Lazyload).use(Toast).use(Badge);
import { Popup,Dialog} from 'vant';
Vue.use(Popup);
Vue.use(Dialog);
import { PasswordInput, NumberKeyboard,TreeSelect,NoticeBar} from 'vant';

Vue.use(PasswordInput).use(NumberKeyboard).use(TreeSelect).use(NoticeBar);
import { Uploader } from 'vant';
Vue.use(Uploader);
import { Stepper } from 'vant';
Vue.use(Stepper);
Vue.use(Popup).use(Overlay).use(Radio).use(RadioGroup);
import {
    GoodsAction,
    GoodsActionBigBtn,
    GoodsActionMiniBtn
} from 'vant';

Vue
    .use(GoodsAction)
    .use(GoodsActionBigBtn)
    .use(GoodsActionMiniBtn);
import { AddressList } from 'vant';

Vue.use(AddressList);
import { Switch } from 'vant';

Vue.use(Switch);
//vant 组件结束

Vue.component('loading', loading);

import ReturnBack from '../src/components/ReturnBack.vue'

Vue.component("ReturnBack",ReturnBack)
// ASCLL 和 md5
import * as utils from './utils'

Vue.prototype.$utils = utils;
// vuex
import store from './store/index';

Vue.config.productionTip = false
Vue.component('NProgress', NProgress);

import VueAMap from "vue-amap";//引入高德地图
Vue.use(VueAMap)//挂在到Vue实例上

// 初始化vue-amap
VueAMap.initAMapApiLoader({

    // 高德的key
    key: "3777f1828bad92916c97514340d7e7c8",
    // 插件集合

    plugin: [
        "AMap.Autocomplete",
        "AMap.PlaceSearch",
        "AMap.Scale",
        "AMap.OverView",
        "AMap.ToolBar",
        "AMap.MapType",
        "AMap.PolyEditor",
        "AMap.CircleEditor",
        "AMap.Geolocation",
        "Geocoder",
    ],

    // 高德 sdk 版本，默认为 1.4.4

    v: "1.4.4",

});
//高德的安全密钥
window._AMapSecurityConfig = {
    securityJsCode: "cfea9f5e508fac192acd9fe1c66e5ab2",
};


import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
 // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key
    ak: 'b3nPqKCpAtoSG03oDXu2FjuIUFvWOn9C'
})



new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
