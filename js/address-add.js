

// $.ajax({
//     type:'post',
//     url:getJson + address,
//     headers:{
//         "authorization": basetoken
//     },
//     data:{
//         name: $('.addname').val(),
//         tel:$('.addtel').val(),
//         is_default :1,
//         state:1,
//         city:1,
//         town:1,
//         region_id:1,
//         address:$('.addinfo').val()
//     },
//     success:function(){
//
//     }
// });
$(function(){
    var statename="";
    var cityname="";
    var towname="";
    var regionid = 0;
    var isselect = false;
    $('.address-adres').on('click',function() {
        $.ajax({
            type: 'get',
            url: getJson + state,
            headers: {
                "authorization": basetoken
            },
            success: function (data) {
                console.log(data.data);
                var items = "";
                for (var i in data.data) {
                    items += '<li regionid="' + data.data[i].region_id + '">' + data.data[i].region_name + '</li>';
                }
                console.log(items);
                $('.address-state ul').append(items);
                $('.address-state').show();
                $('.address-state').animate({'left':'0'});
                $('.address-state li').on('click', function () {
                    statename = $(this).html();
                    $.ajax({
                        type: 'get',
                        url: getJson + state,
                        headers: {
                            "authorization": basetoken
                        },
                        data: {
                            region_id: $(this).attr('regionid')
                        },
                        success: function (data) {
                            var city = "";
                            for (var i in data.data) {
                                city += '<li regionid="' + data.data[i].region_id + '">' + data.data[i].region_name + '</li>';
                            }
                            $('.address-city ul').append(city);
                            $('.address-city').show();
                            $('.address-city').animate({'left':'0'});
                            $('.address-city li').on('click', function () {
                                cityname = $(this).html();
                                $.ajax({
                                    type: 'get',
                                    url: getJson + state,
                                    headers: {
                                        "authorization": basetoken
                                    },
                                    data: {
                                        region_id: $(this).attr('regionid')
                                    },
                                    success: function (data) {
                                        var town = "";
                                        for (var i in data.data) {
                                            town += '<li regionid="' + data.data[i].region_id + '">' + data.data[i].region_name + '</li>';
                                        }
                                        $('.address-town ul').append(town);
                                        $('.address-town').show();
                                        $('.address-town').animate({'left':'0'});
                                        $('.address-town li').on('click',function(){
                                            towname = $(this).html();
                                            regionid = $(this).attr('regionid');
                                            $('.address-adres').css('color','#000');
                                            $('.address-town').css('left','100%');
                                            $('.address-city').css('left','100%');
                                            $('.address-state').css('left','100%');
                                            $('.address-adres').html(statename + '-' + cityname + '-' +towname);
                                            isselect = true;
                                        });
                                    }
                                });
                            });
                        }
                    });
                });
                $('.address-state .address-back a').on('click',function(){
                    $('.address-state').hide();
                    $('.address-state').css({'left':'100%'});
                });
                $('.address-city .address-back a').on('click',function(){
                    $('.address-city').hide();
                    $('.address-city').css({'left':'100%'});
                });
                $('.address-town .address-back a').on('click',function(){
                    $('.address-town').hide();
                    $('.address-town').css({'left':'100%'});
                });
            }

        });
    });
    var checkdef = 0;
    $('.shop-checkdef').on('click',function(){
        if($(this).find('input').prop('checked')){
            checkdef = 1;
        }else{
            checkdef = 0;
        }
    });
    $('.address-btn').on('click',function(){
        if($('.addname').val() == ''){
            alert('收货人姓名不能为空');
            return false;
        }
        if(!(/^1[34578]\d{9}$/.test($('.addtel').val())) && $('.addtel').val() == '') {
            alert('手机号填写有误');
            return false;
        }
        if(!isselect){
            alert('请选择地区');
            return false;
        }
        if($('.addinfo').val() == ''){
            alert('地址不能为空');
            return false;
        }
        $.ajax({
            type: 'post',
            url: getJson + address,
            headers: {
                "authorization": basetoken
            },
            data:{
                name: $('.addname').val(),
                mobile:$('.addtel').val(),
                is_default :checkdef,
                country:0,
                state:statename,
                city:cityname,
                town:towname,
                region_id:regionid,
                address:$('.addinfo').val()
            },
            success:function(data){

                if(data.code == 0){
                    location.href = "address.html";
                }else{
                    alert(data.message);
                }
            }

        });
    });
});