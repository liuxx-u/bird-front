import store from 'store';

const tokenKey = "sso.token";
const userKey = 'bird.curUser';

let util = {
  queryURL: (name) => {
    let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) return decodeURI(r[2])
    return null
  },
  object: {
    deepClone: function (p, c) {
      var c = c ? c : p.constructor === Array ? [] : {};
      for (var i in p) {
        if (typeof p[i] === 'object') {
          if (p[i] == null) {
            c[i] = null;
            continue;
          }
          c[i] = (p[i].constructor === Array) ? [] : {};
          util.object.deepClone(p[i], c[i]);
        } else {
          c[i] = p[i];
        }
      }
      return c;
    },
    split: function (obj) {
      let result = {};
      if (typeof (obj) !== 'object') return obj;

      let getLastNode = function (keys, index) {
        if (keys.length === 1) return result;
        if (index <= 0 || index >= keys.length) return result;

        let node = result;
        for (let i = 0; i < index; i++) {
          if (!node[keys[i]]) {
            node[keys[i]] = {}
          }
          node = node[keys[i]]
        }
        return node;
      }

      for (var key in obj) {
        let arr = key.split(".");
        for (let i = 0, len = arr.length; i < len; i++) {
          if (i == len - 1) {
            let node = getLastNode(arr, i);
            node[arr[i]] = obj[key]
          }
        }
      }
      return result;
    },
    tile: function (obj) {
      let result = {};

      let tileObj = function (o, prefixs) {
        for (var key in o) {
          let value = o[key];
          let joinKeys = util.object.deepClone(prefixs);
          joinKeys.push(key);
          if (typeof (value) === 'object') {
            tileObj(value, joinKeys)
          } else {
            result[joinKeys.join(".")] = value;
          }
        }
      }

      tileObj(obj, []);
      return result;
    },
    equal: function (a, b) {
      return JSON.stringify(a) === JSON.stringify(b);
    }
  },
  number: {
    getDiscount: function (price, originPrice) {
      if (price <= 0 || originPrice <= 0 || price >= originPrice) return "";
      var d = (price / originPrice * 10).toFixed(2);
      while (d[d.length - 1] === "0" || d[d.length - 1] == ".") {
        d = d.substring(0, d.length - 1);
      }
      return d;
    },
    cnCurrency(money) {
      //汉字的数字
      let cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
      //基本单位
      let cnIntRadice = new Array('', '拾', '佰', '仟');
      //对应整数部分扩展单位
      let cnIntUnits = new Array('', '万', '亿', '兆');
      //对应小数部分单位
      let cnDecUnits = new Array('角', '分', '毫', '厘');
      //整数金额时后面跟的字符
      let cnInteger = '整';
      //整型完以后的单位
      let cnIntLast = '元';
      //最大处理的数字
      let maxNum = 999999999999999.9999;
      //金额整数部分
      let integerNum;
      //金额小数部分
      let decimalNum;
      //输出的中文金额字符串
      let chineseStr = '';
      //分离金额后用的数组，预定义
      let parts;
      if (util.string.isEmpty(money)) { return ''; }
      money = parseFloat(money);
      if (money >= maxNum) {
        //超出最大处理数字
        return '';
      }
      if (money == 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
      }
      //转换为字符串
      money = money.toString();
      if (money.indexOf('.') == -1) {
        integerNum = money;
        decimalNum = '';
      } else {
        parts = money.split('.');
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
      }
      //获取整型部分转换
      if (parseInt(integerNum, 10) > 0) {
        var zeroCount = 0;
        var IntLen = integerNum.length;
        for (var i = 0; i < IntLen; i++) {
          var n = integerNum.substr(i, 1);
          var p = IntLen - i - 1;
          var q = p / 4;
          var m = p % 4;
          if (n == '0') {
            zeroCount++;
          } else {
            if (zeroCount > 0) {
              chineseStr += cnNums[0];
            }
            //归零
            zeroCount = 0;
            chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
          }
          if (m == 0 && zeroCount < 4) {
            chineseStr += cnIntUnits[q];
          }
        }
        chineseStr += cnIntLast;
      }
      //小数部分
      if (decimalNum != '') {
        var decLen = decimalNum.length;
        for (var i = 0; i < decLen; i++) {
          var n = decimalNum.substr(i, 1);
          if (n != '0') {
            chineseStr += cnNums[Number(n)] + cnDecUnits[i];
          }
        }
      }
      if (chineseStr == '') {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
      } else if (decimalNum == '') {
        chineseStr += cnInteger;
      }
      return chineseStr;
    },
    add: function (a, b) {
      a = a || 0; b = b || 0;
      var c, d, e;
      try {
        c = a.toString().split(".")[1].length;
      } catch (f) {
        c = 0;
      }
      try {
        d = b.toString().split(".")[1].length;
      } catch (f) {
        d = 0;
      }
      return e = Math.pow(10, Math.max(c, d)), (util.number.mul(a, e) + util.number.mul(b, e)) / e;
    },
    sub: function (a, b) {
      a = a || 0; b = b || 0;
      var c, d, e;
      try {
        c = a.toString().split(".")[1].length;
      } catch (f) {
        c = 0;
      }
      try {
        d = b.toString().split(".")[1].length;
      } catch (f) {
        d = 0;
      }
      return e = Math.pow(10, Math.max(c, d)), (util.number.mul(a, e) - util.number.mul(b, e)) / e;
    },
    mul: function (a, b) {
      a = a || 0; b = b || 0;
      var c = 0, d = a.toString(), e = b.toString();
      try {
        c += d.split(".")[1].length;
      } catch (f) {
      }
      try {
        c += e.split(".")[1].length;
      } catch (f) {
      }
      return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
    },
    div: function (a, b) {
      a = a || 0; b = b || 0;
      var c, d, e = 0, f = 0;
      try {
        e = a.toString().split(".")[1].length;
      } catch (g) {
      }
      try {
        f = b.toString().split(".")[1].length;
      } catch (g) {
      }
      return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), util.number.mul(c / d, Math.pow(10, f - e));
    }
  },
  string: {
    // 最大显示长度
    truncate: function (str, max, postfix) {
      if (typeof (str) !== "string") {
        return str;
      }
      if (typeof (postfix) === "undefined") {
        postfix = "...";
      }
      if (str.length <= max) return str;
      return str.substring(0, max) + postfix;
    },
    // 连字符转驼峰
    hyphenToHump: function (str) {
      return str.replace(/-(\w)/g, (...args) => {
        return args[1].toUpperCase()
      })
    },
    // 驼峰转连字符
    humpToHyphen: function (str) {
      return str.replace(/([A-Z])/g, '-$1').toLowerCase()
    },
    isEmpty: function (str) {
      if (str == null || str == 'null') return true;
      if (typeof (str) === "undefined") return true;
      str = str + '';
      return (str.replace(/(^\s*)|(\s*$)/g, "").length === 0);
    },
    isMobile: function (phoneNo) {
      var reg = /^1[3|4|5|7|8][0-9]{9}$/;
      return reg.test(phoneNo);
    },
    generateRandom(len) {
      len = len || 32;
      var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
      var maxPos = $chars.length;
      var pwd = '';
      for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    }
  },
  date: {
    format: function (date, format) {
      if (typeof (date) === 'string') {
        date = new Date(Date.parse(date.replace(/-/g, "/")))
      }
      const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'H+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds()
      }
      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length))
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
        }
      }
      return format
    }
  },
  store: {
    get: function (key) {
      var cacheObj = store.get(key);
      if (cacheObj) {
        var now = new Date();

        if (!cacheObj.expire) return null;
        var expireTime = new Date(cacheObj.expire);
        if (expireTime < now) {//超出有效期,移除
          util.store.remove(key);
          return null;
        } else {
          //有效期不足半小时,则刷新
          if (expireTime - now < (30 * 60 * 1000)) {
            cacheObj.expire = new Date((now / 1000 + 120 * 60) * 1000);
            store.set(key, cacheObj)
          }
          return cacheObj.value;
        }
      }
      return null;
    },
    set: function (key, value, span) {
      var sp = span || 120;//默认缓存两小时

      var now = new Date();
      var expire = new Date((now / 1000 + sp * 60) * 1000);
      var cacheObj = {
        expire: expire,
        value: value
      };
      store.set(key, cacheObj);
    },
    remove: function (key) {
      store.remove(key);
    },
    clearAll: function () {
      store.clearAll();
    }
  },
  auth: {
    getToken: function () {
      return util.store.get(tokenKey);
    },
    setToken: function (token) {
      util.store.set(tokenKey, token)
    },
    removeToken: function () {
      util.store.remove(tokenKey);
      util.store.remove(userKey);
    },
    getUser: function () {
      return util.store.get(userKey);
    },
    setUser: function (user) {
      util.store.set(userKey, user);
    },
  }
}

export default util;
