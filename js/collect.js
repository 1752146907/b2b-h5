  $(function(){
    $.ajax({   
      type: "get",
        url: getJson + getCollect,
        dataType: "json",
        headers: {
            "authorization": basetoken,  //  token参数 
        },  //item_id= &shop_id= 
        success:function(data){
          for(var i = 0; i < data.data.items.length; i++){

            var lists  =     '<li class="ti clearfix">'
                lists +=     '<a href="shopinformation.html?item_id=' + data.data.items[i].item_id +'&shop_id=' + data.data.items[i].shop_id + '">',
                lists +=     '<div class="history-img"><img src='+imgUrl + data.data.items[i].image_thumb + ' alt=""></div>',
                lists +=     '<div class="history-info">',
                lists +=        '<div class="history-title">'+data.data.items[i].item_name+'</div>',
                lists +=      '<p></p>',
                lists +=        '<div class="history-price clearfix">',
                lists +=          '<span>¥ '+parseFloat(data.data.items[i].price)+'</span>',
                lists +=        '</div>',
                lists +=     '</div>',
                lists +=    '</a>',
                lists +=    '<button class="shop_del" value="'+data.data.items[i].item_id+'">删除</button>',
                lists +=  '</li>',

              $('.shoplist').append(lists); 
          }
            console.log(data);
        }
    });

    //发送删除请求
    $('.shoplist').on('click','.shop_del',function(e){
        item_id = $(this).val();
        var _this=$(this);
        $.ajax({
            url:getJson + 'sysmember/member-favs/' + item_id,
            type: "DELETE",
            headers: {
                "authorization": basetoken
            },success: function (data) {
                if(data.code == 0){
                  _this.parent('.ti').fadeOut();
                }else{
                  alert(data.message);
                }
            }
        });
    });

  });