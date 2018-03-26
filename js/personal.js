$(document).ready(function () {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url":getJson + members+"/"+uid ,
        "method": "GET",
        "headers": {
            "authorization": basetoken
        },
        "data": {

        },success:function(data){console.log(data)}
    }
    $.ajax(settings).done(function (response) {
        var  sex = ['女','男','保密'];
       $('.personalImg img').attr('src',response.data.avatar);
        if(response.data.nickname == null) {
            $('.personalName span').html('未设置');

        }else {
            $('.personalName span').html(response.data.nickname);
        }
         $('.personalName a').attr('href','name.html?name='+encodeURI(response.data.nickname));
         $('.personalSex a').attr('href','sex.html?sex='+response.data.sex);
         $('.personalSex a').attr('value',response.data.sex);
         $('.personalSex  span').html(sex[response.data.sex]);
        if(response.data.birthday == null) {
            $('.personalBri input').val('未设置');
        }else {
            $('.personalBri input').val(response.data.birthday)
        }
       $('.personalImg img').attr('src',imgUrl+response.data.avatar);
        $('.personalImg a').attr('href','imageupload.html');
    });


    $('#startDate').change(function(){
            console.log(111);
            var settings = { 
            "async": true,
            "crossDomain": true,
            "url":getJson + members+"/"+uid ,
            "method": "PATCH",
                    "headers": {
                "authorization": basetoken
            },
            "data": {
                nickname : $('.personalName span').html(),
                birthday : $('.personalBri input').val(),
            }
        }
        $.ajax(settings).done(function (response) {
            console.log(response);
        });

    });

});