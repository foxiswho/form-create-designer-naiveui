
export function GetRequest(value) {
    //url例子：www.baidu.com?id="123456"&name="www"；
    var url = decodeURI(window.location.search); //?id="123456"&name="www";
    var object = {};
    if (url.indexOf("?") !== -1)//url中存在问号，也就说有参数。
    {
        var str = url.substr(1);  //得到?后面的字符串
        var strs = str.split("&");  //将得到的参数分隔成数组[id="123456",name="www"];
        for (var i = 0; i < strs.length; i++) {
            object[strs[i].split("=")[0]] = strs[i].split("=")[1];//得到{id:'123456',name:'www'}
        }
    }
    if (!value){
        return object
    }
    return object[value];
}