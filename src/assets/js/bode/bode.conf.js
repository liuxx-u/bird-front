
const ServerHost='http://localhost:61759/';
const ApiPrefix=ServerHost+"api/services/";
const UrlConf={
    //登录
    login: ServerHost + "api/Account/Authenticate",

    //获取菜单
    getUserNavigations:ApiPrefix+'zero/user/GetUserNavigations'
};

export {ServerHost,ApiPrefix,UrlConf};
