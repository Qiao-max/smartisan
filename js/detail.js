window.onload = function(){
	//获取详情页的路径
	var str = location.href;
	//http://localhost/smartisan/detail.html?spu=100046401
	var spu = str.split("=")[1];
	
	//使用ajax获取服务器上json数据
	$.ajax({
		type:"get",
		url:"http://localhost/smartisan/json/detail.json?id="+Math.random(),
		async:true,
		dataType : "json",
		timeout : 10000,
		success : function(msg){
			//根据spu编号 确定要显示的某个对象的详细信息
			var item = msg[spu];
			//操作详情页数据的改变  
			$("#pro_img").attr( "src" , item.img );
			$("#pro_name").html( item.name );
			$("#pro_highlights").html( item.highlights );
			$("#pro_maizeng").html( item.maizeng );
			$("#pro_jiagou").html( item.jiagou );
			$("#pro_lingjuan").html( item.lingjuan );
			$("#pro_price").html( item.price );
			$("#pro_price1").html( item.price );
			$("#pro_baoxiu").html( item.baoxiu[0] );
			// console.log( item.yansen.length )
			for( var i = 0 ; i < item.yansen.length ; i++ ){
				$(".pro_baoxian1").eq(i).html( item.baoxian1[i] );
				$(".pro_baoxian2").eq(i).html( item.baoxian2[i] );
				$(".pro_yansen").eq(i).html( item.yansen[i] );
				// console.log( item.yansen[i] )
				//容量中有三个数据  
				if( i < item.yansen.length - 1 ){
					$(".pro_rongliang").eq(i).html( item.rongliang[i] );
				}
			}
			
			
			//放大镜功能实现
			//为了让放大镜实现的效果更准确  保证小图区的图片就是对应着大图显示区的图片 重新设置mask的宽度和高度
			$("#mask").css({
				width : 312,
				height : 312
			})
			//设置大图    左侧小图 和 右侧大图 是同一张图片
			$("#big-img").attr({
				src : item.img,
				width : 800,
				height : 800
			})
			//设置大图的css样式  大图需要动起来   所以要有定位
			$("#big-img").css({
				position : "absolute",
				top : 0,
				left : 0
			})
			//鼠标移入移出到 small 区域时，显示和隐藏 mask和 big
			$("#small").hover(function(){
				$("#mask").show();
				$("#big").show();
			},function(){
				$("#mask").hide();
				$("#big").hide();
			})
			//鼠标在小图区域移动   
			$("#small").mousemove(function(e){
				var e = e || event;
				var x = e.pageX - $("#small").offset().left - $("#mask").width()/2;
				var y = e.pageY - $("#small").offset().top - $("#mask").height()/2;
				
				//获取mask的的最大的left和top值
				var maxL = $("#small").width() - $("#mask").width();
				var maxT = $("#small").height() - $("#mask").height();
				
				
				x = x < 0 ? 0 : ( x > maxL ? maxL : x );//左右边界
				y = y < 0 ? 0 : ( y > maxT ? maxT : y );//上下边界
				
				//右侧大图向左移动的距离或向上移动的距离 需要满足下面的公式
				//  大图宽度 / 小图宽度 = 大图偏移 / mask的偏移量 = 大图可视区的宽或高 / 小图显示区mask的宽或高
				
				var bigImgLeft = x * 800 / 500;
				var bigImgTop = y * 800 / 500;
				
				//设置mask的left和top
				$("#mask").css({
					left : x , 
					top : y
				})
				
				//设置大图的移动
				$("#big-img").css({
					left : -bigImgLeft,
					top : -bigImgTop
				})
			})
		}
	});
}
