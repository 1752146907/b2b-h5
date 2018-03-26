$(document).ready(function () {
     console.log(getJson + members+"/"+uid);
    var data = {};
    var  isNon = true;
        $('.mobile-upload').Mobile_upload(
            {
                multiple:false,
                callback:function(result,name,postName){
                    data['imgbase64'] = result;
                    data['filename'] = name.name;
                    data['imgType'] = name.type;
                    data['targetType'] = 'member';
                    data['targetId'] = uid;
                    isNon = false;
                    $('.mobile-upload').before('<img src="'+result+'"/><input type="hidden" name="'+postName+'"/>');
                }});
    $('.sureBtn').on('click',function(){
        console.log(data);
        console.log();
        if(isNon){
             alert('请选择图片');
             return;
         }
        var settings = {
            "async": true,
            "crossDomain": true,
            "url":getJson + members ,
            "method": "POST",
            "headers": {
                "authorization": basetoken
            },
            "data": data
        }
        $.ajax(settings).done(function (response) {
            if(response.code==0) {
                location.href = "personal.html";
            }
            else{
                alert(response.message)
            }
        });
    })
});