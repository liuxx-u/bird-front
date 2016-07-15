/**
 * Created by Administrator on 2016/5/30.
 */

import {BodeAuth} from './bode';
import {message} from 'antd';


const BodeFetch=function (url,data,func) {
    let header={"Content-Type": "application/json"};
    if(BodeAuth.isAuth()){
        header["Authorization"]="Bearer "+BodeAuth.getToken();
    }

    fetch(url,{
        method: "POST",
        headers: header,
        body: JSON.stringify(data)
    }).then(function (res) {
        if (res.ok){
            res.json().then(function (data) {
                if(data.success){
                    func(data.result);
                }
                else if(data.unAuthorizedRequest){
                    BodeAuth.clearToken();
                    location.href="/admin/login";
                }
                else {
                    message.error('出现错误，请联系系统管理员');
                }
            })
        }
        else{
            message.error('请求错误');
        }
    });
}

export default BodeFetch;
