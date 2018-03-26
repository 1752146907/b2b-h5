// 接口地址
var getJson = "http://api.b2b-purchase.dingxingyun.cn/v1/";
var icoUrl ="http://storage.b2b-purchase.dingxingyun.cn/";
var baseUrl = "http://wap.b2b-purchase.dingxingyun.cn/";

//  var getJson="http://api.b2b.com/v1/"
var imgUrl ="http://storage.b2b-purchase.dingxingyun.cn/image/";

//   获取商品分类接口地址
var getShopList = "apicategory/categories";

var getChildrenCategorys = "apicategory/categories/get-children";

//   获取浏览商品列表
var getHistory = "sysmember/member-browse-histories";

//   新增商品浏览记录
var addhistories = "sysmember/member-browse-histories";

//   获取主商品接口地址
var getShopItem = "apiitem/item-members";

// 会员注册
var register = "users/regmembercreate";

// 会员短信
var usermsg = "users/regmembermsg";

// 会员登录
var userlogin = "users/login";

//获取会员收藏列表
var getCollect = "sysmember/member-favs";

//商品详情页面接口地址
var shopInfo = "apiitem/item-members/";

// 购物车
var carts = "apitrade/carts";

//地址接口
var findAddress ="sysmember/member-addresses";

//金额运费
var getPrice ="apitrade/trade-members/fee";

//下单接口
var getTrade ="apitrade/trade-members";

// 支付方式列表接口
var getPay = "sysectools/pays/getlist";

//收货地址列表
var address = "sysmember/member-addresses";


// 查询订单接口
var findOrder ="apitrade/trade-members";

// 提交订单支付接口
var finddopay = "sysectools/pays/dopay";

//购物车数量
var getNum ="apitrade/carts/itemnums";

//地区
var state = 'sysmember/member-addresses/region';

//发票
var invoice = 'sysmember/member-invoices';

// 忘记密码
var forgot ="users/forget-password";

// 查询店铺信息
var getShop ="apishop/shop-infos";

// 会员信息
var loginMem =  "users";

// 会员信息
var members =  "sysmember/members";

// 获取图形验证码
var imgCode ="common/captchas/generate"


// 支付密码设置
var getPass =  "apiaccount/passwords"

// 物流信息
var logistics= "common/logistics"


// 确定收货
var getSign = "apitrade/trade-members/sign";

//售后接口
var afterSales = "apiaftersales/aftersales-mems"

// 物流信息
var sendback = "apiaftersales/aftersales-mems/sendback"

// 获取openid
var getOpenIdApi = 'apitrustlogin/trustlogins/getopenid';

// 获取code
var getCodeUrlApi = 'apitrustlogin/trustlogins/getcodeurl';
// ad
var getAd = 'apiad/carousels';

// 获取APP注册邀请
var getShare = 'apishop/invites';
//token
var token = sessionStorage.getItem("token") + ":";
//console.log('Basic ' + $.base64.encode(token));
var basetoken = 'Basic ' + $.base64.encode(token);
//var shop_id = sessionStorage.getItem("shop_id");
var uid = sessionStorage.getItem("uid");
var  mobile = sessionStorage.getItem("mobile");


var sku_id = sessionStorage.getItem("skuid");

//时间戳
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function UrlSearch() {
    var name, value;
    var str = location.href; //取得整个地址栏
    var num = str.indexOf("?")
    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
    var arr = str.split("&"); //各个参数放到数组里
    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            this[name] = decodeURI(value);
        }
    }
}

//浏览器判断
function isWeiXin(){
   var ua = window.navigator.userAgent.toLowerCase();
   if(ua.match(/MicroMessenger/i) === 'micromessenger'){
      return true;
   }else{
      return false;
   }
}

//判断地址栏shop_id是否存在，如不存在就去本地存储的shop_id
function  getShopId() {
    var queryUrl = new UrlSearch(); //实例化
    var shop_id = queryUrl.shop_id;
    if (shop_id === 'null' || shop_id === 'undefined' || shop_id === '' ||  !shop_id) {
        shop_id = sessionStorage.getItem('shop_id');
    } else {
        sessionStorage.setItem("shop_id", shop_id);
    }
    return shop_id;
}
var shop_id = getShopId();

/*
 用户id判断
 如果不存在，返回return
 */
function useId() {
    if (!uid) {
        window.location.href = "login.html";
    }
}