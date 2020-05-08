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
			}).stop().animate( { top : 0 } , 500 )
			
			
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
	/*var swiperImg = $(".swiper-container").children().get(0).children;
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
	//鼠标移入移出 轮播图所在的大容器时，停止轮播  离开时  启动轮播
	$(".con-swiper").mouseover(function(){
		clearInterval( timer );
	}).mouseout(function(){
		timer = setInterval( autoPlay , 2000 );
	})
	//鼠标点击小圆点 ， 实现点击控制轮播
	$(dot).click(function(){
		//显示小圆点对应的图片
		index = $(this).index()-1;//获取当前操作的小圆点的下标
		autoPlay();
	})*/
	//使用swiper插件完成轮播图的切换效果
	var mySwiper = new Swiper( ".swiper-container" , {
		noSwiper : true , 
		autoplay : {
			delay : 3000,
			disableOnInteraction : false
		},
		preventInteractionOnTransition :true,
		effect : "fade",
		fadeEffect : {
			crossFade :false
		},
		pagination : {
			el : ".swiper-pagination",
			clickable : true
		}
	} )
	
	
	//热门商品  区域 实现  右侧按钮点击的切换效果
	//当 控制切换ul的left值为 0 时，  左侧的小圆点按钮 样式增加一个 a-disabled
	var $ul = $(".home-hot-shop").find( ".con-ul" ).children("ul");
	if( $ul.css("left") =="0px" ){
		$(".for-left").addClass( "a-disabled" );
	}
	//点击左右按钮 完成切换效果
	//事件的添加采用jq的事件委托
	$(".home-page").on( "click" , "a" , function(){
		//当前操作的a标签添加样式  亲兄弟a标签去掉样式
		$(this).addClass( "a-disabled" ).siblings().removeClass( "a-disabled" );
		
		//排他思想  先将所有a标签的样式清空
		/*$(".home-page").children("a").removeClass( "a-disabled" );
		//留下当前操作的a标签
		$(this).addClass( "a-disabled" )*/
		
		//如果当前点击的是右侧按钮 class的值包含 right  
		//取出当前操作的元素的class值  
		var classname = $(this).attr( "class" );
		//判断classname字符串中是否包含"right"    indexOf()
		if( classname.indexOf( "right" ) != -1 ){
			//说明classname中一定会有right  操作的是右侧的按钮
			//$ul.css("left",-1220);
			$ul.animate( { left : -1220 } , 500 );
		}else{
			$ul.animate( { left : 0 } , 500 );
			//$ul.css("left",0);
		}
	} )



	//热门商品 区域
	//实现鼠标移入到某个商品上（li）  显示对应的商品描述 及其按钮显示
	//鼠标离开时  恢复原样
	$(".li_hover_hot_shop").hover( function(){
		//移入到商品区上    end()结束前面最近的选择器
		$(this).find("h6").eq(0).hide().end().eq(1).show(); //文字描述之间的切换
		$(this).find("button").css("display","block"); //按钮和单价之间的切换
		$(this).find( "money" ).hide();
	},function(){
		//离开商品区域
		$(this).find("h6").eq(0).show().end().eq(1).hide();//文字描述之间的切换
		
		$(this).find("button").hide(); //按钮和单价之间的切换
		$(this).find( "money" ).show();
	})
	
	
	//点击每组小圆点 实现该组内图片切换效果
	$(".li_hover_hot_shop").on("click",".ck_li",function(e){
		var e = e || event;
		e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
		//当前操作的元素添加样式  其余的兄弟元素删除样式
		$(this).addClass("li-active").siblings().removeClass("li-active");
		
		//确定操作的是哪一组的图片切换
		var _i = $(this).attr("datai");
		
		//确定当前操作的小圆点元素的id编号
		var _j = $(this).attr( "id" );
		
		
		//请求服务器上的json数据 
		$.ajax({
			type:"get",
			url:"http://localhost/smartisan/json/hotgoods.json?id="+Math.random(),
			async:true,
			dataType : "json",
			timeout : 10000,
			success : function(json){
				var arr = json[_i];//某一组的图片数据
				// console.log( arr )
				//操作当前点击的小圆点对应组的图片换图
				$(this).parent().parent().parent().find(".com-img")
												  .find("img")
												  .attr({"src":arr[_j].img,"width":216,"height":281});
			
				//更改当前操作的小圆点所在的li的href属性
				$(this).parent().parent().parent().parent()
												  .attr( "href" , "http://localhost/smartisan/detail.html?spu="+arr[_j]["spu"] )
			
				//可选操作  每个商品价格对应着不同的数据
				$(this).parent().parent().parent().find(".money").eq(1).html( arr[_j].price );
			}.bind(this)
		});
	})
	
	
	
	//楼层中某个层的切换 效果    智能周边和品质生活的切换
	$(".home_floors").each(function( keys , values ){
		//遍历所有的 home_floors ， 找到要切换的类  floors-page
		if( $(values).find(".floors-page").length > 0 ){ //可能切换的楼层的条件
			//$(values).find(".floors-page").find("a").eq(0).addClass("a_hover")
			$(values).find(".floors-page").find("a").hover(function(){
				$(this).addClass("a_hover").siblings().removeClass("a_hover");
				//如果鼠标操作智能 周边 ， 显示con-ul中第一个ul的内容 ，否则就显示第二个ul的内容
				if( $(this).index()==0 ){//操作智能周边
					$(this).parent().parent().siblings().children("ul").eq(0).show();
					$(this).parent().parent().siblings().children("ul").eq(1).hide();
				}else{
					$(this).parent().parent().siblings().children("ul").eq(1).show();
					$(this).parent().parent().siblings().children("ul").eq(0).hide();
				}
			})
		}
	})

	
	//详情页的跳转功能实现  	
	$(".li_hover_hot_shop").click(function(){
		window.open( $(this).attr("href") );
	})
}
