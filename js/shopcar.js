(function(){
	//抛物线插件的定义
	$.extend({
		fnInit : function( startObj , endObj ){ //确定三点坐标及抛物线方程的系数
			//起始点
			this.startPoint = {
				x : startObj.offset().left + startObj.width()/2 ,
				y : startObj.offset().top 
			}
			//结束点
			this.endPoint = {
				x : endObj.offset().left + endObj.width()/2 ,
				y : endObj.offset().top 
			}
			//最低(高)点
			this.topPoint = {
				x : this.endPoint.x - 100 ,
				y : this.endPoint.y + 80
			}
			//根据三点坐标  确定抛物线方程的系数
			this.a = ((this.startPoint.y - this.endPoint.y) * (this.startPoint.x - this.topPoint.x) - (this.startPoint.y - this.topPoint.y) * (this.startPoint.x - this.endPoint.x)) / ((this.startPoint.x * this.startPoint.x - this.endPoint.x * this.endPoint.x) * (this.startPoint.x - this.topPoint.x)-(this.startPoint.x * this.startPoint.x - this.topPoint.x * this.topPoint.x) * (this.startPoint.x - this.endPoint.x)); 
	                    
			this.b = ((this.endPoint.y - this.startPoint.y) - this.a * (this.endPoint.x * this.endPoint.x - this.startPoint.x * this.startPoint.x)) / (this.endPoint.x - this.startPoint.x); 
	                    
			this.c = this.startPoint.y - this.a * this.startPoint.x * this.startPoint.x - this.b * this.startPoint.x;
			return this;
		},
		fnMove : function(src){ //抛物线的运动
			//创建图片
			var $img = $("<img>");
			//将图片添加到body中
			$("body").append( $img );
			//设置img的src为 当前按钮对应的图片的src值
			$img.attr( "src" , src );
			
			//获取商品的起始点
			var x = this.startPoint.x;
			var y = this.startPoint.y;
			
			//描述商品的样式  重点是定位
			$img.css({
				position :"absolute",
				left : x,
				top : y,
				width : 30,
				height :30,
				borderRadius : "50%"
			})
			//商品开始运动
			var timer = setInterval( function(){
				x = x + 10;
				y = this.a*x*x + this.b * x + this.c;
				if( x < this.endPoint.x ){
					$img.css({
						left : x,
						top : y
					})
				}else{
					clearInterval( timer );
					$img.remove();
					//改变购物车中的商品数量
					$("#shopNum").html( parseInt($("#shopNum").html()) + 1 );
				}
			}.bind(this) , 10 )
		}
	});
	
	//点击按钮 实现添加购物车功能
	$(".shoping").click( function(e){
		e.stopPropagation();
		var startObj = $(this);//起始点按钮
		var endObj = $(".sp");//结束点按钮
		var $imgObj = $(this).prev().prev().find("img");
		//获取大图的src
		var src = $imgObj.attr("src").split("?")[0];
		
		//调用抛物线的插件
		$.fnInit( startObj , endObj ).fnMove( src );
		
		setGoodsCookie( $(this) );
	} )
	
	//将商品添加到cookie中
	function setGoodsCookie(obj){
		var arr = [];
		var json = {};
		var spu = obj.parent().parent().attr("href").split("=")[1];
		var flag = true;
		$.ajax({
			type:"get",
			url:"json/detail.json",
			async:true,
			success : function(msg){
				var pro = msg[spu];
				//将商品信息存入到json对象中
				json = {
					"id" : spu , 
					"name" : pro.name,
					"src" : pro.img.split("?")[0],
					"price" : pro.price,
					"count" : 1
				}
				
				//取出cookie中的数据
				var brr = getCookie("shoplist");
				if( brr.length != 0 ){
					arr = brr;
					for( var i = 0 ; i < arr.length ; i++ ){
						if( json.id == arr[i].id ){
							arr[i].count++;
							flag = false;
							break;
						}
					}
				}
				
				if( flag ){
					arr.push( json );
				}
				
				//将数组存入到cookie中
				setCookie( "shoplist" , JSON.stringify( arr ) );
				console.log( document.cookie )
			}
		});
	}
	
	//购物车中商品数量的变化
	getCount();
	function getCount(){
		var brr = getCookie("shoplist");
		var count = 0;
		if( brr.length != 0 ){
			for( var i = 0 ; i < brr.length ; i++ ){
				count += brr[i].count;
			}
		}
		$("#shopNum").html( count );
	}
	
	
	//购物车页面功能实现
	//1--购物车列表显示 从cookie中读取数据
	var brr = getCookie( "shoplist" );
	var conStr = "";
	for( var i = 0 ; i < brr.length ; i++ ){
		var shopinfo = brr[i];
		console.log( shopinfo.src )
		var price = shopinfo.price.split(".")[0].replace(",","");
		conStr += '<div class="shop-item clearfix">'+
					'<p class="fl"><input type="checkbox" class="ck"/></p>'+
					'<img class="fl" src="'+ shopinfo.src +'" alt="" />'+
					'<p class="fl">'+ shopinfo.name +'</p>'+
					'<span class="fl">'+ shopinfo.price +'元</span>'+
					'<p class="fl count" '+
						'data-id="'+ shopinfo.id +'" '+
						'data-price="'+ shopinfo.price +'" data-count="'+ shopinfo.count +'"'+
						'data-name="'+ shopinfo.name +'" data-src="'+ shopinfo.src +'"'+
						'>'+
						'<span class="updateCount" data-number="1">+</span>'+
						'<span class="shop-count"  contenteditable="true">'+ shopinfo.count +'</span>'+
						'<span class="updateCount" data-number="-1">-</span>'+
					'</p>'+
					'<em class="fl sumPrice">'+ (shopinfo.count * price) +'元</em>'+
					'<i class="fl delBtn">删除</i>'+
				'</div>';
	}
	$(".shoplist").html( conStr );
	
	//手动修改商品
	$(".shop-count").keyup(function(){
		var count = parseInt( $(this).html() ) ;//此处需要转数值
		var id = $(this).parent().data("id");
		if( count > 0 ){
			for( var i = 0 ; i < brr.length ; i++ ){
				if( id == brr[i].id ){
					brr[i].count  = count;
					setCookie( "shoplist" , JSON.stringify( brr ) );
					$(this).parent().next().html(  brr[i].count* brr[i].price.split(".")[0].replace(",","") + "元" );
					break;
				}
			}
		}
	})
	//全选功能
	$("#selectAll").click(function(){
		//思路 ： 保证 后面操作的复选框的选中状态和当前点击的复选框的选中状态保持一致
		//获取当前选中的复选框的选中状态 checked   
		// checked属性在js操作中是一个布尔值  需要通过prop()方法操作
		//alert( $(this).prop( "checked" ) ) 
		//设置后面所有复选框的checked属性值和当前点击的checked值一致
		$(".ck").prop( "checked" , $(this).prop( "checked" ) );
		
		jiesuan();
	})
	//单击复选框 调用结算功能
	$(".ck").click(function(){
		jiesuan();
	})
	//结算
	function jiesuan(){
		var count = 0;
		var money = 0;
		//遍历被选中的复选框
		$(".ck:checked").each(function(){
			count += parseInt($(this).parent().parent().find(".shop-count").html());
			money += parseInt( $(this).parent().parent().find( ".sumPrice" ).html() );
		})
		
		$(".count2").html( count );
		$(".money2").html( money );
	}
	//删除功能实现
	$(".delBtn").click( function(){
		if( confirm("确定要删除么？") ){
			//获取当前要删除的商品的编号
			var id = $(this).parent().find(".count").data("id");
			for( var i = 0 ; i < brr.length ; i++ ){
				if( id == brr[i].id ){//说明找到了要删除的商品了
					//删除数组中下标为i的对象
					brr.splice( i , 1 );
					//将数组重新的设置到cookie中
					setCookie( "shoplist" , JSON.stringify( brr ) );
					//修改页面结构
					$(this).parent().remove();
					break;
				}
			}
		}
	} )
	//加减操作
	$(".updateCount").click( function(){
		//获取当前操作的商品编号
		var id = $(this).parent().data("id");
		
		//运算符
		var sign = $(this).data("number");
		//数量
		var count = $(this).parent().find(".shop-count").html();
		if( sign == -1 && count == 1 ){
			return;
		}
		
		for( var i = 0 ; i < brr.length ; i++ ){
			if( id == brr[i].id ){
				brr[i].count += sign;
				setCookie( "shoplist",JSON.stringify( brr ) );
				//修改页面
				$(this).parent().find(".shop-count").html( brr[i].count );
				$(this).parent().next().html( brr[i].count * brr[i].price.split(".")[0].replace(",","") + "元" );
				jiesuan();
				break;
			}
		}
		
	} )
})()

	
