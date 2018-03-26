$(document).ready(function () {
    var request = new UrlSearch();
    var cat_id = request.cat_id;
    var cat_name = request.cat_name;

    if(cat_name){
        $(".current-cat-name").html(cat_name);
    }

    //获取分类商品
    $.ajax({
        type: "get",
        //url: getJson + getShopList,
        url: getJson + getChildrenCategorys + "?cat_id=0",
        dataType: "json",
        headers: {
            'Authorization': basetoken
        },
        data:{
        },success:function(data){
            var item ="";
            var str ="";
            $(data.data).each(function (n, vale) {
                item += "<li><a href='list.html?cat_id="+vale.cat_id+"&cat_name="+vale.cat_name+"&shop_id="+shop_id+"'>"+vale.cat_name+"</a></li>";
                str += "<a href='list.html?cat_id="+vale.cat_id+"&cat_name="+vale.cat_name+"&shop_id="+shop_id+"'>"+vale.cat_name+"</a>";
            });
            $('.slideNav ul').append(item);
            $('.navMenu').append(str);
        },error:function (){
            alert("调用失败")
        }
    });

    //获取分类商品对应商品
    $.ajax({
        type: "get",
        url: getJson + getShopItem,
        dataType: "json",
        data:{
            shop_id:shop_id,
            cat_id:cat_id
        },success:function(data){
            for(var n = 0; n < data.data.items.length; n++){
                var items ="";
                items += "<li>";
                items += "<div class='proPic'><a href='shopinformation.html?item_id="+data.data.items[n].item_id+"&shop_id="+shop_id+"'><img src='" +imgUrl+ data.data.items[n].image_thumb+"' /></a></div>";
                items += "<div class='proText'>";
                items += "<a href='shopinformation.html?item_id="+data.data.items[n].item_id+"&shop_id="+shop_id+"'>"+data.data.items[n].title+"</a>";
                items += "<p>"+parseFloat(data.data.items[n].price)+"</p>";
                items += " </div>";
                items += "</li>";
                $('.listShop ul').append(items);
            };
        }
    });


    $('aside.slide-wrapper').on('touchstart', 'li', function(e){
        $(this).addClass('current').siblings('li').removeClass('current');
    });

    $('.listFl').on('click', function(e){
        var wh = $('html').height();
        $('div.slide-mask').css('height', wh).show();
        $('aside.slide-wrapper').css('height', wh).addClass('moved');
    });

    $('div.slide-mask').on('click', function(){
        $('div.slide-mask').hide();
        $('aside.slide-wrapper').removeClass('moved');
    });

});