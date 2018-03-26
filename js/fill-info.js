$(document).ready(function () {

    var Request = new UrlSearch(); //实例化
    var aftersales_bn = Request.aftersales_bn


    $('.fill-infobtn a').on('click',function(){
       if($('.fill_about').val()=="") {
           alert("请输入物流公司");
           return false;
       }
        if($('.fill_dh').val()=="") {
            alert("请输入物流单号");
            return false;
        }
        if($('.fill_tel').val()=="") {
            alert("请输入收货手机号");
            return false;
        }
        if($('.fill_adr').val()=="") {
            alert("请输入收货地址");
            return false;
        }
        var settings = {
            "async": true,
            "crossDomain": true,
            "url":getJson + sendback ,
            "method": "POST",
            "headers": {
                "authorization": basetoken
            },
            "data": {
                "aftersales_bn":aftersales_bn,
                "logi_name":$('.fill_about').val(),
                "logi_no":$('.fill_dh').val(),
                "corp_code":'',
                "mobile":$('.fill_tel').val(),
                "receiver_address":$('.fill_adr').val()
            }
        }

        $.ajax(settings).done(function (response) {

                alert(response.message);
                history.back();

        });
    });










});