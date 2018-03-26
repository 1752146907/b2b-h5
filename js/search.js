

$(function(){
    var shopid = sessionStorage.getItem('shop_id');
    $('.top-back').attr('href','shop.html?shop_id='+shopid);

    //历史记录存储
    var historyli = '';
    var history = [];
    var hisold = [];
    if(sessionStorage.getItem('history')){
        history = sessionStorage.getItem('history');
        hisold = history.split(',');
        for(var j=0;j<hisold.length;j++){
            historyli += '<li>';
            historyli += '<a href="javascript:;">'+hisold[j]+'</a>';
            historyli += '</li>';
        }
    }
    $('.search-historyli').html(historyli);

    //点击搜索
    $('.searchbtn').on('click',function(){
        if($('.shop-search input').val() == ''){
            alert('请输入商品名称');
            return false;
        }
        $.ajax({
            type:'get',
            url:getJson+getShopItem+'?shop_id='+'1' +'&title=' + $('.shop-search input').val(),
            success:function(data){
                console.log(data.data.items); 
                if(data.data.length <= 0){
                    $('.search-no').show();
                }else{
                    $('.search-no').hide();
                }
                $('.searchbtn').hide();
                $('.shop-search input').animate({'width':'8.373333rem'});
                $('.search-list ul').html('');
                var items = '';
                console.log(data.data)
                if(data.data.items.length<=0){
                    alert("抱歉，暂无该商品,你可以换个关键字");
                }
                for (var i=0; i<data.data.items.length; i++) {
                    items += '<li class="clearfix">';
                    items += '<a href="shopinformation.html?item_id=' + data.data.items[i].item_id  + "&shop_id=" + data.data.items[i].shop_id + '">';
                    items += '<div class="shop-carimg">';
                    items += '<img src="'+imgUrl+ data.data.items[i].image_thumb +'">';
                    items += '</div>';
                    items += '<div class="shop-carinfo">';
                    items += '<div class="shop-cartitle">'+data.data.items[i].title+'</div>';
                    items += '<p>'+data.data.items[i].cat_name+'</p>';
                    items += '<div class="shop-carprice clearfix">';
                    items += '<span class="shop-carnum">¥ '+data.data.items[i].price+'</span>';
                    items += '</div>';
                    items += '</div>';
                    items += '</a>'; 
                    items += '</li>';
                }
                console.log()
                $('.search-list ul').append(items);
                $('.search-list').show();
                $('.search-history').hide();
            }
        });
        for(var n=0;n<hisold.length;n++){
            if(hisold[n] == $('.shop-search input').val()){
                return;
            }
        }
        hisold.unshift($('.shop-search input').val());
        var hisnew = hisold.join(',');
        sessionStorage.setItem('history',hisnew);
    });

    //显示历史记录
    $('.shop-search input').on('focus',function(){
        $('.search-no').hide();
        $('.shop-search input').animate({'width':'7.573333rem'},function(){
            $('.searchbtn').show();
        });
        $('.search-history').show();
        $('.search-list').hide();
        if(sessionStorage.getItem('history')){
            $('.search-historyli').html('');
            historyli = '';
            history = sessionStorage.getItem('history');
            hisold = history.split(',');
            for(var j=0;j<hisold.length;j++){
                historyli += '<li>';
                historyli += '<a href="javascript:;">'+hisold[j]+'</a>';
                historyli += '</li>';
            }
            $('.search-historyli').html(historyli);
        }
        //历史记录查询
        $('.search-historyli a').on('click',searhis);
    });
    //历史记录查询
    $('.search-historyli a').on('click',searhis);
    function searhis() {
        $('.shop-search input').val($(this).html());
        $.ajax({
            type:'get',
            url:getJson+getShopItem+'?shop_id='+'1' +'&title=' + $(this).html(),
            success:function(data){
                $('.searchbtn').hide();
                $('.shop-search input').animate({'width':'8.373333rem'});
                $('.search-list ul').html('');
                var items = '';
                console.log(data.data);
                if(data.data.items.length<=0){
                    alert("抱歉，暂无该商品，你可以换个关键字");
                }
                for (var i=0; i<data.data.items.length; i++) {
                    items += '<li class="clearfix">';
                    items += '<a href="shopinformation.html?item_id=' + data.data.items[i].item_id  + "&shop_id=" + data.data.items[i].shop_id + '">';
                    items += '<div class="shop-carimg">';
                    items += '<img src="'+imgUrl+ data.data.items[i].image_thumb+'">';
                    items += '</div>';
                    items += '<div class="shop-carinfo">';
                    items += '<div class="shop-cartitle">'+data.data.items[i].title+'</div>';
                    items += '<p>'+data.data.items[i].cat_name+'</p>';
                    items += '<div class="shop-carprice clearfix">';
                    items += '<span class="shop-carnum">¥ '+data.data.items[i].price+'</span>';
                    items += '</div>';
                    items += '</div>';
                    items += '</a>';
                    items += '</li>';
                }
                $('.search-list ul').append(items);
                $('.search-list').show();
                $('.search-history').hide();
                console.log();
            }
        });
    }
});
