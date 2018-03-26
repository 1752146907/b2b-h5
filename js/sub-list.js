$(document).ready(function () {
//  获取售后列表接口
    var settings = {
        "async": false,
        "crossDomain": true,
        "url":getJson + afterSales + '?where=[["=","uid",'+uid+']]' ,
        "method": "GET",
        "headers": {
            "authorization": basetoken
        }
    }
    $.ajax(settings).done(function (response) {
        var item="";
        var str ="";
        function getLocalTime(nS) {
         return  new Date(parseInt(nS) * 1000).Format("yyyy-MM-dd hh:mm:ss");
        }
        $(response.data.aftersales).each(function (n, vale) {
            var getBack ="";
            var petBack ="";
            var afterType = ['','等待商家审核','等待平台打款','等待商品回寄','等待平台收货','等待平台审核','等待平台打款','商家拒绝退款','平台拒绝退款','退款成功']
            var total = vale.item_num*vale.item_price;
            if(vale.status==0) {
                getBack ="getBlock"
            }else {
                getBack ="getNone"
            }

            if(vale.status==3) {
                petBack ="getBlock"
            }else {
                petBack ="getNone"
            }
            item += "<div class='sub-serli'> <div class='sub-serlihd'>  <div class='sub-serlihd'><span class='sub-sername' >订单号："+vale.tid+"</span> <p>下单时间："+getLocalTime(vale.created)+"</p> </div></div>";
            item +="<ul><li class='clearfix'><div class='sub-serimg'><img src="+imgUrl+vale.item_thumb+" alt=''></div><div class='sub-serinfo'><h2>"+vale.item_title+"</h2><p class='clearfix'> <span>数量 x"+vale.item_num+"</span> <a class='"+getBack+"' href='service-submit.html?oid="+vale.oid+"&aftersales_id="+vale.aftersales_id+"'>申请售后</a></p></div> </li></ul> </div> ";
            str +="<li><div class='sub-findhd'> <span class='sub-findname'>订单号："+vale.tid+"</span><span class='sub-findstate'>"+afterType[vale.status]+"</span></div><div class='sub-findimg clearfix'><img "+imgUrl+vale.item_thumb+" alt=''> </div> <div class='sub-findbtm clearfix'><span>实付金额:￥"+total+"</span><a href='saleinformation.html?aftersales_id="+vale.aftersales_id+"&status="+vale.status+"&tid="+vale.tid+"&aftersales_bn="+vale.aftersales_bn+"'>查看售后详情</a> <a class='"+petBack+"' href='fill-info.html?aftersales_bn="+vale.aftersales_bn+"'>回寄商品</a></div></li>";
        });
        $('.sub-service').html(item);
        $('.sub-find ul').html(str);
    });



});