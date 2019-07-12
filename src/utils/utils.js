/**
 * Generate multiple entrys
 * @param {String} params 跳转参数
 * @param {String} pathWithoutSuffix 跳转目标
 */
import { Utils } from "weex-ui";
import api from './api';
import { envelopment } from './config';
import wx from 'weixin-js-sdk';

//初始化 执行
export async function Init() {
    var url = decodeURI(window.location.search);
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            localStorage.setItem(strs[i].split("=")[0], decodeURI(strs[i].split("=")[1]));
        }
    }

    var REDIRECT_URI = window.location.href.replace(window.location.search, '');
    var loginCookie = getCookie("loginCookie");

    if (theRequest.hasOwnProperty("code")) {
        // 调登录 接口、换回userId openId  存储
        console.log(theRequest)
        const result = await api.weChatRegisterOrLogin({
            code: theRequest.code
        });
        console.log(result)
        if (result.code == 0) {
            localStorage.setItem("token", result.data.token);
            localStorage.setItem("openId", result.data.openId);
            localStorage.setItem("unionId", result.data.unionId);
            localStorage.setItem("nickname", result.data.nickName);
            localStorage.setItem("head", result.data.Head);
            localStorage.setItem("userId", result.data.userId);
            setCookie('loginCookie', '1', 3);
        } else if (localStorage.getItem("openId") == null) {
            localStorage.removeItem("token");
            localStorage.removeItem("openId");
            localStorage.removeItem("unionId");
            localStorage.removeItem("nickname");
            localStorage.removeItem("head");
            localStorage.removeItem("userId");
            setCookie('loginCookie', '0', 3);
            window.location.href = REDIRECT_URI;
        }
    } else {
        //没有code 的情况 分loginCookie ==> '1'登录/‘0’未登录
        if (loginCookie == "1") {
            //'1'登录 刷新cookies 有效时间
            setCookie('loginCookie', '1', 3);
        } else {

            //测试环境 
            if (envelopment == "dev") {
                setCookie('loginCookie', '1', 3);
            } else {
                //线上环境
                setCookie('loginCookie', '0', 3);
                localStorage.removeItem("token");
                localStorage.removeItem("openId");
                localStorage.removeItem("unionId");
                localStorage.removeItem("nickname");
                localStorage.removeItem("head");
                localStorage.removeItem("userId");
                window.location = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4aa8fb90f0f21ee3&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
            }
        }
    }
};
// 随机产生 字符串
/*
**p{type}  默认产生数字字母集合 长度为6位
**p{min}  默认产生数字字母集合 最小长度 6
**p{max}  默认产生数字字母集合 最大长度 5
** randomLength 产生区间中的 任意长度 随机字母数字组合 false
** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位32
*/
export function randomString(p) {
    var o = {
        randomLength: false,
        type: 'default',
        min: 6,
        max: 6
    };
    if (p) { Object.assign(o, p); };
    var str = "",
        range = o.min,
        number = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        arr = [];
    switch (o.type) {

        case "number":
            arr = number;
            break;
        case "letter":
            arr = letter;
            break;
        default:
            arr = number;
            arr = arr.concat(letter);
            break;

    }
    // 随机产生
    if (o.randomLength) {
        range = Math.round(Math.random() * (o.max - o.min)) + o.min;
    }
    for (var i = 0; i < range; i++) {
        var pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}

//设置分享按扭
export async function setWxShare(shareConfig) {


    var defaultData = {
        title: "我易家好物商城",
        desc: '价优质高，尽在我易家好物商城！',
        imgUrl: 'https://m.woyihome.com/images/wx/wxLogo.png',
        params: null
    }
    if (shareConfig) {
        await Object.assign(defaultData, shareConfig);
    }
    var REDIRECT_URI = window.location.href.split('#')[0];
    const result = await api.weChatShare({
        url: REDIRECT_URI
    });
    //参数转化 拼接
    let encodeURIStr = "";
    if (defaultData.params !== null) {
        var target = defaultData.params;
        if (REDIRECT_URI.indexOf('?') > -1) {
            encodeURIStr += '&' + toParams(target);
        } else {
            encodeURIStr += '?' + toParams(target);
        }
    }

    wx.config({
        debug: false,// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: result.AppID + '',// 必填，公众号的唯一标识
        timestamp: result.timestamp,// 必填，生成签名的时间戳
        nonceStr: result.nonceStr + '',// 必填，生成签名的随机串
        signature: result.signature + '',// 必填，签名，
        jsApiList: [
            // 所有要调用的 API 都要加到这个列表中
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'hideMenuItems']
    });
    REDIRECT_URI = REDIRECT_URI + encodeURIStr;
    wx.ready(function () {
        wx.hideMenuItems({
            menuList: [
                "menuItem:share:qq",
                "menuItem:share:weiboApp",
                "menuItem:favorite",
                "menuItem:share:facebook",
                "menuItem:share:QZone",
                "menuItem:editTag",
                "menuItem:delete",
                "menuItem:originPage",
                "menuItem:readMode",
                "menuItem:openWithQQBrowser",
                "menuItem:openWithSafari",
                "menuItem:share:email",
                "menuItem:share:brand"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        });
        // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
        wx.onMenuShareAppMessage({
            title: defaultData.title, // 分享标题
            desc: defaultData.desc, // 分享描述
            link: `${REDIRECT_URI}`,//分享点击之后的链接
            imgUrl: defaultData.imgUrl, // 分享图标
            success: function () {
                //成功之后的回调
                alert('分享成功')
            }
        });
        // 获取“分享朋友圈”按钮点击状态及自定义分享内容接口
        wx.onMenuShareTimeline({
            title: defaultData.title, // 分享标题
            desc: defaultData.desc, // 分享描述
            link: `${REDIRECT_URI}`,//分享点击之后的链接
            imgUrl: defaultData.imgUrl, // 分享图标
            success: function () {
                alert('分享成功')
            },
            cancel: function () {
                alert('取消成功')
            }
        });
    })

}

//设置 setCookie 
export function setCookie(cname, cvalue, mins) {
    var d = new Date();
    d.setTime(d.getTime() + (mins * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
//获取 getCookie
export function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
// 跳转方法
export function GetURL_tu(pathWithoutSuffix, params) {
    var path = '';
    let platform = weex.config.env.platform;
    let bundleUrl = weex.config.bundleUrl;
    var exp = new RegExp(".+/");
    var baseUrl = exp.exec(bundleUrl);
    path = baseUrl;
    if (platform.toLowerCase() === 'web') {
        path += pathWithoutSuffix + '.html'
    }
    else {
        path += pathWithoutSuffix + '.js'
    }
    if (params) {
        if (Utils.env.isWeb()) {
            for (const name in params) {
                if (typeof params[name] != 'function') {
                    localStorage.setItem(name, params[name]);
                }
            }
        } else {
            path += '?' + toParams(params);
        }
    }
    return path;
};
// encodeURI 对象 转成 encodeURI 字符串
export function toParams(obj) {
    var param = ""
    for (const name in obj) {
        if (typeof obj[name] != 'function') {
            param += "&" + name + "=" + encodeURI(obj[name])
        }
    }
    return param.substring(1);
};
// 获取参数
export function getUrlParam(name) {
    if (Utils.env.isWeb()) {
        var data = localStorage.getItem(name);
        return data;
    } else {
        var url = decodeURI(weex.config.bundleUrl); //取得整个地址栏
        var result = url.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result == null || result === undefined) {
            console.warn('警告:\n--- start :\n' + name + ' 值为 ' + result + '\n--- end \n\n');
        } else {
            return result[1];
        }
    }
};

// 获取参数
export function getUrlParam_v2(name) {

    var url = decodeURI(weex.config.bundleUrl); //取得整个地址栏
    var result = url.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result === undefined) {
        console.warn('警告:\n--- start :\n' + name + ' 值为 ' + result + '\n--- end \n\n');
    } else {
        return result[1];
    }
};
// 订单 state 换取 文字信息
export function StateToMessage_order_info(e) {
    let exchangeMessage = '';
    switch (e) {
        case 0:
            exchangeMessage = '待付款';
            // exchangeMessage='订单创建';
            break;
        case 1:
            exchangeMessage = '待付款';
            break;
        case 2:
            exchangeMessage = '待发货';
            break;
        case 3:
            exchangeMessage = '待收货';
            break;
        case 4:
            exchangeMessage = '待评价';
            break;
        case 5:
            exchangeMessage = '已评价';
            break;
        case 6:
            exchangeMessage = '交易完成';
            break;
        case 8:
            exchangeMessage = '交易关闭';
            break;
    }
    return exchangeMessage;
};
// 物流状态 state 换取 文字信息 '退货状态1退货退款申请，6等待买家发货，7等待卖家收货,2退货退款完成，0正常，3退款中，4退款完成，5驳回，8申请换货，9换货-卖家同意换货，10换货-商家发货，11换货完成，12确认收货',
export function expressExchange(e) {
    let exchangeMessage = '';
    switch (e) {
        case 0:
            exchangeMessage = '已发货';
            // exchangeMessage='订单创建';
            break;
        case 1:
            exchangeMessage = '退货状态';
            break;
        case 2:
            exchangeMessage = '退货退款完成';
            break;
        case 3:
            exchangeMessage = '退款中';
            break;
        case 4:
            exchangeMessage = '待评价';
            break;
        case 5:
            exchangeMessage = '驳回';
            break;
        case 6:
            exchangeMessage = '等待买家发货';
            break;
        case 7:
            exchangeMessage = '等待卖家收货';
            break;
        case 8:
            exchangeMessage = '申请换货';
            break;
        case 9:
            exchangeMessage = '换货-卖家同意换货';
            break;
        case 10:
            exchangeMessage = '申请换货';
            break;
        case 11:
            exchangeMessage = '换货完成';
            break;
        case 12:
            exchangeMessage = '确认收货';
            break;
    }
    return exchangeMessage;
};
// orderItem state 换取 文字信息 '退货状态1退货退款申请，6等待买家发货，7等待卖家收货,2退货退款完成，0正常，3退款中，4退款完成，5驳回，8申请换货，9换货-卖家同意换货，10换货-商家发货，11换货完成，12确认收货',
//  1 2 3 6 7 8 9 10
export function orderItemState(e) {
    let exchangeMessage = '';
    switch (e) {
        case 0:
            exchangeMessage = '正常';
            break;
        case 1:
            // 
            exchangeMessage = '退款中';
            break;
        case 2:
            // 
            exchangeMessage = '退款完成';
            break;
        case 3:
            // 
            exchangeMessage = '退款中';
            break;
        case 4:
            exchangeMessage = '待评价';
            break;
        case 5:
            exchangeMessage = '驳回';
            break;
        case 6:
            // 
            exchangeMessage = '换货中';
            break;
        case 7:
            // 
            exchangeMessage = '换货中';
            break;
        case 8:
            //
            exchangeMessage = '换货中';
            break;
        case 9:
            // 
            exchangeMessage = '换货中';
            break;
        case 10:
            //  
            exchangeMessage = '换货中';
            break;
        case 11:

            exchangeMessage = '换货完成';
            break;
        case 12:
            exchangeMessage = '确认收货';
            break;
    }
    return exchangeMessage;
};
// 订单 state 换取 图片信息
export function StateToMessageImg(e) {
    let url = '';
    switch (e) {
        case 0:
            // exchangeMessage='待付款';
            url = 'https://shopactive.woyihome.com/image/shopImage/006.png';
            break;
        case 1:
            // exchangeMessage = '待付款';
            url = 'https://shopactive.woyihome.com/image/shopImage/007.png';
            break;
        case 2:
            // exchangeMessage = '待发货';
            url = 'https://shopactive.woyihome.com/image/shopImage/007.png';
            break;
        case 3:
            // exchangeMessage = '待收货';
            url = 'https://shopactive.woyihome.com/image/shopImage/009.png';
            break;
        case 4:
            // exchangeMessage = '待评价';
            url = 'https://shopactive.woyihome.com/image/shopImage/008.png';
            break;
        case 5:
            // exchangeMessage = '已评价';
            url = 'https://shopactive.woyihome.com/image/shopImage/008.png';
            break;
        case 6:
            // exchangeMessage = '交易完成';
            url = 'https://shopactive.woyihome.com/image/shopImage/008.png';
            break;
        case 8:
            // exchangeMessage = '交易关闭';
            url = 'https://shopactive.woyihome.com/image/shopImage/010.png';
            break;
    }
    return url;
};
//时间戳转日期
export function formatTime(number, format) {
    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];
    var date = new Date(number * 1000);
    returnArr.push(date.getFullYear());
    returnArr.push(formatNumber(date.getMonth() + 1));
    returnArr.push(formatNumber(date.getDate()));
    returnArr.push(formatNumber(date.getHours()));
    returnArr.push(formatNumber(date.getMinutes()));
    returnArr.push(formatNumber(date.getSeconds()));
    for (var i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
};
//日期转时间戳  
export function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n
};
//手机号校验    
export function checkMobile(str) {
    var re = /^1\d{10}$/
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
};


//埋点数据统计

export async function statistical(pageName, onEventFnName) {
    if (typeof window!=="undefined") {
        window.TDAPP.onEvent(pageName, onEventFnName); 
    }
}



export default {
    Init,
    formatTime,
    formatNumber,
    getUrlParam,
    GetURL_tu,
    checkMobile,
    orderItemState,
    StateToMessageImg,
    setWxShare,
    randomString,
    StateToMessage_order_info
};