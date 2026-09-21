import Vue from 'vue'
import Vuex from 'vuex'
import moment from "moment/moment";
import 'moment/locale/zh-cn';
import {getLogo} from "@/api/login";
moment.locale('zh-cn');
Vue.use(Vuex)

// 用来存储数据
const state = {
    channel_no:"12358",
    appkey: "f2385fa1170d818d",
    privatekey: "71e1e4a283292c1f25ba15993a7b8f30",
    timestamp:moment(new Date()).format('yyyy-MM-DD HH:mm:ss'),
    // baseUrl:"http://192.168.3.7/",
    // baseUrl:"https://sc.bjyxfl.com/",
    baseUrl:"http://image.bjyxfl.com/",
    baseUrl2:"https://gw.alicdn.com/tfscom/",
    token:"",
    uid:"10086",
    targetId:"",
    cityName:"",
    address:"请选择地址",
    // location:"石家庄桥西区休门街蓝拓商务中心",
    locationdetail:"",
    // jingdu:"38.042323",
    // weidu:"114.507817",
    // 114.490686,36.612273
    lng:"",
    lat:"",
    address_id:"",
    kefu:"",
    base: "http://yxfmm.bjyxfl.com/film/#",
    Shopbase: "http://yxfmm.bjyxfl.com/fmmShop/#",
    // fmmShop
    // base: "http://yxfmm.bjyxfl.com/multiplex/#",
    // Shopbase: "http://yxfmm.bjyxfl.com/mall/#/index",
    // Shopbase: " http://192.168.3.9:8081/#",
    storeName:"",
    // base:"http://yxfmm.bjyxfl.com/fim2/#",
    // base:"http://127.0.0.1:8081/#",
    flag:true
}
// 响应组件中的事件
const actions = {
    // 命名可以直接后边加Action
    getUserInfoAction({commit, state}, params) {
        getLogo().then(res => {
            // console.log(res,"kefu")
            if (res.code == 200) {
                commit("changekefu",res.data.zxkf)
                localStorage.setItem("kefu",res.data.zxkf)
            }
        })
    }

}
// 操作数据
const mutations = {
    settoken(state, token) {
        state.token = token;
    },
    setuid(state, uid){
        state.uid = uid;
    },
    changeTargetId(state, uid){
        state.targetId = uid;
    },
    changeCityName(state, uid){
        state.cityName = uid;
    },
    changekefu(state, uid){
        state.kefu = uid;
    },
    changeAddress(state, uid){
        state.address = uid;
    },
    changelng(state, uid){
        state.lng = uid;
    },
    changelat(state, uid){
        state.lat = uid;
    },
    changeStoreName(state, uid){
        state.storeName = uid;
    },
}
// 用来将state数据进行加工
const getters = {}
// 新建并暴露store
export default new Vuex.Store({
    state,
    actions,
    mutations,
    getters
})
