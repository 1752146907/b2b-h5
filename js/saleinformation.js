$(document).ready(function () {

    var Request = new UrlSearch(); //实例化
    var aftersales_id = Request.aftersales_id;
    var status = Request.status;
    var tid = Request.tid;
    var aftersales_bn = Request.aftersales_bn;

    $(".saleMater").hide();

  if(status==3) {
      $(".saleMater").hide();
      $(".fill-infobtn").show();
      $(".fill-infobtn a").attr("href",'fill-info.html?aftersales_bn='+aftersales_bn+'&tid='+tid)
  } else if ( status < 3) {
      $(".saleMater").hide();
  } else {
      $(".saleMater").show();
  }


        var settings = {
            "async": true,
            "crossDomain": true,
            "url":getJson + afterSales +"/"+aftersales_id ,
            "method": "GET",
            "headers": {
                "authorization": basetoken
            },
            "data": {
              "uid":uid
            }
        }
    function getLocalTime(nS) {
        return  new Date(parseInt(nS) * 1000).Format("yyyy-MM-dd hh:mm:ss");
    };
        $.ajax(settings).done(function (response) {
            var afterType = ['','等待商家审核','等待平台打款','等待商品回寄','等待平台收货','等待平台审核','等待平台打款','商家拒绝退款','平台拒绝退款','退款成功']
//     console.log(response)
            var type=['','只退款','退货退款'];
            var image = "";
            var total = response.data.item_num *  response.data.item_price;
            $('.saleTop b').html(afterType[status]);
            $('.sqsj em').html(getLocalTime(response.data.created))
            $('.tid span').html(response.data.tid);
            $('.aftersales_bn span').html(response.data.aftersales_bn);

            $('.aftersales_type span').html(type[response.data.aftersales_type]);
            $('.item_price span').html(total);
            $('.reason span').html(response.data.reason);
            $('.remark span').html(response.data.remark)
           var img =response.data.evidence_pic.split(",");
            $(img).each(function (n, vale) {
                image += "<a>"
                image +="<img src='"+imgUrl+vale+"?w=300'>"
                image +="</a>"
            });
            $('.saleImg').html(image);
        });




});