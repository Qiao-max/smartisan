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
			console.log( item.yansen.length )
			for( var i = 0 ; i < item.yansen.length ; i++ ){
				$(".pro_baoxian1").eq(i).html( item.baoxian1[i] );
				$(".pro_baoxian2").eq(i).html( item.baoxian2[i] );
				$(".pro_yansen").eq(i).html( item.yansen[i] );
				console.log( item.yansen[i] )
				//容量中有三个数据  
				if( i < item.yansen.length - 1 ){
					$(".pro_rongliang").eq(i).html( item.rongliang[i] );
				}
			}
		}
	});
}
