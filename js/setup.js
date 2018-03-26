$(document).ready(function () {

 $('.tcBtn').on('click',function(){
     sessionStorage.clear("token");
     sessionStorage.setItem("shop_id", shop_id);
    $(this).attr('href','login.html')
 });

    // 是否有支付密码
    var settings = {
        "async": true,
        "crossDomain": true,
        "url":getJson + getPass ,
        "method": "GET",
        "headers": {
            "authorization": basetoken
        },
        "data": {

        }
    }

    $.ajax(settings).done(function (response) {
        if(response.code==0){
            $('.setPass em').html('修改支付密码')
        }else {
            $('.setPass em').html('设置支付密码')
        }

    });

});