$(document).ready(function () {
    var Request = new UrlSearch(); //实例化
    var oid = Request.oid;
    var aftersales_id = Request.aftersales_id
//    获取单个售后的信息


    var settings = {
        "async": true,
        "crossDomain": true,
        "url":getJson + afterSales +"/"+aftersales_id ,
        "method": "GET",
        "headers": {
            "authorization": basetoken
        },
        "data": {
            "uid":uid
        }
    }

    $.ajax(settings).done(function (response) {
        $('.service-subimg img').attr("src",response.data.item_thumb);
        $('.service-subinfo p span').html("￥"+response.data.item_price);
        $('.service-subinfo p i').html("x"+response.data.item_num);
        $('.service-subinfo h2').html(response.data.item_title);
        $('#item_num').val(response.data.item_num);
        $('#item_price').val(response.data.item_price);

    });



    $(".service-subtype a").on('click',function(){
        $(this).addClass("on").siblings().removeClass("on");
    });
//  提交售后列表接口
    $('.sub-btn a').on('click',function(){

        if(! $(".service-subtype a").hasClass("on")){
            alert("请选择服务类型");
            return false;

        };

        if ($('.shop-checkdef input').prop('checked')){
            alert("请选择退货原因");
            return false;
        };
        var aftersales_type = $(".service-subtype a.on").html();
        if(aftersales_type=="退货"){
            aftersales_type = "2"
        }else {
            aftersales_type = "1"
        }


        var reason = $('.shop-checkdef input:checked').siblings('em').text();




        var reship_price =  $('#item_num').val() *  $('#item_price').val();
        var settings = {
            "async": true,
            "crossDomain": true,
            "url":getJson + afterSales  ,
            "method": "POST",
            "headers": {
                "authorization": basetoken
            },
            "data": {
                "oid":oid,
                "reship_num":$('#item_num').val(),
                "reship_price":reship_price,
                "reason":reason,
                "remark":$('#subarea').val(),
                "evidence_pic":"",
                "aftersales_type":aftersales_type
            }
        }
        console.log(settings)
        $.ajax(settings).done(function (response) {
             alert(response.message);
            history.back();
        });
    });




});