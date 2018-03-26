$(document).ready(function () {
    //  判断登录
    $('.login').hide();
    $('.loginSate').hide();

    if(sessionStorage.getItem("token")==null) {
        $('.login').show();
    } else {
        $('.loginSate').show();
        var settings = {
            "async": true,
            "crossDomain": true,
            "url":getJson + loginMem+"/"+uid ,
            "method": "GET",
            "headers": {
                "authorization": basetoken
            },
            "data": {

            }
        }

        $.ajax(settings).done(function (response) {
            if(response.avatar==null || response.avatar=="" ){
            }else {
               $('.loginSate img').attr('src',imgUrl+data.data.avatar);

            }
            $('.loginSate a').html(response.mobile);
            sessionStorage.setItem("mobile", response.mobile);
            $('.loginSate a').attr('href','personal.html')
        });
        
        //获取用户信息
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url":getJson + members+"/"+uid ,
            "method": "GET",
            "headers": {
                "authorization": basetoken
            },success:function(data){
                if (data.data.avatar != 'null' && data.data.avatar && data.data.avatar != null  && data.data.avatar != '') {
                    $(".myLogin img").attr('src',imgUrl+data.data.avatar);
                } else {
                    $(".myLogin img").attr('src', 'images/admin.png');
                }
            }
        });
    }

    //获取购物车的数量
    if(sessionStorage.getItem("token")==null) {
        $('.bot ul li em').hide();
    }else {
        $('.bot ul li em').show();
        var settings = {
            "async": true,
            "crossDomain": true,
            "url":getJson + getNum ,
            "method": "GET",
            "headers": {
                "authorization": basetoken
            },
            "data": {

            }
        } 

        $.ajax(settings).done(function (response) {
            if(response.data.item_nums == null) {
                $('.bot ul li em').hide();
            }else {
                $('.bot ul li em').html(response.data.item_nums);

            }


        });
    }



//   我的订单判断是否登录
    $('.orderTop').on('click',function(){
        if(sessionStorage.getItem("token")==null) {
            alert("请登录");
            window.location.href="login.html";
        }else {

            $('.orderTop a').attr('href','orderstate.html?value=')
        }

    });

//   点击待付款判断是否登录
    $('.payment').on('click',function(){
        if(sessionStorage.getItem("token")==null) {
            alert("请登录");
            window.location.href="login.html";
        }else {
            $('.payment').attr('href','orderstate.html?value=WAIT_BUYER_PAY');
        }
    });

//   点击待发货判断是否登录
    $('.delivery').on('click',function(){
        if(sessionStorage.getItem("token")==null) {
            alert("请登录");
            window.location.href="login.html";
        }else {
            $('.delivery').attr('href','orderstate.html?value=WAIT_SELLER_SEND_GOODS');
        }

    });

//   点击待收货判断是否登录
    $('.pickup').on('click',function(){
        if(sessionStorage.getItem("token")==null) {
            alert("请登录");
            window.location.href="login.html";
        }else {
            $('.pickup').attr('href','orderstate.html?value=WAIT_BUYER_CONFIRM_GOODS');
        }

    });

//   点击退款/售后判断是否登录
    $('.back').on('click',function(){
        if(sessionStorage.getItem("token")==null) {
            alert("请登录");
            window.location.href="login.html";
        }else {
            $('.back').attr('href','sub-list.html');
        }

    });

//   点击收藏商品判断是否登录
    $('.collect').on('click',function(){
        if(sessionStorage.getItem("token")==null) {
            alert("请登录");
            window.location.href="login.html";
        }else {
            $('.collect').attr('href','collect.html');
        }

    });
    
//   点击地址管理判断是否登录
    $('.address').on('click',function(){
        if(sessionStorage.getItem("token")==null) {
            alert("请登录");
            window.location.href="login.html";
        }else {
            $('.address').attr('href','address.html');
        }

    });

//   点击浏览足迹判断是否登录
    $('.history').on('click',function(){
        if(sessionStorage.getItem("token")==null) {
            alert("请登录");
            window.location.href="login.html";
        }else {
            $('.history').attr('href','history.html?shop_id='+shop_id);
        }

    });

//   点击判断是否登录
    $('.setup').on('click',function(){
        if(sessionStorage.getItem("token")==null) {
            alert("请登录");
            window.location.href="login.html";
        }else {
            $('.setup').attr('href','setup.html');
        }

    });

    $('.bot li a.index').attr('href','shop.html?shop_id='+shop_id);
    $('.bot li a.shopCar').attr('href','shop-car.html?shop_id='+shop_id)
});