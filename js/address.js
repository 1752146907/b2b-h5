
$(function(){
    $.ajax({
        type:'get',
        url: getJson + address,
        headers:{
            "authorization": basetoken
        },
        success:function(data){
            var items = "";
            $(data.data).each(function(n,val){
                items += '<li class="clearfix">';
                items += '<label class="shop-carcheck shop-carliall">';
                items += '<input type="radio" name="address" '+(val.is_default?"checked":"")+'>';
                items += '<span></span>';
                items += '</label>';
                items += '<div class="address-hd">';
                items += '<div class="clearfix">'+ val.name;
                items += '<span>'+val.mobile+'</span>';
                items += '</div>';
                items += '<p>'+val.state+val.city+val.town+val.address+'</p>';
                items += '</div>';
                items += '<a class="edit" addrid='+val.addr_id+' href="javascript:;">编辑</a>';
                items += '</li>';
            });
            $('.address ul').append(items);
            $('.edit').on('click',function(){
                location.href = 'address-edit.html?addrid='+ $(this).attr('addrid');
            });

            //更新地址
            $('.ascertain').on('click',function(){
                var address_obj={};
                var radio=$('input[type=radio]');
                radio.each(function(i,el){
                    if($(el).prop('checked')){
                        var parent=$(el).parents('li');
                        address_obj.addr_id=parent.find('.edit').attr('addrid')
                        address_obj.name=parent.find('div.address-hd div').html();
                        address_obj.addressShop=parent.find('p').html();
                        address_obj=JSON.stringify(address_obj);

                        sessionStorage.setItem('address_obj', address_obj);
                        // sessionStorage.address_obj=address_obj;
                    }

                })
                var orderConfirmUrl = sessionStorage.getItem('order_confirm_url');
                if (orderConfirmUrl) {
                    window.location.href = orderConfirmUrl;    
                } else {
                    history.go(-1);
                }
            })
        }
    });
    
});
