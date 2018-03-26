

$(function(){
    var statename="";
    var cityname="";
    var towname="";
    var regionid = 0;
    var checkdef = 0;
    $.ajax({
        type:'get',
        url:getJson + address +'/'+ GetQueryString('addrid'),
        headers:{
            "authorization": basetoken
        },
        success:function(data){
            console.log(data);
            statename= data.data.state;
            cityname= data.data.city;
            towname= data.data.town;
            regionid= data.data.region_id;
            var editaddress = data.data.state+'-'+data.data.city+'-'+data.data.town;
            console.log(editaddress);
            $('.editname').val(data.data.name);
            $('.editphone').val(data.data.mobile);
            $('.address-adres').html(editaddress);
            $('.address-adres').css('color','#000');
            if(data.data.is_default){
                $('.editdef').prop('checked','true');
            }
            $('.editaddress').val(data.data.address);

            checkdef = data.data.is_default;
            $('.shop-checkdef').on('click',function(){
                if($(this).find('input').prop('checked')){
                    checkdef = 1;
                }else{
                    checkdef = 0;
                }
            });


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
        if($('.address-adres').html() == '请选择'){
            alert('请选择地区');
            return false;
        }
        if($('.addinfo').val() == ''){
            alert('地址不能为空');
            return false;
        }
        console.log(statename);
        console.log(cityname);
        console.log(towname);
        console.log(regionid);
        console.log(checkdef);
        $.ajax({
            type: 'PATCH',
            url: getJson + address+'/'+ GetQueryString('addrid'),
            headers: {
                "authorization": basetoken
            },
            data:{
                name: $('.editname').val(),
                mobile:$('.editphone').val(),
                is_default :checkdef,
                country:0,
                state:statename,
                city:cityname,
                town:towname,
                region_id:regionid,
                address:$('.editaddress').val()
            },
            success:function(data){

                if(data.code == 0){
                    // location.href = "shop-submit.html";
                    history.go(-2)
                }else{
                    alert(data.message);
                }
            }

        });
    });
    //删除
    $('.del').on('click',function(){
        $.ajax({
            type:'DELETE',
            url:getJson + address +'/'+ GetQueryString('addrid'),
            headers:{
                "authorization": basetoken
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
    //地址栏参数获取
    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
});