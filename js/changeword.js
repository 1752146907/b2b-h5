
$(function(){

    $('.tcBtn').on('click',function(){
        var oldWord = $('.oldPassword').val();
        var newWord = $('.newPassword').val();
        var surWord = $('.surePassword').val();
        if(oldWord=='' ){
            alert('请输入原始密码');
            return false;
        }
        if(newWord==''){
            alert('请输入新密码');
            return false;
        }
        if(surWord==''){
            alert('请输入确定新密码');
            return false;
        }
        if(surWord != newWord ){
            alert('俩次密码输入不一致');
            return false;
        }

        var settings = {
            "async": false,
            "crossDomain": true,
            "url":getJson + loginMem +"/" +uid ,
            "method": "PUT",
            "headers": {
                "authorization": basetoken
            },
            "data": {
                password_old:oldWord,
                password:surWord
            }
        }

        $.ajax(settings).done(function (response) {

            if(response.uid == "" || response.uid == "null" || response.uid == null ){
               alert("修改登录密码失败");
            }else {
                alert("修改登录密码成功");
                sessionStorage.setItem("token", response.token);
                location.href = "login.html";
            }
        });

    });
});
