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
    var sex = Request.sex;
    $('.sexMain ul li').removeClass("choose");
    $('.sexMain ul li[value='+sex+']').addClass("choose");
    $('.sexMain ul li').on('click', function(e){
        $(this).addClass("choose").siblings().removeClass("choose");
    });
    $('.sureBtn').on('click',function(){
        var sex = $('.sexMain ul li.choose').val();

        var settings = {
            "async": true,
            "crossDomain": true,
            "url":getJson + members+"/"+uid ,
            "method": "PATCH",
            "headers": {
                "authorization": basetoken
            },
            "data": {
                sex :sex
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