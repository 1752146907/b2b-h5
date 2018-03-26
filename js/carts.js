
$(function(){
    //获取购物车的数量
    if(sessionStorage.getItem("token")==null) {
        $('.bot ul li em').hide();

    }else {
        $('.bot ul li em').show();
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
    if(sessionStorage.getItem("token")) {

        //弹框
        $('.shop-del').on('click', function () {
            $('.shop-carshade').show();
        });
        $('.model-btn-no').on('click', function () {
            $('.shop-carshade').hide();
        });

        var total;
        var totalnum;

        $.ajax({
            type: "get",
            url: getJson + carts,
            dataType: "json",
            headers: {
                "authorization": basetoken
            },
            success: function (data) {
                console.log(data);
                //if(data.data[shop_id]){
                var items = '';
                var arr = [];
                var shopid = [];
                var skuid = [];    
                for (var i in data.data) {
                    items += "<li>";
                    items += "<div class='shop-carhead clearfix'>"
                    items += "<label class='shop-carcheck shop-carliall'>"
                    items += "<input type='checkbox'><span></span>";
                    items += "</label>";
                    items += "<a href=''>" + data.data[i].shop.shop_name + "</a>";
                    items += "</div>";
                    for (var j = 0; j < data.data[i].items.length; j++) {
                        items += "<div class='shop-carli clearfix'>"
                        items += '<label class="shop-carcheck">'
                        items += '<input '+ (data.data[i].items[j].is_checked ? "" : "checked") +' skuid="'+ data.data[i].items[j].sku_id +'" itemid="'+ data.data[i].items[j].item_id +'" num="'+ data.data[i].items[j].quantity +'" shopid="'+ data.data[i].items[j].shop_id +'" id="' + data.data[i].items[j].cart_id + '" type="checkbox">'
                        items += '<span></span>'
                        items += '</label>'
                        items += '<div class="shop-carimg">'
                        items += '<img src="' +imgUrl+ data.data[i].items[j].image_thumb + '" alt="">'
                        items += '</div>'
                        items += '<div class="shop-carinfo">'
                        items += '<a href="shopinformation.html?item_id=' + data.data[i].items[j].item_id  + "&shop_id=" + data.data[i].items[j].shop_id + '">'
                        items += '<div class="shop-cartitle">' + data.data[i].items[j].title + '</div>'
                        items += '</a>'
                        items += '<p> </p>'
                        items += '<div class="shop-carprice clearfix">'
                        items += '<span class="shop-carnum">¥ <span class="shop-flnum">' + data.data[i].items[j].price.toFixed(2) + '</span></span>'
                        items += '<div class="shop-caredit">'
                        items += '<a class="shop-carminus min" href="javascript:;">—</a>'
                        items += '<input class="text_box" type="text" value=" ' + data.data[i].items[j].quantity + '"/>'
                        items += '<a class="shop-caradd add" href="javascript:;">+</a>'
                        items += "</div>"
                        items += "</div>"
                        items += "</div>"
                        items += "</div>"
                    }
                    items += "</li>";
                }

                $('.shop-carlist').append(items);

                //购物车数量加减
                $(".add").on('click', function () {
                    var t = $(this).parent().find('.text_box');
                    t.val(parseInt(t.val()) + 1);
                    var aid = $(this).parents('.shop-carli').find('.shop-carcheck input').prop('id');
                    console.log(aid);

                    $.ajax({
                        type: 'PATCH',
                        url: getJson + carts + '/' + aid,
                        headers: {
                            "authorization": basetoken
                        },
                        data: {
                            'quantity': t.val()
                        },
                        success: function (data) {
                            //console.log(data);
                        }
                    });

                    if($(this).parents('.shop-carli').find('.shop-carcheck input').prop('checked')){
                        var addtom = parseFloat($('.shop-cartom').html()) + parseFloat($(this).parents('.shop-carprice').find('.shop-flnum').html());
                        $('.shop-cartom').html(addtom);
                    }
                })

                $(".min").on('click', function () {
                    var t = $(this).parent().find('.text_box');
                    t.val(parseInt(t.val()) - 1)
                    if (parseInt(t.val()) < 1) {
                        t.val(1);
                        alert("亲，不能再减了哦");
                    }
                    var aid = $(this).parents('.shop-carli').find('.shop-carcheck input').prop('id');

                    if(parseInt(t.val()) > 1){
                        $.ajax({
                            type: 'PATCH',
                            url: getJson + carts + '/' + aid,
                            headers: {
                                "authorization": basetoken
                            },
                            data: {
                                'quantity': t.val()
                            },
                            success: function (data) {
                                console.log(data);
                            },
                            error: function (data) {
                                console.log(data);
                            }
                        });
                    }

                    if($(this).parents('.shop-carli').find('.shop-carcheck input').prop('checked')){
                        var addtom = parseFloat($('.shop-cartom').html()) - parseFloat($(this).parents('.shop-carprice').find('.shop-flnum').html());
                        $('.shop-cartom').html(addtom);
                    }
                })

                //店铺全选
                $('.shop-carliall input').on('click', function () {

                    var shoptom = parseFloat($('.shop-cartom').html());

                    if ($(this).prop('checked')) {

                        $(this).parents('li').find('.shop-carli .shop-carcheck input').prop("checked", true);
                        for(var i=0;i<$(this).parents('li').find('.shop-carli').length;i++){
                            shoptom += $(this).parents('li').find('.shop-carli').eq(i).find('.shop-flnum').html() * $(this).parents('li').find('.shop-carli').eq(i).find('.text_box').val();
                        }

                    } else {
                        $(this).parents('li').find('.shop-carli .shop-carcheck input').prop("checked", false);
                        for(var i=0;i<$(this).parents('li').find('.shop-carli').length;i++){
                            shoptom -= $(this).parents('li').find('.shop-carli').eq(i).find('.shop-flnum').html() * $(this).parents('li').find('.shop-carli').eq(i).find('.text_box').val();
                        }

                    }
                    $('.shop-cartom').html(shoptom);

                });
                //商品编辑
                $('.shop-carlink').on('click', function () {
                    if ($(this).html() == '编辑') {
                        $(this).html('完成');
                        $('.shop-caredit').hide();
                        $('.shop-del').show();
                        $('.shop-carbtn').hide();
                        total = $('.shop-cartotalinfo').html();
                        $('.shop-cartotalinfo').html('全选');
                    } else {
                        $(this).html('编辑');
                        $('.shop-caredit').show();
                        $('.shop-carbtn').show();
                        $('.shop-del').hide();
                        $('.shop-cartotalinfo').html(total);
                    }
                });
                //商品选中
                $('.shop-carli .shop-carcheck input').on('change', function () {
                    if($(this).parents('li').find('.shop-carli .shop-carcheck input:checked').length == $(this).parents('li').find('.shop-carli').length){
                        $(this).parents('li').find('.shop-carhead .shop-carcheck input').prop('checked',true);
                    }else{
                        $(this).parents('li').find('.shop-carhead .shop-carcheck input').prop('checked',false);
                    }

                    if($('.shop-carli .shop-carcheck input:checked').length == $('.shop-carli').length){
                        $('.shop-cartotal .shop-carcheck input').prop('checked',true);
                    }else{
                        $('.shop-cartotal .shop-carcheck input').prop('checked',false);
                    }
                    var shoptom = 0;
                    if($(this).prop('checked')){
                        shoptom = parseFloat($('.shop-cartom').html()) + $(this).parents('.shop-carli').find('.shop-flnum').html() * $(this).parents('.shop-carli').find('.text_box').val();

                        $('.shop-cartom').html(shoptom);
                    }else{
                        shoptom = parseFloat($('.shop-cartom').html()) - $(this).parents('.shop-carli').find('.shop-flnum').html() * $(this).parents('.shop-carli').find('.text_box').val();

                        $('.shop-cartom').html(shoptom);
                    }
                });

                //全选
                $('.shop-cartotal .shop-carcheck input').on('click', function () {
                    var shoptom = 0;
                    if ($(this).prop('checked')) {
                        $('.shop-carcheck input').prop("checked", true);
                        for(var i=0;i<$('.shop-carli').length;i++){
                            shoptom += $('.shop-carli').eq(i).find('.shop-flnum').html() * $('.shop-carli').eq(i).find('.text_box').val();
                        }
                    } else {
                        $('.shop-carcheck input').prop("checked", false);
                        shoptom = 0;
                    }
                    $('.shop-cartom').html(shoptom);
                });

                //删除
                $('.model-btn-yes').on('click', function () {
                    for (var n = 0; n < $('.shop-carli').length; n++) {
                        if ($('.shop-carli').eq(n).find('.shop-carcheck input').prop('checked')) {
                            arr.push($('.shop-carli').eq(n).find('.shop-carcheck input').prop('id'));
                        }
                    }
                    var newarr = arr.join();

                    $.ajax({
                        type: 'DELETE',
                        url: getJson + carts + '/' + newarr,
                        headers: {
                            "authorization": basetoken
                        },
                        success: function (data) {
                            console.log(data);
                            if (data.code == 0) {
                                $(".shop-carshade").css("display","none");
                                document.location.reload();
                            };
                        }
                    });
                });

                //结算
                $('.shop-carbtn').on('click', function () {
                    if($(".shop-cartom").html() == 0){alert('亲，您还没勾选商品哦！')}
                    else{
                        var arrsub = [];
                        var skuarr = [];
                        for (var n = 0; n < $('.shop-carli').length; n++) {
                            if ($('.shop-carli').eq(n).find('.shop-carcheck input').prop('checked')) {
                                // shopid.push($('.shop-carli').eq(n).find('.shop-carcheck input').attr('shopid'));
                                // skuid.push($('.shop-carli').eq(n).find('.shop-carcheck input').attr('skuid'));
                                var sub = [];
                                var arrnum = 0;
                                sub[arrnum]=($('.shop-carli').eq(n).find('.shop-carcheck input').attr('shopid'));
                                sub[arrnum+1]=($('.shop-carli').eq(n).find('.shop-carcheck input').attr('skuid'));
                                sub[arrnum+2]=($('.shop-carli').eq(n).find('.shop-carcheck input').attr('num'));
                                sub[arrnum+3]=($('.shop-carli').eq(n).find('.shop-carcheck input').attr('itemid'));
                                skuarr.push($('.shop-carli').eq(n).find('.shop-carcheck input').attr('skuid'));
                                //  console.log(sub);
                                arrsub.push(sub);
                             }
                        }
                        var itemInfo= [];
                        for(var i=0;i<arrsub.length;i++){
                            var newsuba =arrsub[i].join(',');
                            itemInfo.push(newsuba);
                        }
                        var items = itemInfo.join('|');
                        location.href = 'shop-submit.html?shopItem='+items +'&sku_id='+skuarr;
                    }
                });

                //默认合计
                var totaln = 0;
                for (var n = 0; n < $('.shop-carli').length; n++) {
                    if ($('.shop-carli').eq(n).find('.shop-carcheck input').prop('checked')) {
                        totaln += $('.shop-carli').eq(n).find('.shop-flnum').html()*$('.shop-carli').eq(n).find('.text_box').val();
                    }
                }

                $('.shop-cartom').html(totaln);
                
                //  } else {
                //     $('.shop-carnoY').show();
                //     $('.header .right').hide();
                //     $('.shop-carnoY a').attr('href','shop.html?shop_id='+shop_id);
                // }

            },
            error:function(xhr){
                console.log(xhr);
            }
        });
    }else{
        $('.shop-carno').show();
        $('.shop-car').hide();
        $('.shop-cartotal').hide();
        $('.header .right').hide();
        $('.shop-carnoN .shop-carnowrap a').attr('href','shop.html?shop_id='+shop_id);

    }
    Array.prototype.unique3 = function(){
        var res = [];
        var json = {};
        for(var i = 0; i < this.length; i++){
            if(!json[this[i]]){
                res.push(this[i]);
                json[this[i]] = 1;
            }
        }
        return res;
    }
    $('.bot li a.index').attr('href','shop.html?shop_id='+shop_id);
    $('.bot li a.my').attr('href','my.html?shop_id='+shop_id); 
});
