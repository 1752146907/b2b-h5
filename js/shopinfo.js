$(document).ready(function () {

    //获取商品列表
    $.ajax({
        type: "get",
        url: getJson + getShop+"/"+shop_id,
        dataType: "json",
        data:{

        },success:function(data){
           $('.infoTop img').attr('src',imgUrl+data.data.shop.shop_logo);
            $('.infoTop h4').html(data.data.shop.shop_name);
            $('.infoName span').html(data.data.shop.desc);
            $('.infoTime span').html(data.data.shop.open_time);

        }
    });
});