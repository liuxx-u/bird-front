import store from 'store';

const tokenKey="sso.token";

let util= {
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
    equal: function (a, b) {
      return JSON.stringify(a) == JSON.stringify(b);
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
    add: function (a, b) {
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
      if(typeof (str) !== "string"){
        return str;
      }
      if (typeof(postfix) === "undefined") {
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
    isEmpty:function(str) {
      if (typeof (str) === "undefined") return true;
      if (str.replace(/(^s*)|(s*$)/g, "").length === 0) return true;
      return false;
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
      {
        const o = {
          'M+': date.getMonth() + 1,
          'd+': date.getDate(),
          'h+': date.getHours(),
          'H+': date.getHours(),
          'm+': date.getMinutes(),
          's+': date.getSeconds(),
          'q+': Math.floor((date.getMonth() + 3) / 3),
          S: date.getMilliseconds(),
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
      var span = span || 120;//默认缓存两小时

      var now = new Date();
      var expire = new Date((now / 1000 + span * 60) * 1000);
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
  auth:{
    getToken:function () {
      return util.store.get(tokenKey);
    },
    setToken:function (token) {
      util.store.set(tokenKey,token)
    },
    removeToken:function () {
      util.store.remove(tokenKey);
    }
  }
}

export default util;
