$(document).ready(function () {
    //获取地址栏上面的name
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
    var name = decodeURI(Request.name);

     if( name == null || name == "" || name =="null") {

     }else {
         $('.nameChange input').val(name);
     }
    $('.sureBtn').on('click',function(){
        var nickname = $('.nameChange input').val();
        if(nickname=="" ) {
            alert("请填写个人昵称");
            return false
        }
        var settings = {
            "async": true,
            "crossDomain": true,
            "url":getJson + members+"/"+uid ,
            "method": "PATCH",
            "headers": {
                "authorization": basetoken
            },
            "data": {
                nickname :nickname
            }
        }
        $.ajax(settings).done(function (response) {

            console.log(response);
           if(response.code==0) {
               location.href = "personal.html";
           }

        });
    })






});