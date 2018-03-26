$(document).ready(function () {

    //存储当前url 
    sessionStorage.setItem('order_confirm_url', window.location.href);

    var address_obj = sessionStorage.getItem('address_obj');
    if (address_obj) {
        var address_obj=JSON.parse(address_obj); //获取sessonStorage中的地址
    }
    
    var Request = new UrlSearch(); //实例化
    var item_id = Request.item_id;
    var sku_id = Request.sku_id;
    var shopItem = Request.shopItem;
    var items = shopItem.split("|");

    //判断支付密码
    function  getPassword() {

        if ( $('.shopSubm input:checked').attr('id')=="deposit") {

            // 是否有支付密码
            var settings = {
                "async": true,
                "crossDomain": true,
                "url":getJson + getPass ,
                "method": "GET",
                "headers": {
                    "authorization": basetoken
                }
            }
            $.ajax(settings).done(function (response) {
                if(response.code==0){
                    $(".shop_payPass").show();
                }else {
                    alert("请设置支付密码");
                    document.location.href="changepay.html?value=1"
                }
            });
        } else {
            $(".shop_payPass").hide();
        }

    }
    // 判断是否有支付密码
    var settings = {
        "async": true,
        "crossDomain": true,
        "url":getJson + getPass ,
        "method": "GET",
        "headers": {
            "authorization": basetoken
        }
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
    var isinvoice = 0;
    var invoice_type = 2;
    var invoice_name = '';
    var invoice_content = '';
    var taxpayer = '';
    var taxpayer_id = '';
    var taxpayer_bank = '';
    var taxpayer_account = '';
    var taxpayer_call = '';
    var taxpayer_addr = '';
    console.log(sessionStorage.getItem('invoice_name'));

    //获取发票信息
    switch (parseInt(sessionStorage.getItem('invoice-info'))){
        case 0:
            $('.invoice-state').html('普通发票');
            isinvoice = 1;
            invoice_type = 2;
            invoice_name = sessionStorage.getItem('invoice_name');
            invoice_content = sessionStorage.getItem('invoice_content');
            break;
        case 1:
            $('.invoice-state').html('增值税发票');
            isinvoice = 1;
            invoice_type = 3;
            taxpayer = sessionStorage.getItem('taxpayer');
            taxpayer_id = sessionStorage.getItem('taxpayer_id');
            taxpayer_bank = sessionStorage.getItem('taxpayer_bank');
            taxpayer_account = sessionStorage.getItem('taxpayer_account');
            taxpayer_call = sessionStorage.getItem('taxpayer_call');
            taxpayer_addr = sessionStorage.getItem('taxpayer_addr');
            break;
        case 2:
            $('.invoice-state').html('不需要发票');
            isinvoice = 0;
            break;
    }


//    弹出支付方式
   function shopSubox(){
        $(".am-share").addClass("am-modal-active");
        if($(".sharebg").length>0){
            $(".sharebg").addClass("sharebg-active");
        }else{
            $("body").append('<div class="sharebg"></div>');
            $(".sharebg").addClass("sharebg-active");
        }
        $(".sharebg-active,.share_btn").click(function(){
            $(".am-share").removeClass("am-modal-active");
            setTimeout(function(){
                $(".sharebg-active").removeClass("sharebg-active");
                $(".sharebg").remove();
            },300);
            window.location.href="my.html";
        });
   };

// 获取地址
    var settings = {
        "async": false,
        "crossDomain": true,
        "url":getJson + address ,
        "method": "GET",
        "headers": {
            "authorization": basetoken
        },
        "data": {
            "is_default": 1
        }
    }
    $.ajax(settings).done(function (response) {
        $('.shop-address-no').hide();
        $('.shop-address').hide();
        if(response.data == null) {
            $('.shop-address').show();
            $('.shop-address-no').show();
        }else {
            $('.shop-address').show();
            if (address_obj) {
                $('.shop-submitname').html(address_obj.name)
                $('.addressShop').html(address_obj.addressShop)
                $('#address_id').val(address_obj.addr_id)
                //sessionStorage.address_obj=null;
            }else{
                $('.shop-submitname em').text(response.data.name);
                $('.shop-submitname span').text(response.data.tel)
                $('#address_id').val(response.data.addr_id);
                $('.addressShop').text(response.data.state+response.data.city+response.data.town+response.data.address);
            }
            $('#region_id').val(response.data.region_id);
        }
    });
    var region= $("#region_id").val();
    var str='{"region":"'+region+'","trade_order":[';
    var item='[';
    $.each(items,function(index,obj){
        var arr=obj.split(",");
        str+='{"shop_id":'+arr[0]+',"item_id":'+arr[3]+',"sku_id":'+arr[1]+',"num":'+arr[2]+'},';
        item+='{"shop_id":'+arr[0]+',"item_id":'+arr[3]+',"sku_id":'+arr[1]+',"num":'+arr[2]+'},';
    });
    item = item.substring(0,item.length-1);
    str =str.substring(0,str.length-1);
    str+=']}';
    item+=']';

//    获取支付方式
    var settings = {
        "async": true,
        "crossDomain": true,
        "url":getJson + getPay ,
        "method": "GET",
        "headers": {
            "authorization": basetoken
        },
        "data":{
            'platform':'wap'
        }
    }
    var payList ="";

    $.ajax(settings).done(function (response) {
        $(response.data.paymethod_list).each(function (n, vale) {
            var isChecked ="";
            if(vale.is_default == "true" ){
                isChecked = "checked"
            }else {
                isChecked = ""
            }
            console.log(vale)
            payList+="<label class='clearfix'>"
            payList+=" <span><img src='"+icoUrl+vale.app_icon+"'>"+vale.app_name+"</span>"
            payList += "  <input class='pay_radio' name='pay' type='radio'" + isChecked + " id='" + vale.app_id + "'>"
            payList+="  <i></i>"
            payList+="   </label>"

        });
         $('.shopSubm').append(payList);

        //微信浏览器屏蔽支付宝，其他外部浏览器屏蔽微信支付
        if (isWeiXin()) {
            $('#wapalipay').parent('.clearfix').remove();
        } else {
            $('#wapweixin').parent('.clearfix').hide();
        }

        $(".shopSubm input").on('click', function (){
            getPassword();
        });
    });


    //获取商品sku信息
    $.ajax({
        type: "get",
        url: getJson + getShopItem + '/skuinfo',
        "data":{
            'shop_id':shop_id,
            'sku_id':sku_id
        },
        dataType: "json",
          success:function(data){
            console.log(data);
            $(".shop-name").text(data.data.shop.shop_name);
            var items ="";
            $(data.data).each(function (n, vale) {
              items += "<li>" +
                "<div class=shop-info>" +
                    "<img src='"+imgUrl+vale.image_thumb+"?w=750'>" +
                    "<div class=shop-title>" + vale.title + "</div>" +
                "</div>" +
                "</li>"
            });
            $('.shop-submitli ul').append(items);
        }
    });


    //获取合计金额
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": getJson + getPrice,
        "method": "POST",
        "headers": {
            "authorization": basetoken
        },
        "data": {
            "params": str
        }
    }

    $.ajax(settings).done(function (response) {
        //console.log(response)
        $('.shop-subiteminfo p span').text("¥"+response.data.total_fee);
        $('.shop-subiteminfo p em').text("¥"+response.data.post_fee);
        $('.shop-subtotalinfo i').text("¥"+response.data.total_fee);
        $('#total_fee').val(response.data.total_fee);
    });


    //点击确定
    $('.shop-subbtn').on('click', function (){

        var address_id = $('#address_id').val();
        if(address_id == "" || address_id == null){
            alert('请填写收货人地址');
            return false
        }else {
        invoice_name = invoice_name?invoice_name:taxpayer;
        console.log(invoice_name);
        var settings = {
            "async": false,
            "crossDomain": true,
            "url": getJson + getTrade,
            "method": "POST",
            "headers": {
                "authorization": basetoken
            },
            "data": {
                "address_id": $('#address_id').val(),
                "pay_type":"online",
                "shopping_type":"express",
                "is_need_invoice":isinvoice,
                "invoice_type":invoice_type,
                "invoice_name":invoice_name,
                "invoice_content":invoice_content,
                "taxpayer":taxpayer,
                "taxpayer_id":taxpayer_id,
                "taxpayer_bank":taxpayer_bank,
                "taxpayer_account":taxpayer_account,
                "taxpayer_call":taxpayer_call,
                "taxpayer_addr":taxpayer_addr,
                "items":item,
                "total_fee":$('#total_fee').val(),
                 "message":$('#messageText').val()
            }

        }
        $.ajax(settings).done(function (response) {
            console.log(response)
            $('#payment_bn').val(response.data.payment_bn);
            $('#tid').val(response.data.tids);
              shopSubox();
        });
    };



    $('.shop-submin').on('click',function(){

        //判断是否选中支付方式
        if ($(".pay_radio").is(":checked")) {
        }
        else {
            alert("请勾选您的支付方式");
            return false;
        }

        var app_id = $('.shopSubm input:checked').attr('id');
    if(app_id=="deposit"){
        if($('#shop_payPass').val()==""){
            alert("请填写预支付密码");
            return false;
        }else {
            var pay_pwd = $('#shop_payPass').val()
        }
    }
     var payment_bn = $('#payment_bn').val();
     var tid = $('#tid').val();
        var settings = {
            "async": false,
            "crossDomain": true,
            "url": getJson + finddopay,
            "method": "POST",
            "headers": {
                "authorization": basetoken
            },
            "data": {
                "app_id": app_id,
                "payment_bn":payment_bn,
                "tid":tid,
                "request_method":"form",
                "order_type":"normal",
                "pay_pwd":pay_pwd
            },
            success: function () {
                $(".shop-submin").attr("disabled", true)
            }
        }
        console.log(settings);
        $.ajax(settings).done(function (response) {
            console.log(response);
            if(response.code==0) {
                $('.action').append(response.data.content)
                $(".action form").submit(); 
            }
            else{
                alert(response.message);
            }
        });

    });
    });
});

$(".shop-subbtn").click(function(){
    if($(".clearfix em").html()==""){
        alert("请选择收货地址")
    }
})
