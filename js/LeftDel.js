$(document).ready(function(e) {
    // 设定每一行的宽度=屏幕宽度+按钮宽度
    $(".line-scroll-wrapper").width($(".line-wrapper").width() + $(".line-btn-delete").width());
    // 设定常规信息区域宽度=屏幕宽度
    $(".line-normal-wrapper").width($(".line-wrapper").width());
    // 设定文字部分宽度（为了实现文字过长时在末尾显示...）
    $(".line-normal-msg").width($(".line-normal-wrapper").width() - 280);
    // 获取所有行，对每一行设置监听
    var lines = $(".line-normal-wrapper");
    var len = lines.length; 
    var lastX, lastXForMobile;
    // 用于记录被按下的对象
    var pressedObj;  // 当前左滑的对象
    var lastLeftObj; // 上一个左滑的对象
    // 用于记录按下的点
    var start;

    $('.shoplist').on('touchstart','li',function(e){
        lastXForMobile = e.originalEvent.changedTouches[0].pageX;
        pressedObj = this; // 记录被按下的对象 
        // 记录开始按下时的点
        var touches = event.touches[0];
        start = { 
            x: touches.pageX, // 横坐标
            y: touches.pageY  // 纵坐标
        };
    })

    $('.shoplist').on('touchmove','a',function(e){
        // 计算划动过程中x和y的变化量
        var touches = e.originalEvent.touches[0];
        delta = {
            x: touches.pageX - start.x,
            y: touches.pageY - start.y
        };
        // 横向位移大于纵向位移，阻止纵向滚动
        if (Math.abs(delta.x) > Math.abs(delta.y)) {
            event.preventDefault();
        }
    })
    $('.shoplist').on('touchend','li',function(e){
        if (lastLeftObj && pressedObj != lastLeftObj) { // 点击除当前左滑对象之外的任意其他位置
                $(lastLeftObj).animate({marginLeft:"0"}, 80); // 右滑
                // lastLeftObj = null; // 清空上一个左滑的对象
            }
            var diffX = e.originalEvent.changedTouches[0].pageX - lastXForMobile;
            if (diffX < -150) {
                $(pressedObj).animate({marginLeft:"-62px"}, 80); // 左滑
                $(".shop_del").css("display", "none");  //清除上次的活动按钮
                lastLeftObj && lastLeftObj != pressedObj && 
                    $(lastLeftObj).animate({marginLeft:"0"}, 80); // 已经左滑状态的按钮右滑
                lastLeftObj = pressedObj; // 记录上一个左滑的对象
                $(this).find(".shop_del").css("display", "block");
            } 
            else if (diffX > 150) {
                if (pressedObj == lastLeftObj) {
                    $(pressedObj).animate({marginLeft:"0"}, 80); // 右滑
                    lastLeftObj = null; // 清空上一个左滑的对象
                    buttomdel = $(this).find(".shop_del").css("display", "none");
                }
            }
    });

});