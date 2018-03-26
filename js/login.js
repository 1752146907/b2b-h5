
$(function(){
    $('.login-hide').on('click',function(){
        if($('.password').prop('type')=='password'){
            $('.password').prop('type','text');
        }else{
            $('.password').prop('type','password');
        }
    });
    $('.loginbtn').on('click',function(){
        if($('.username').val()=='' || !(/^1[34578]\d{9}$/.test($('.username').val()))){
            alert('亲，请认真核对手机号');
            return false;
        }
        if($('.password').val()==''){
            alert('密码不能为空');
            return false;
        }

        //openid
        var openId = sessionStorage.getItem('openid');

        $.ajax({
            type: "post",
            url: getJson + userlogin,
            dataType: "json",
            data:{
                username:$('.username').val(),
                password:$('.password').val(),
                usertype:"member",
                openid:openId
            },success:function(data){
                //console.log(data)
                //alert(data);
                var shopid = sessionStorage.getItem("shop_id");
                // alert(data);
                // alert(shopid);
                 if(data.code == 0){
                     sessionStorage.setItem("token", data.data.token);
                     sessionStorage.setItem("uid", data.data.uid);
                     location.href = "shop.html?shop_id=" + shopid;

                     //清除openid
                     sessionStorage.setItem('openid', '');
                 }
                 else{
                    alert(data.message);
                 }
            }
        });
    });

    function isWeiXin(){ 
       var ua = window.navigator.userAgent.toLowerCase(); 
       if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
          return true;
       }else{
          return false;
       }
    }

    // 获取openid（用于微信支付)
    function getOpenId(){
        if(!isWeiXin()) return;

        var openId = sessionStorage.getItem('openid');
        if (!openId) {
            // 获取微信openid
            var Request = new UrlSearch();//实例化
            var code = Request.code;
            if(code){
                $.ajax({   
                  type: "POST",
                    url: getJson + getOpenIdApi,
                    dataType: "json",
                    data: {
                        platform:'weixin',
                        code:code
                    },
                    success:function(rs){
                        if (rs.code == 0) {
                            sessionStorage.setItem('openid', rs.data.openid);
                        }
                    }
                });
            } else {

                $.ajax({   
                  type: "POST",
                    url: getJson + getCodeUrlApi,
                    dataType: "json",
                    data: {
                        platform: 'weixin',
                        redirect_uri: baseUrl+'/login.html',
                    },
                    success:function(rs){
                        if (rs.code == 0) {
                            location.href = rs.data.codeurl;
                        }
                    }
                });
            }
        }
    }
    getOpenId();

});
