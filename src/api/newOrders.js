import request from "../utils/nweRequests";


//获取城市
export function v2getCitiesList(data) {
    return request.post("/City/GetList", data);
}


