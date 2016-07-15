/**
 * Created by Administrator on 2016/4/27.
 */

const BodeTools={
    url: {
        encode: function (url) {
            return encodeURIComponent(url);
        },
        decode: function (url) {
            return decodeURIComponent(url);
        }
    },
    valueToText: function (value, array, defaultText) {
        var text = defaultText == undefined ? value : defaultText;
        for(let el of array){
            if(el["value"]!=undefined&&el["value"]===value){
                text=el["text"];
                break;
            }
        }
        return text;
    },
    expandAndToString: function (array, separator) {
        var result = "";
        if (!separator) {
            separator = ",";
        }
        for (let el of array) {
            result += el.toString() + separator;
        }
        return result.substring(0, result.length - separator.length);
    },
    timeFormat: function (time, formatStr) {
        if(time==null)return "";
        if(typeof(time)==="string"){
            time=new Date(time);
        }
        if (!(time instanceof Date)) {
            return time;
        }
        if (!Date.prototype.format) {
            Date.prototype.format = function (format) {
                var o = {
                    "M+": this.getMonth() + 1, //month
                    "d+": this.getDate(), //day
                    "h+": this.getHours(), //hour
                    "m+": this.getMinutes(), //minute
                    "s+": this.getSeconds(), //second
                    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
                    "S": this.getMilliseconds() //millisecond
                }
                if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
                    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o) if (new RegExp("(" + k + ")").test(format))
                    format = format.replace(RegExp.$1,
                        RegExp.$1.length == 1 ? o[k] :
                            ("00" + o[k]).substr(("" + o[k]).length));
                return format;
            }
        }
        return time.format(formatStr);
    },
    randomString: function (randomFlag, min, max) {
        var str = "",
            range = min,
            arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        // 随机产生
        if (randomFlag) {
            range = Math.round(Math.random() * (max - min)) + min;
        }
        for (var i = 0; i < range; i++) {
            let pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
        }
        return str;
    },
    deepClone:function (obj) {
        var cloneObject ={};
        for (var key in obj){
            if(obj.hasOwnProperty(key)) {
                cloneObject[key] = obj[key];
            }
        }
        return cloneObject;
    }
};

const BodeStore={
    set: function (key, value) {
        localStorage.setItem(key, value);
    },
    get: function (key) {
        var val = localStorage.getItem(key);
        return val;
    },
    remove: function (key) {
        localStorage.removeItem(key)
    },
    clear: function () {
        localStorage.clear()
    }
};

const BodeAuth={
    login: function (token) {
        BodeStore.set("AuthToken", token);
    },
    getToken:function () {
        return BodeStore.get("AuthToken");
    },
    isAuth: function () {
        var token = BodeStore.get("AuthToken");
        return typeof (token) !== "undefined" && token != null && token.length > 0;
    },
    clearToken:function () {
        BodeStore.remove("AuthToken");
    }
};

export {BodeTools,BodeAuth,BodeStore};
