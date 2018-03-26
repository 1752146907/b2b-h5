$(document).ready(function () {

    $('.dpName a').attr('href','shopinfo.html?shop_id='+shop_id);

   //获取商品分类
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
        }
    });

    //获取商品列表
    $.ajax({
        type: "get",
        url: getJson + getShopItem,
        dataType: "json",
        data:{
        shop_id:shop_id
        },success:function(data){
            var items ="";
            console.log(data);
            for(var n = 0; n < data.data.items.length; n++){
                //console.log(n);
                var price = data.data.items[n].price;
                items ="";
                items += "<li>";
                items += "<div class='proPic'><a href='shopinformation.html?item_id="+data.data.items[n].item_id+"&shop_id="+shop_id+"'><img src='" +imgUrl+ data.data.items[n].image_thumb+"' /></a></div>";
                items += "<div class='proText'>";
                items += "<a href='shopinformation.html?item_id="+data.data.items[n].item_id+"&shop_id="+shop_id+"'>"+data.data.items[n].title+"</a>";
                items += "<p>"+parseFloat(price)+"</p>";
                items += " </div>";
                items += "</li>";
                $('.mainPro ul').append(items);
//              console.log(n);
//              console.log(data.data.items.length);
            }
            // $(data.data).each(function (n, vale) {
            //     items += "<li>";
            //     items += "<div class='proPic'><a href='shopinformation.html?item_id="+vale.item_id+"&shop_id="+shop_id+"'><img src='"+vale.items[n].image_thumb+""+vale.image_thumb+"' /></a></div>";
            //     items += "<div class='proText'>";
            //     items += "<a href='shopinformation.html?item_id="+vale.item_id+"&shop_id="+shop_id+"'>"+vale.items[n].title+"</a>";
            //     items += "<p>"+vale.items[n].price+"</p>";
            //     items += " </div>";
            //     items += "</li>";
            //     console.log(vale.items[n].image_thumb);
            // });
            // $('.mainPro ul').append(items);
        }
    });

    $('.bot li a.my').attr('href','my.html?shop_id='+shop_id);
    $('.bot li a.shopCar').attr('href','shop-car.html?shop_id='+shop_id)

    $('aside.slide-wrapper').on('touchstart', 'li', function(e){
        $(this).addClass('current').siblings('li').removeClass('current');
    });

    $('a.slide-menu').on('click', function(e){
        var wh = $('div.wrapper').height();
        $('div.slide-mask').css('height', wh).show();
        $('aside.slide-wrapper').css('height', wh).addClass('moved');
    });

    $('div.slide-mask').on('click', function(){
        $('div.slide-mask').hide();
        $('aside.slide-wrapper').removeClass('moved');
    });


    $.ajax({
        type: "get",
        url: getJson + getShop+"/"+shop_id,
        dataType: "json",
        data:{

        },success:function(data){
            var shop_logo = data.data.shop.shop_logo;
            $('.dpName img').attr('src',imgUrl + shop_logo);
            $('.shopinfo-name').html(data.data.shop.shop_name);
        }
    });


    $.ajax({
        type: "get",
        url: getJson + getAd,
        dataType: "json",
        data:{
           'pos':6
        },success:function(data){
            if (data.data.items.length){
                $('.bannerBg img').attr('src',imgUrl + data.data.items[0].cover);
            }
        }
    });




    if(sessionStorage.getItem("token")==null) {
     $('.bot ul li em').hide();
    }else {
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

});


