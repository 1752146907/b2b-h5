$(document).ready(function () {
    var Request = new UrlSearch(); //实例化
    var item_id = Request.item_id;

    //新增商品浏览记录
    if(sessionStorage.getItem("token") != null) {
        $.ajax({
            type: "POST",
            url: getJson + addhistories,
            dataType: "json",
            headers: {
                "Authorization": basetoken,  //  token参数
            },
            data: {
                shop_id: shop_id,
                item_id: item_id
            }
        });
    }

    //获取购物车的数量
    if(sessionStorage.getItem("token")==null) {
        $('.gmBwc i').hide();
    }else {
        $('.gmBwc i').show();
        var settings = {
            "async": true,
            "crossDomain": true,
            "url":getJson + getNum ,
            "method": "GET",
            "headers": {
                "authorization": basetoken
            },
            "data": {

            },
            complete: function(xhr, textStatus) {
                console.log(xhr.status);
            }
        }

        $.ajax(settings).done(function (response) {
            if(response.data.item_nums == null) {
                $('.gmBwc i').hide();
            }else {
                $('.gmBwc i').html(response.data.item_nums);

            }
        });
    }


    //购买规格显示
    function toshare(){
        $(".am-share").addClass("am-modal-active");
        if($(".sharebg").length>0){
            $(".sharebg").addClass("sharebg-active");
        }else{
            $("body").append('<div class="sharebg"></div>');
            $(".sharebg").addClass("sharebg-active");
        }
        $(".sharebg-active,.share_btn").click(function(){
            $(".am-share").removeClass("am-modal-active");
            setTimeout(function(){
                $(".sharebg-active").removeClass("sharebg-active");
                $(".sharebg").remove();
            },300);
        })
    };

    function tosh(){
        $(".am-share1").addClass("am-modal-active");
        if($(".sharebg").length>0){
            $(".sharebg").addClass("sharebg-active");
        }else{
            $("body").append('<div class="sharebg"></div>');
            $(".sharebg").addClass("sharebg-active");
        }
        $(".sharebg-active,.share_btn1").click(function(){
            $(".am-share1").removeClass("am-modal-active");
            setTimeout(function(){
                $(".sharebg-active").removeClass("sharebg-active");
                $(".sharebg").remove();
            },300);
        })
    };

   //获取商品
    $.ajax({
        type: "get",
        url: getJson + shopInfo+item_id,
        dataType: "json",
        data: {
            shop_id:shop_id
        },
        success:function(data){
            console.log(data);
            var photo = data.data.image_photo && data.data.image_photo.split(",");
            var image = "";
            $(photo).each(function (n, vale) {
                image += "<div class='swiper-slide'>"
                image += "<img src='" + imgUrl + data.data.image_thumb + "'>"
                image += "</div>"
            });
            $('.swiper-wrapper').append(image);
            var swiper1 = new Swiper('.shopBanner .swiper-container', {
                pagination: '.pagination0',
                autoplay: 4000,
                paginationClickable: true
            });

            // var store = "<em>库存：" + data.data.store + "</em>";
            $('.shopName h3').text(data.data.title);
            //$('.shopName p').html(store);
            $('.shopName .price').html(data.data.price+"元");
            $('.tu img').attr("src", imgUrl + data.data.image_thumb + "?w=300");
            $('.tit').html("<b class='mkt_price'>"+"/"+ "</b>" + "元" + "<em>" + "库存：" + "<b class='store'>"+"/" + "</b>");
            $('.shopTp').append(data.data.desc.wap_desc);

            // $('#sku_id').val(data.data.sku_id);
            $('#item_id').val(data.data.item_id);
            checkFavour(data.data.item_id);
            var skuId = {};
            // var skuId={};

            //单规格
            console.log(data.data.props_sku.length)
            if (data.data.props_sku.length <= 1) {
                $('#sku_id').val(data.data.props_sku[0].sku_id);
                $('.mkt_price').html(data.data.props_sku[0].price)
                $('.store').html(data.data.props_sku[0].store);
                $('.price').html(data.data.props_sku[0].pricee);
                console.log(data.data.props_sku)
            }
            //多规格
            else {
                $(data.data.props_sku).each(function (i, el) {
                    // skuId.push({sku_id:el.sku_id,prop_value_id:''})
                    var prop_value_id = '';
                    $(el.sale_props).each(function (n, m) {
                        prop_value_id += m.prop_value_id + '_';
                        // skuId[i].prop_value_id+=m.prop_value_id
                    })
                    skuId[prop_value_id] = {
                        sku_id: el.sku_id,
                        price:el.price,
                        store:el.store
                    }
                })
            }
            //历遍多规格
            var lists = "";
            console.log(data.data);
            var obj = data.data.sale_props;
            $(obj).each(function (index, obj) {
                lists += '<div class="middle clearfloat">';
                lists += '<p>' + obj.prop_name + '</p>';
                lists += '<div class="xia clearfloat">';
                lists += '<ul>';
                $(obj.propvalues).each(function (index, obj) {
                    lists += '<li class="ra3" data-propId="' + obj.prop_value_id + '">' + obj.prop_value + '</li>';
                });
                lists += '</ul>';
                lists += '</div>';
                lists += '</div>';
            });
            console.log(data.data.sale_props);
            $(".top").append(lists);

            $(".ra3").click(function (e) {
                if ($(this).hasClass('cur')) {
                    return;
                }
                var propId = '';
                $(this).addClass('cur').siblings().removeClass('cur');
                $('.ra3').each(function (i, el) {
                    if ($(el).hasClass('cur')) {
                        propId += $(el).data('propid') + '_';
                    }
                })
                if (skuId[propId]) {
                    $('.price').html(skuId[propId].price+"元");
                    $('#sku_id').val(skuId[propId].sku_id);
                    $('.store').html(skuId[propId].store);
                    var price = skuId[propId].price-0;
                    $('.mkt_price').html(price)
                }
            });

            //购物车数量加减
            $(".add").click(function(){
                var t=$(this).parent().find('input[class*=text_box]');
                t.val(parseInt(t.val()) + 1);
                // console.log(t.val());
            });
            $(".min").click(function(){
                var t=$(this).parent().find('input[class*=text_box]');
                t.val(parseInt(t.val()) - 1);
                if(parseInt(t.val())<1){
                    t.val(1);
                }
            });
        }
    });

    // 立即购买
    $('.gmNow').on('click',function(){
        if(sessionStorage.getItem("token") == null) {
            alert("请先登录");
            window.location.href="login.html" 
        }

        if($(".gmNow").text() == "库存不足"){}
        else{
            toshare();  //弹出购买
        }
    });

    //已选规格
    $('.gmAdd').on('click',function(){
        tosh();
    });

    //规格弹窗消失
    function tohide(){
        $(".am-share1").removeClass("am-modal-active");
        setTimeout(function(){
            $(".sharebg-active").removeClass("sharebg-active");
            $(".sharebg").remove();
        },300);
    };

    // 回到顶部
    $(window).scroll(function(){
        var head=100;
        var topScr=$(window).scrollTop();
        if (topScr>head) {
            $(".goTop").show();
        }else{
            $(".goTop").hide();
        }
    });

    //加入购物车接口
    $('.shop-post').on('click',function(){

        //判断商品规格是否存在
        if($('#sku_id').val()){}
        else{alert("此规格商品不存在，请重新选择")}

        if(sessionStorage.getItem("token")==null){
            alert("请登录");
            window.location.href="login.html";

        }else {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": getJson + carts,
                "method": "POST",
                "headers": {
                    "authorization": basetoken
                },
                "data": {
                    shop_id: shop_id,
                    sku_id: $('#sku_id').val(),
                    quantity:$('#Num').val()
                }
            }
            
            $.ajax(settings).done(function (response) {
                function cross(){     //定义失败提示 
                  iosOverlay({
                    text: response.message + "!",
                    duration: 2e3,
                    icon: "images/cross.png"
                  });
                  return false;
                }
                if(!response.data){
                    cross();    //执行失败提示 
                    // alert(response.message);
                    tohide();
                }else {
                    tohide();
                    $('.gmBwc i').show();
                    var getNum = $('.gmBwc i').html()
                    var gmNum = $('#Num').val();
                    console.log(parseInt(getNum) + parseInt(gmNum));
                    $('.gmBwc i').text(parseInt(parseInt(getNum) + parseInt(gmNum)));
                   $('#Num').val(1);

                   function checkMark(){    // 定义成功提示
                    iosOverlay({
                        text: response.message + "!",
                        duration: 2e3,
                        icon: "images/check.png"
                    });
                    return false;
                    }
                    checkMark();    //执行成功提示
                }
            });
        };
    });

    // 根据库存判断购买按钮高亮
    $.ajax({
        type: "get",
        url: getJson + shopInfo+item_id,
        dataType: "json",
        data:{
            shop_id:shop_id
        },success:function(data){
            console.log(data.data.store)
            if(data.data.store <= 0 || data.data.store == null){
                $(".gmNow").text("库存不足")
                .css({"background":"rgb(195, 190, 188)"});
            }
        }
    })


    //点击立即购买
    $('.shopGo').on('click',function(){
        console.log($('#sku_id').val())
        var skuid =$('#sku_id').val();
        var num = $('#vaNum').val();
        var item_id = $('#item_id').val();
//
//        var shoplist = [];
//        shoplist['shop_id'] = shop_id;
//        var sku_id="";
//        var result = [];
//        var shopItem =[{'shop_id':shop_id,'sku_id': skuid, "num":num ,"item_id":item_id}];
        var shopItem =[[shop_id, skuid, num ,item_id]];
        console.log(shopItem);
        var itemInfo= [];
        for(var i=0;i<shopItem.length;i++){
            var shipItem =shopItem[i].join(',');
            itemInfo.push(shipItem);
        }
        var items = itemInfo.join('|');
        if(token==null){
           alert("请登录");
           window.location.href="login.html";
      }else {
           window.location.href = "shop-submit.html?shopItem=" + items+"&sku_id="+skuid;
            $('#vaNum').val(1);
     }
    });


    $('.gmBwc').attr('href','shop-car.html?shop_id='+shop_id);
    $('.gmBjd').attr('href','shop.html?shop_id='+shop_id);
    // 后退一步
    $('.goBack').on('click',function() {
        $('html,body').animate({ 'scrollTop': 0 }, 600);
    });

});

//判断该商品是否已收藏
function checkFavour(item_id){
    if (!basetoken) return;

    $.ajax({   
        type: "GET",
        url: getJson + 'sysmember/member-favs/' + item_id,
        dataType: "json",
        headers: {
            "authorization": basetoken,  //  token参数 
        },
        data:{
          item_id: $('#item_id').val(),
          shop_id: shop_id
        },
        success:function(data){
          console.log(data)
          //  设置收藏按钮状态
          if(data.data == null){
            $(".cllectA").removeClass("cllectA").addClass("cllect").html("收藏").removeClass("cllectA-a");
          }
          else{
            $(".cllect").removeClass("cllect").addClass("cllectA").html("已收藏").addClass("cllectA-a");
            
          }
        }
    })
}

//点击收藏按钮
$(".cllect").click(function(){

    useId(); //判断用户id是否存在 不存在跳到登陆界面

    if($(".cllect").hasClass("cllect")){
        $(".cllect").removeClass("cllect").addClass("cllectA").html("已收藏").addClass("cllectA-a");

        //发送收藏请求
        $.ajax({   
            type: "POST",
            url: getJson + getCollect,
            dataType: "json",
            headers: {
                "authorization": basetoken,  //  token参数 
            },
            data:{
              item_id: $('#item_id').val(),
              shop_id: shop_id
            },
            success:function(data){
                function checkMark(){    // 定义成功提示
                  iosOverlay({
                    text: data.message + "!",
                    duration: 2e3,
                    icon: "images/check.png"
                  });
                  return false;
                }
                checkMark();    // 执行成功提示
              $('.cllectA').data('favId',data.data.fav_id);

            },
          });
        }
    else{
      console.log($('#item_id').val());
      //发送取消收藏请求
      var favId = $('#item_id').val();
      $.ajax({   
        type: "DELETE",
        url: getJson + 'sysmember/member-favs/' + favId,
        dataType: "json",
        headers: {
            "authorization": basetoken,  //  token参数 
        },
        success:function(data){
          if (data.code===0) {
            $(".cllectA").removeClass("cllectA").addClass("cllect").html("收藏").removeClass("cllectA-a");
          }else{
                function checkMark(){    // 定义成功提示
                    iosOverlay({
                        text: data.message + "!",
                        duration: 2e3,
                        icon: "images/check.png"
                    });
                    return false;
                }
            checkMark();    // 执行成功提示
          }
        },
      });
    }

  });