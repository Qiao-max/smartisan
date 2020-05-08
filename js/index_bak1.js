onload = function(){
	//吸顶效果
	//获取头部的高度
	var  topHeight = $(".head").height();
	
	//滚动条事件
	$(window).scroll(function(){
		//当页面滚走的距离 大于 头部的高度时   开始吸顶
		//获取页面滚走的距离
		var  sTop = $(document).scrollTop();
		if( sTop > topHeight && $(".banner").css("paddingTop") != "16px" ){ //满足吸顶条件
			//bug ：当频繁的操作滚动条时 ， 只要满足条件 下面的代码就会频繁的被执行 
			//解决 ： 在条件上 添加一个限制条件 
			$(".banner").css({
				position : "fixed",
				top : -60 , 
				paddingTop : 16 ,  //由于吸顶后高度值变小 ，将上下填充变小
				paddingBottom :16
			}).animate( { top : 0 } , 500 )
			
			
			//吸顶后 ， 导航右侧的表单消失了（隐藏）
			$(".ban-right").hide();
			
			//在原表单的位置 显示用户头像--克隆
			$(".head").find(".right").clone().appendTo( ".ban" );
			
			//吸顶后 鼠标移入移出到用户头像时，操作 .con_use 的显示和隐藏
			$(".user").hover( function(){
				$(".con_use").show();
			},function(){
				$(".con_use").hide();
			} )
			
			//鼠标移入到下面的容器中  显示和隐藏自己本身
			$(".con_use").hover( function(){
				$(this).show();
			},function(){
				$(this).hide();
			} )
			
		}else if( sTop <= topHeight && $(".banner").css("paddingTop") == "16px" ){
			//当满足这个条件  导航恢复到原来的位置上
			$(".banner").css({
				position : "absolute",
				top : topHeight , 
				paddingTop : 23 , 
				paddingBottom : 23
			})
			
			//恢复后  将右侧表单显示 同时  将克隆的用户头像删除
			$(".ban-right").show();
			$(".ban").find( ".right" ).remove();
		}
	})
	
	
	//实现主页的淡入淡出轮播图特效 
	
	//要操作的轮播图
	//get()方法将jquery元素转成了dom元素 
	var swiperImg = $(".swiper-container").children().get(0).children;
	var dot = $(".swiper-container").children().get(1).children;
	var timer = null;//定时器
	var index = 0;//控制小圆点和图片对应关系
	timer = setInterval( autoPlay , 2000 );
	//轮播功能的具体实现
	function autoPlay(){
		index++;
		if( index == dot.length ){
			index = 0;//防止index越界问题
		}
		//操作index对应的小圆点的样式变化
		//将dom元素 dot 转成jq对象  $(dot)
		$(dot).eq( index ).addClass( "swiper-pagination-bullet-active" )
					      .siblings()
					      .removeClass( "swiper-pagination-bullet-active" );
		$(swiperImg).eq( index )
		 			.fadeIn( 1500 )
		 			.siblings()
		 			.fadeOut( 1500 );
	}
}
