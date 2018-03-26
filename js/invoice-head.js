$(function () {

    $('.invoice-def').on('click',function(){
        $('.invoice-radiohead').show();
        $('.invoice-input').hide();
    });
    $('.invoice-zzs').on('click',function(){
        $('.invoice-input').show();
        $('.invoice-radiohead').hide();
    });
    $('.invoice-no').on('click',function(){
        $('.invoice-input').hide();
        $('.invoice-radiohead').hide();
    });
    $('.invoice-personal').on('click',function(){
        $('.invoice-companyhide').hide();
    });
    $('.invoice-company').on('click',function(){
        $('.invoice-companyhide').show();
    });

    //修改发票
    var selectedInvoiceType = sessionStorage.getItem('invoice-info');
    if (selectedInvoiceType == 0) {
        //普通发票
        $('.invoice-def input').attr('checked', 'checked');
        $('.invoice-radiohead').show();
        $('.invoice-input').hide();
        //公司
        if (sessionStorage.getItem('invoice_title_type') == '2') {
            $(".invoice-company").trigger("click");
        } else {
            $(".invoice-personal").trigger("click");
        }
    } else if (selectedInvoiceType == 1) {
        //增值税
        $('.invoice-zzs input').attr('checked', 'checked');
        $('.invoice-input').show();
        $('.invoice-radiohead').hide();
    } else if (selectedInvoiceType == 2) {
        //不需要发票
        $('.invoice-no input').attr('checked', 'checked');
        $('.invoice-input').hide();
        $('.invoice-radiohead').hide();
    }
    $('.qyName').val(sessionStorage.getItem('invoice_name'));
    $('.qyContent').val(sessionStorage.getItem('invoice_content'));
    $('.contany').val(sessionStorage.getItem('taxpayer'));
    $('.taxpayer').val(sessionStorage.getItem('taxpayer_id'));
    $('.bank').val(sessionStorage.getItem('taxpayer_bank'));
    $('.account').val(sessionStorage.getItem('taxpayer_account'));
    $('.call').val(sessionStorage.getItem('taxpayer_call'));
    $('.addr').val(sessionStorage.getItem('taxpayer_addr'));


    $('.ptBtn').on('click',function(){
        var name = "";
        var content ="";
        console.log($('.invoice-radioinfo input:checked').parents('label').index());
        sessionStorage.setItem('invoice-info',$('.invoice-radioinfo input:checked').parents('label').index());
        switch ($('.invoice-radioinfo input:checked').parents('label').index()){
            case 0:
                if($('.invoice-personal input').prop('checked')){
                    name="个人";
                    content = 0;
                    sessionStorage.setItem('invoice_title_type', '1');
                }else{
                    if( $(".qyName").val()==null ||  $(".qyName").val()==""){
                        alert("请填写公司名称");
                        return false;
                    }else {
                        name= $(".qyName").val();
                    }
                    if( $(".qyContent").val()==null ||  $(".qyContent").val()==""){
                        alert("请填写发票内容");
                        return false;
                    }else {
                        content= $(".qyContent").val();
                    }
                    sessionStorage.setItem('invoice_title_type', '2');
                }
                $.ajax({
                    "async": true,
                    "crossDomain": true,
                    "url":getJson + invoice ,
                    "method": "POST",
                    "headers": {
                        "authorization": basetoken
                    },
                    "data": {
                        "uid":uid,
                        "kind":"2",
                        "name":name,
                        "content":content
                    },
                    success:function(response){
                        if(response.code=="0" ) {
                            if (sessionStorage.getItem('invoice_title_type') == '2') {
                                sessionStorage.setItem('invoice_name',name);
                                sessionStorage.setItem('invoice_content',content);
                            }
                            var orderConfirmUrl = sessionStorage.getItem('order_confirm_url');
                            if (orderConfirmUrl) {
                                window.location.href = orderConfirmUrl;    
                            } else {
                                history.go(-1);
                            }
                        } else {
                            alert(response.message);
                            window.location.href="login.html"

                        }
                    }
                });
                break;
            case 1:
                if($('.contany').val()==""){
                    alert('请填写单位名称');
                    return false
                }
                if($('.taxpayer').val()==""){
                    alert('请输入纳税人识别号');
                    return false
                }
                console.log($('.taxpayer').val().length);
                if ($('.taxpayer').val().length !=18) {
                    alert('纳税人识别号长度必须在18位');
                    return false;
                }
                if($('.bank').val()==""){
                    alert('请输入开户银行');
                    return false
                }
                if($('.account').val()==""){
                    alert('请输入银行账号');
                    return false
                }
                if ($('.account').val().length < 16 || $('.account').val().length > 19) {
                    alert('银行卡号长度必须在16到19之间');
                    return false;
                }
                if($('.addr').val()==""){
                    alert('请输入公司地址');
                    return false
                }
                if($('.call').val()==""){
                    alert('请输入公司电话');
                    return false
                }
                if ($('.call').val() < 8 || $('.call').val().length > 11) {
                    alert('公司电话长度必须在16到19之间');
                    return false;
                }
                $.ajax({
                    "async": true,
                    "crossDomain": true,
                    "url":getJson + invoice ,
                    "method": "POST",
                    "headers": {
                        "authorization": basetoken
                    },
                    "data": {
                        "uid":uid,
                        "kind":"3",
                        "content":"0",
                        "taxpayer":$('.contany').val(),
                        "taxpayer_id":$('.taxpayer').val(),
                        "taxpayer_bank":$('.bank').val(),
                        "taxpayer_account":$('.account').val(),
                        "taxpayer_call":$('.call').val(),
                        "taxpayer_addr":$('.addr').val()

                    },
                    success:function(response){
                        if(response.code=="0" ) {
                            sessionStorage.setItem('taxpayer',$('.contany').val());
                            sessionStorage.setItem('taxpayer_id',$('.taxpayer').val());
                            sessionStorage.setItem('taxpayer_bank',$('.bank').val());
                            sessionStorage.setItem('taxpayer_account',$('.account').val());
                            sessionStorage.setItem('taxpayer_call',$('.call').val());
                            sessionStorage.setItem('taxpayer_addr',$('.addr').val());
                            var orderConfirmUrl = sessionStorage.getItem('order_confirm_url');
                            if (orderConfirmUrl) {
                                window.location.href = orderConfirmUrl;    
                            } else {
                                history.go(-1);
                            }
                        } else {
                            alert(response.message);
                            window.location.href="login.html"

                        }
                    }
                });
                break;
            case 2:
                var orderConfirmUrl = sessionStorage.getItem('order_confirm_url');
                if (orderConfirmUrl) {
                    window.location.href = orderConfirmUrl;    
                } else {
                    history.go(-1);
                }
                break;
        }
    });
});


