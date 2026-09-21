import request from "../utils/request";
import setaxios from "@/utils/setaxios";
import store from "@/store";
//获取城市
export function getCityList(data){
    return request.post("/diancan/getcity" , data )
}
export function getCakeCityList(data) {
    return setaxios.post("/Cake/city", {
        channel_no: store.state.channel_no,
        ...data
    });
}
export function searchCakeCity(data) {
    return setaxios.post("Cake/searchcity", {
        channel_no: store.state.channel_no,
        ...data
    });
}
export function Cakecityshow(data) {
    return setaxios.post("Cake/cityshow", {
        channel_no: store.state.channel_no,
        ...data
    });
}
//小程序定位
export function getLocations(data) {
    return setaxios.post("Film/getLocation", {
        channel_no: store.state.channel_no,
        ...data
    });
}