$(document).ready(function () {
    var Request = new UrlSearch(); //实例化
    var item_id = Request.item_id;
    var sku_id = Request.sku_id;
    var stateValue = Request.value;

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
            var isChecked ="";
            if(vale.is_default == "true" && vale.app_id =="deposit" ){
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
            if(vale.is_default == "true" ){
                isChecked = "checked"
            }else {
                isChecked = ""
            }
            payList+="<label class='clearfix'>"
            payList+=" <span><img src='"+icoUrl+vale.app_icon+"'>"+vale.app_name+"</span>"
            payList += "  <input name='pay' class='pay_radio'  type='radio'" + isChecked + " id='" + vale.app_id + "'>"
            payList+="  <i></i>"
            payList+="   </label>"

            //console.log(vale.app_name)
        });
        $('.shopSubm').append(payList);

        //微信浏览器屏蔽支付宝，其他外部浏览器屏蔽微信支付
        if (isWeiXin()) {
            $('#wapalipay').parent('.clearfix').remove();
        } else {
            $('#wapweixin').parent('.clearfix').hide();
        }

        $(".shopSubm input").on('click', function () {
            getPassword();
        });
    });


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

// 判断点击过来的状态
    if(stateValue==""){
     $('.tab a:first-child').addClass('on').siblings().removeClass('on')
    };
    if(stateValue=="WAIT_BUYER_PAY"){
        $('.tab a:nth-child(2)').addClass('on').siblings().removeClass('on')
    };
    if(stateValue=="WAIT_SELLER_SEND_GOODS"){
        $('.tab a:nth-child(3)').addClass('on').siblings().removeClass('on')
    };
    if(stateValue=="WAIT_BUYER_CONFIRM_GOODS"){
        $('.tab a:nth-child(4)').addClass('on').siblings().removeClass('on')
    };



//    获取全部订单
    var settings = {
        "async": true,
        "crossDomain": true,
        "url":getJson + findOrder ,
        "method": "GET",
        "headers": {
            "authorization": basetoken
        },
        "data": {
            status:stateValue
        }
    }

    $.ajax(settings).done(function (response) {
        $('.tab_box').hide();
        $('.firm_No').hide();
        if(response.data.trades.length == 0 ){
            $('.firm_No').show();
        }else {
            $('.tab_box').show();
            var item ="";
            var tidS ="";
            $('#tab-box2').val("WAIT_BUYER_PAY");
            $('#tab-box3').val("WAIT_SELLER_SEND_GOODS");
            $('#tab-box4').val("WAIT_BUYER_CONFIRM_GOODS");

                $(response.data.trades).each(function (n, vale) {
                    //console.log(vale);
                var tid = vale.tid;
                // console.log(tid);

                tidS = vale.tid;
                var stateS="";
                var stateClass="";
                var stateBtn ="";
                var paymentBn ="";

                    if(vale.payment) {
                        paymentBn = vale.payment.payment_list[0].payment_bn;

                    }else {
                        paymentBn = "";
                    }
                    if (vale.status == "WAIT_BUYER_PAY") {
                    stateS= "待支付";
                    stateClass ="state";
                        stateBtn = "<a class='currentA currentC'>支付</a>";
                    var cancel = "<a class='cancel' data-tid="+tid+">取消</a>";
                }
                if (vale.status == "WAIT_SELLER_SEND_GOODS") {
                    stateS= "待发货";
                    stateClass ="state";
                    stateBtn= "<a class='currentA '>待发货</a>";
                    var cancel = "";
                }
                if (vale.status == "WAIT_BUYER_CONFIRM_GOODS") {
                    stateS= "待收货";
                    stateClass ="state";
                    cancel = " ";
                    stateBtn= "<a class='currentA currentB'><input type='hidden' value='"+vale.tid+"'> 确定收货</a><a class='currentD' href=''>查看物流</a>";
                }
                if (vale.status == "TRADE_BUYER_SIGNED") {
                    stateS= "已签收";
                    stateClass ="stateOn";
                }
                if (vale.status == "TRADE_FINISHED") {
                    stateS= "已完成";
                    stateClass ="stateOn";
                    stateBtn= "<a class='currentA'>再次购买</a>";
                }
                if (vale.status == "TRADE_CLOSED") {
                    stateS= "已关闭";
                    stateClass ="stateOn";
                }
                item += "<div class='orderList'> <dl>";
                item +=" <dt>"+ vale.shop_name +"</dt>";
                item +="<dd><img src='images/zm-b-back.png'>"+ vale.tid +"</dd>";
                item +="<dd class='"+stateClass+"'>"+stateS+"</dd>";
                item += "</dl>";
                item+=" <ul><a href='firmorder.html?id="+vale.tid+"'>"
                $(vale.trade_order).each(function (m, vae) {
                       item+= "<li><img src="+imgUrl+vae.pic_path+">"+
                       "</li>"
                    });
                item+= "</a></ul>"
                item+="<ol>"
                item+="<li>实付金额:<i>"+"￥"+parseFloat(vale.total_fee)+"</i></li>"
                item+="<li>共<span>"+vale.trade_order.length+"件</span></li>"
                item+="</ol>"
                item+= "<div class='btn-box'>"+
                    stateBtn + cancel + "<em style='display: none'>" +
                        vale.tid+"</em> <i style='display: none'>"+
                        paymentBn+"</i><a href='firmorder.html?id="+vale.tid+"'>订单详情</a></div>"+
                        "</div>"
                });
            $('.tab-box1').html(item);
            $('.tab-box2').html(item);
            $('.tab-box3').html(item);
            $('.tab-box4').html(item);

            $('.btn-box .currentD').attr('href','orderdetail.html?tid='+tidS);

            //点击确定收货
            $('.btn-box .currentB').on('click', function () {
                var tid =$(this).find('input').val();
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
                    $.ajax(settings).done(function (response) {
                        alert(response.message);
                        $('.shop-carshade').hide();
                        window.location.reload();
                    });
                });
            });
            $('.model-btn-no').on('click', function () {
                $('.shop-carshade').hide();
            });

            $(".shop_payPass").hide();

            $('.btn-box .currentC').on('click',function(){

                shopSubox();
                var payment_bn = $(this).siblings('i').html();
                var tid = $(this).siblings('em').html();
//              console.log(payment_bn);
//              $(".shop_payPass").hide();

                $('.shop-submin').on('click',function(){
                    //判断是否选中支付方式
                    if ($(".pay_radio").is(":checked")) {
                    }
                    else {
                        alert("请勾选您的支付方式");
                        return false;
                    }

                    var app_id = $('.shopSubm input:checked').attr('id');
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
                            "pay_pwd":$('#shop_payPass').val()
                        }, success: function () {
                            $(".shop-submin").attr("disabled", true)
                        }

                    }
                    console.log(settings);
                    $.ajax(settings).done(function (response) {
                        //alert(response.message)
                        if(response.code==0) {
                            $('.action').append(response.data.content)
                            $(".action form").submit();
                        }
                    });
//        }
                });

            });
        }


    });
    //    选项卡
    $(".tab a").click(function(){
        $(".tab a").eq($(this).index()).addClass("on").siblings().removeClass('on');
        var index=$(this).index();
        $(".tab_box > div").eq(index).show().siblings().hide();

    });

//    获取待支付 代付款 代收款
    $(".tab a").click(function(){
        var status = $(this).find('input').val();
        // console.log(status);
        var settings = {
            "async": false,
            "crossDomain": true,
            "url": getJson + findOrder,
            "method": "GET",
            "headers": {
                "authorization": basetoken
            },
            "data": {
                "status":status
            }
        }

        $.ajax(settings).done(function (response) {
            //console.log(response.data.trades);
            $('.tab_box').hide();
            $('.firm_No').hide();
            if(response.data.trades.length==0 ){
                $('.firm_No').show();
            }else {
                $('.tab_box').show();
                var item = "";
                var tidS = "";
                $(response.data.trades).each(function (n, vale) {

                    var stateS = "";
                    var stateClass = "";
                    var stateBtn = "";
                    var paymentBn ="";
                    var tid = vale.tid;
                    tidS = vale.tid;
                    if(vale.payment) {
                        paymentBn = vale.payment.payment_list[0].payment_bn;

                    }else {
                        paymentBn = "";
                    }
                    if (vale.status == "WAIT_BUYER_PAY") {
                        stateS = "待支付";
                        stateClass = "state";
                        stateBtn = "<a class='currentA currentC'>支付</a>";
                        var cancel = "<a class='cancel' data-tid="+tid+">取消</a>";
                    }
                    if (vale.status == "WAIT_SELLER_SEND_GOODS") {
                        stateS = "待发货";
                        stateClass = "state";
                        stateBtn = "<a class='currentA '>待发货</a>";
                        var cancel = "";
                    }
                    if (vale.status == "WAIT_BUYER_CONFIRM_GOODS") {
                        stateS = "待收货";
                        cancel = " ";
                        stateClass = "state";
                        stateBtn = "<a class='currentA currentB'>确定收货</a><a class='currentD'>查看物流</a>";
                    }
                    if (vale.status == "TRADE_BUYER_SIGNED") {
                        stateS = "已签收";
                        stateClass = "stateOn";
                    }
                    if (vale.status == "TRADE_FINISHED") {
                        stateS = "已完成";
                        stateClass = "stateOn";
                        stateBtn = "<a class='currentA'>再次购买</a>";
                    }
                    if (vale.status == "TRADE_CLOSED") {
                        stateS = "已关闭";
                        stateClass = "stateOn";
                    }
                    item += "<div class='orderList'> <dl>";
                    item += " <dt>" + vale.shop_name + "</dt>";
                    item += "<dd><img src='images/zm-b-back.png'>" + vale.tid + "</dd>";
                    item += "<dd class='state'>" + stateS + "</dd>";
                    item += "</dl>";
                    item += " <ul><a href='firmorder.html?id=" + vale.tid + "'>"
                    $(vale.trade_order).each(function (m, vae) {

                        item += "<li><img src=" + imgUrl + vae.pic_path + "></li>"
                    });
                    item += "</a></ul>"
                    item += "<ol>"
                    item += "<li>实付金额:<i>" + "￥" + parseFloat(vale.total_fee) + "</i></li>"
                    item += "<li>共<span>" + vale.trade_order.length + "件</span></li>"
                    item += "</ol>"
                    item += "<div class='btn-box'>"+
                        stateBtn + cancel + "<em style='display: none'>" +
                            vale.tid+"</em> <i style='display: none'>"+
                            paymentBn+"</i><a href='firmorder.html?id="+vale.tid+"'>订单详情</a></div>"+
                            "</div>"
                //console.log(stateBtn);console.log(cancel);
                });

                $('.tab-box1').html(item);
                $('.tab-box2').html(item);
                $('.tab-box3').html(item);
                $('.tab-box4').html(item);
                //console.log(response.data.trades.tid);

                $('.btn-box .currentD').attr('href', 'orderdetail.html?tid=' + tidS);
            //点击确定收货
            $('.btn-box .currentB').on('click', function () {
                var tid =$(this).find('input').val();
                // console.log(tid);
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
                    //console.log(settings);
                    $.ajax(settings).done(function (response) {
                        console.log(response.message);
                        window.location.reload();
                    });
                });
            });
            $('.model-btn-no').on('click', function () {
                $('.shop-carshade').hide();
            });

            $('.btn-box .currentC').on('click',function(){

                shopSubox();
                var payment_bn = $(this).siblings('i').html();
                var tid = $(this).siblings('em').html();

                $('.shop-submin').on('click',function(){

                    var app_id = $('.shopSubm input:checked').attr('id');
                    if(app_id=="deposit"){
                        if($('#shop_payPass').val()==""){
                            alert("请填写预支付密码");
                            return false;
                        }
                        else {
                            var pay_pwd = $('#shop_payPass').val()
                        }
                    }
                    $(".shop-submin").attr("disabled", true);
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
                            "is_need_pay_pwd":$('.shop_payPass').val()
                        }

                    }
                    //console.log(settings);
                    $.ajax(settings).done(function (response) {
                        //alert(response.message)
                        if(response.code==0) {
                            $('.action').append(response.data.content)
                            $(".action form").submit();
                        }
                    });
                });

            });
            };
        });
     });

    // 取消订单
    $(document).on('click','.cancel',function(){
        //event.returnValue = confirm("删除是不可恢复的，你确认要删除吗？");
        if(window.confirm('确定要取消订单吗？')){
            var tid=$(this).data('tid') 
            var _this=$(this)
            console.log(tid)
            $.ajax({
                type: "DELETE",
                url: getJson + 'apitrade/trade-members/' + tid,
                dataType: "json",
                headers: {
                    "authorization": basetoken
                },
                success: function (data) {
                    console.log(data);
                    console.log(_this.parents('.orderList'))
                    if(status = 200){
                        _this.parents('.orderList').fadeOut();
                    }
                }
            });
            return true;
            }else{
                return false;
             }
    });
})