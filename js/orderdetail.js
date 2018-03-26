$(document).ready(function () {
//获取地址栏上面的code tid
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
                this[name] = value;
            }
        }
    }

    var Request = new UrlSearch(); //实例化
    var id = Request.tid;

    var settings = {
        "async": false,
        "crossDomain": true,
        "url":getJson + logistics ,
        "method": "GET",
        "headers": {
            "authorization": basetoken
        },
        "data": {
            "tid":id
//            },error:function(XMLHttpRequest, textStatus, errorThrown){
//                alert('账号信息错误');
//                window.location.href="login.html";
//                return false;
        }
    }
    console.log(settings);
    $.ajax(settings).done(function (response) {

        $('.info_Name dd').html(response.data[0].logi_name);
        $('.info_No dd').html(response.data[0].logi_no);
        var item = "";
        $(response.data[0].traces).each(function (n, vale) {
           item += ' <li>'
            item += ' <p>'+vale.station+'</p>'
            item += ' <span>'+vale.time+'</span>'
            item += ' <i></i>'
            item +=' </li>'

        });
            $('.detail ul').append(item);
    });


});