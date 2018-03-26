function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++){
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};
$(function(){
    var random =  randomString(32);
    var Request = new UrlSearch(); //实例化
    var value = Request.value;
    function getImgCode(){
        $.ajax({
            type: "get",
            url: getJson + imgCode,
            dataType: "text",
            data:{
                "captcha_key":random
            },success:function(data){
                var imgData = getJson + imgCode +"?captcha_key="+random;

                $('.loginCode img').attr('src',imgData);

            }

        });
    };
    getImgCode();
    $('.loginCode a').on('click',function(){
        getImgCode();
    });





    $('.payMain p em').html(mobile);


    $('.getcode').on('click',function(){
        var oldWord = $('.oldPassword').val();
        var newWord = $('.newPassword').val();
        var vcode = $('.vCode').val();
        var ycode = $('.yCode').val();
        console.log(vcode);
        if(vcode ==""){
            alert('请填写图形验证码');
            return false;
        }



    if($('.getcode').html() != '获取验证码'){
        return false;
    }
//        console.log(111);
    var num = 60;
    $.ajax({
        type: "post",
        url: getJson + usermsg,
        dataType: "json",
        data:{
            account:mobile,
            captcha_key:random,
            captcha_code:vcode,
            account_type:'member',
            send_type:'signup'
        },success:function(data){
            alert(data.message);
            console.log(data);
            $('.getcode').css('background','#ccc');
            $('.getcode').html('重新获取('+num+')');
            var timer = setInterval(function(){
                if(num == 0){
                    clearInterval(timer);
                    $('.getcode').html('获取验证码');
                    $('.getcode').css('background','#ff4c01');
                }else{
                    num--;
                    $('.getcode').html('重新获取('+num+')');
                }
            },1000);
        }
    });
});

    $('.tcBtn').on('click',function(){
        var oldWord = $('.ordPayword').val();
        var newWord = $('.newPayword').val();
        var vcode = $('.vCode').val();
        var ycode = $('.yCode').val();
        if(ycode==''){
            alert('请输入确定短信验证码');
            return false;
        }
        if(vcode==''){
            alert('请输入确定图形验证码');
            return false;
        }
        if(oldWord=='' ){
            alert('请输入支付密码');
            return false;
        }
        if(newWord==''){
            alert('请再次输入支付密码');
            return false;
        }
        if(newWord != oldWord ){
            alert('俩次密码输入不一致');
            return false;
        }

        var settings = {
            "async": false,
            "crossDomain": true,
            "url":getJson + getPass ,
            "method": "POST",
            "headers": {
                "authorization": basetoken
            },
            "data": {
                verifyCode:ycode,
                password:newWord
            }
        }
      console.log(settings)
        $.ajax(settings).done(function (response) {
          if(response.code == 0) {
              alert('设置支付密码成功');
              var valueName= "WAIT_BUYER_PAY"
              if(value==1){
                  window.location.href='orderstate.html?value='+valueName
              }else {
                  window.location.href="setup.html"
              }

          } else {
              alert('设置支付密码失败')
          }
        });

    });
});
