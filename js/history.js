  $(document).ready(function(){
    $.ajax({
        type: "GET",
        url: getJson + getHistory,
        dataType: "json",
        headers: {
            "authorization": basetoken,  //  token参数 
        },success:function(data){
          for(i = 0; i < data.data.length; i++){  
            console.log(data)
            var lists  =     '<li class="ti clearfix">'
                lists +=     '<a href="shopinformation.html?item_id=' + data.data[i].item_id + "&shop_id=" + shop_id +'">',
                lists +=     '<div class="history-img"><img src='+imgUrl+data.data[i].image_thumb+' alt=""></div>',
                lists +=     '<div class="history-info">',
                lists +=        '<div class="history-title">'+data.data[i].title+'</div>',
                lists +=      '<p></p>',
                lists +=        '<div class="history-price clearfix">',
                lists +=          '<span>¥ '+parseFloat(data.data[i].price)+'</span>',
                lists +=        '</div>',
                lists +=     '</div>',
                lists +=    '</a>',
                lists +=    '<button class="shop_del" value="'+  data.data[i].history_id +'">删除</button>',
                lists +=  '</li>',
            $('.shoplist').append(lists); 
          }
          console.log($("shop_del"))
        },
        Error:function(data){
          alert("出现错误！");
        }
    });

    //发送删除请求
    $('.shoplist').on('click','.shop_del',function(e){
        history_id = $(this).val();
        var _this=$(this);
        $.ajax({
            url:getJson + getHistory + '/' + history_id,
            type: "DELETE",
            headers: {
                "authorization": basetoken
            },success: function (data) {
                if(data.status == 200){
                    _this.parents('.ti').fadeOut();
                }
            }
        });
    });

  });