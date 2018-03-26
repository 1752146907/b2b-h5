
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

    $('.getcode').on('click',function(){
        if($('.ycode').val()==""){
            alert('请填写验证码');
            return false;
        }

        if(!(/^1[34578]\d{9}$/.test($('.tel').val())) || $('.tel').val() == '') {
            alert('手机号填写有误');
            return false;
        }
        if($('.getcode').html() != '获取验证码'){
            return false;
        }
        console.log(111);
        var num = 60;
        $.ajax({
            type: "post",
            url: getJson + usermsg,
            dataType: "json",
            data:{
                account:$('.tel').val(),
                captcha_key:random,
                captcha_code:$('.ycode').val(),
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

    $('.getpassword-btn button').on('click',function(){
        if(!(/^1[34578]\d{9}$/.test($('.tel').val())) && $('.tel').val() == '') {
            alert('手机号填写有误');
            return false;
        }
        if($('.vcode').val() == ''){
            alert('验证码不能为空');
            return false;
        }
        if($('.setpassword').val() == '') {
            alert('密码不能为空');
            return false;
        }
        if($('.setpassword').val() != $('.password').val()){
            alert('密码输入不一致');
            return false;
        }

        $.ajax({
            type: "post",
            url: getJson + forgot,
            dataType: "json",
            data:{
                username:$('.tel').val(),
                new_password:$('.password').val(),
                vcode: $('.vcode').val()

            },success:function(data){
                alert(data.message);
                if(data.code == 0){
                    location.href = "login.html";
                }
            }

        });
    });
});


