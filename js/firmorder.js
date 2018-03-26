$(document).ready(function () {


    var Request = new UrlSearch(); //实例化
    var item_id = Request.item_id;
    var sku_id = Request.sku_id;
    var id = Request.id;
    var callback_url = Request.callback_url || '';

      $('.require').hide();
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
        });
   };


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
            if (vale.is_default == "true" && vale.app_id == "deposit") {
                // 是否有支付密码
                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": getJson + getPass,
                    "method": "GET",
                    "headers": {
                        "authorization": basetoken
                    }
                }

                $.ajax(settings).done(function (response) {
                    if (response.code == 0) {
                        $(".shop_payPass").show();
                    } else {
                        alert("请设置支付密码");
                        document.location.href = "changepay.html?value=1"
                    }
                });

            } else {
                $(".shop_payPass").hide();
            }
            var isChecked ="";
            if(vale.is_default == "true" ){
                isChecked = "checked";
            }else {
                isChecked = ""
            }
            console.log(vale)
            payList+="<label class='clearfix'>"
            payList += "<span><img src='" + icoUrl + vale.app_icon + "'>" + vale.app_name + "</span>"
            payList += "<input class='pay_radio' name='pay' type='radio'" + isChecked + " id='" + vale.app_id + "'>"
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




//    获取确定订单
    var settings = {
        "async": true,
        "crossDomain": true,
        "url":getJson + findOrder+'/'+id ,
        "method": "GET",
        "headers": {
            "authorization": basetoken
        },
        "data": {
        },
        success:function(data){console.log(data)}
    }
//      console.log(settings)
    $.ajax(settings).done(function (response) {
      console.log(response);
    $('.order_hd em').html(response.data.tid);
//        $('#payment_bn').val(response.data.payment.payment_list[0].payment_bn);

    $('.address_content div h2').html(response.data.receiver_name);
    $('.address_content div h3').html(response.data.receiver_mobile);
    $('.address_content div h4').html(response.data.receiver_address);
        $('.dianpu-pic dl dt').html(response.data.shop_name)
    $('.payment dl dd').html(response.data.pay_type);

      $('.total_fee  dd').html(parseFloat(response.data.total_fee));
        $('.post_fee  dd').html(parseFloat(response.data.post_fee));
        if (response.data.invoice.invoice_name) {
            $('.infoIvn dd').html(response.data.invoice.invoice_name);
        }else {
            $('.infoIvn dd').html("无");
        }
        if (response.data.shipping_type=="") {
            $('.infoType dd').html("快递配送");

        }else {
            $('.infoType dd').html(response.data.shipping_type);
        }
        var stateS=""
        if(response.data.status == "WAIT_BUYER_PAY") {

            stateS= "待支付";
            $('.footBt').hide();
            $('.cancel').hide();
        }
        if (response.data.status == "WAIT_SELLER_SEND_GOODS") {
            stateS= "待发货";
            $('.footBt').hide();
            $('.footer').hide();


        }
        if (response.data.status == "WAIT_BUYER_CONFIRM_GOODS") {
            stateS= "待收货";
            $('.footBot').hide();
            $('.require').show();
            $('.cancel').hide();
        }
        if (response.data.status == "TRADE_BUYER_SIGNED") {
            stateS= "已签收";
            $('.require').show();
            $('.footBot').hide();
            $('.footBt').hide();
            $('.cancel').hide();
        }
        if (response.data.status == "TRADE_FINISHED") {
            stateS= "已完成";
            $('.require').show();
            $('.footBot').hide();
            $('.footBt').hide();
            $('.cancel').hide();
        }
        if (response.data.status == "TRADE_CLOSED") {
            stateS= "已关闭";
            $('.require').show();
            $('.footBot').hide();
            $('.footBt').hide();
            $('.cancel').hide();
        }

        function getLocalTime(nS) {
            return  new Date(parseInt(nS) * 1000).Format("yyyy-MM-dd hh:mm:ss");
        }
            if(response.data.buyer_message==""){
                response.data.buyer_message ="无买家留言"
            } else {
                response.data.buyer_message =response.data.buyer_message
            }
//    console.log(response.data.buyer_message);
        $('.order_time em').html(getLocalTime(response.data.created))
        $('.order_hao a').html(stateS);
        $(".payZf").text('支付');
        $(".paywl").text('确定收货');

        $('.order-tip dd').html(response.data.buyer_message);
        $('.total .price_num').html(parseFloat(response.data.total_fee));
        $('.require a').attr('href','orderdetail.html?id='+id)
        var item = "";
        $(response.data.trade_order).each(function (n, vale) {
             item += "<li><img src='"+imgUrl+vale.pic_path+"'></li>"
        });
            $('.dianpu-pic ul').append(item);

        $('.paywl').on('click',function(){
            var tid = $('.order_hd em').html();
            $('.shop-carshade').show();
            //点击确定收货
            $('.model-btn-yes').on('click', function () {
                var str='{"uid":"'+uid+'","tid":"'+tid+'","oid":""}';
                var settings = {
                    "async": false,
                    "crossDomain": true,
                    "url":getJson + getSign ,
                    "method": "POST",
                    "headers": {
                        "authorization": basetoken
                    },
                    "data": {
                        "params":str
                    }
                }
//                    console.log(settings);
                $.ajax(settings).done(function (response) {
                    console.log(response.message);
                    window.location.reload();
                });
            });

        });
    });
    $('.model-btn-no').on('click', function () {
        $('.shop-carshade').hide();
    });

    $('.payZf').on('click',function(){

        shopSubox();

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
            $(".shop-submin").attr("disabled", true);
            var payment_bn = $('#payment_bn').val();
            var tid = $('.order_hd em').html();
            var settings = {
                "async": false,
                "crossDomain": true,
                "url": getJson + finddopay,
                "method": "POST",
                "headers": {
                    "authorization": basetoken
                },
                data: {
                    "app_id": app_id,
                    "payment_bn":payment_bn,
                    "tid":tid,
                    "pay_pwd":$('#shop_payPass').val()
                },
                success: function () {
                    $(".shop-submin").attr("disabled", true)
                }
            };
            $.ajax(settings).done(function (response) {
                //alert(response.message)
                if(response.code==0) {
                    $('.action').append(response.data.content)
                    $(".action form").submit();
                }
            });


        });

    });

    //定义返回的连接
    if (callback_url) {
        $('.left').html('<a class="back" href="'+callback_url+'"><img src="images/zm-back.png"></a>');
    } else {
        $('.left').html('<a class="back" onclick="window.history.go(-1)"><img src="images/zm-back.png"></a>');
    }

});