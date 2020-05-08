window.onload = function(){
	//获取六位随机验证码   由大写字母  小写字母 或数字组成
	function rand( min , max ){
		return Math.round( Math.random()*(max-min) + min );
	}
	//字母数字验证码
	function yzm(){
		var str = "";//用来存放验证码
		for( var i = 1 ; i <= 6 ; i++ ){
			//随机从48--122中间获取一个数字
			var  code = rand(48,122);//58--64   91--96这两个区间不满足条件  就重抽
			if( code >= 58 && code <= 64 || code >= 91 && code <= 96 ){
				i--;
			}else{
				//将这个编码值转成对应的字符 存入到str空字符串中
				var ch = String.fromCharCode( code );
				str += ch;
			}
		}
		return str;
	}
	
	//获取验证码
	$("#code").click(function(){
		//先将按钮变成不可用
		$(this).addClass( "disabled" );
		var time = 10;//倒计时的时间
		var timer = setInterval( function(){
			$("#code a").html( --time );
			if( time == 0 ){
				clearInterval( timer );
				$("#code a").html( yzm() );
			}
		},1000 )
	})
	//验证码  获取焦点  情况文本框中默认的内容
	$("#yzm").focus(function(){
		$(this).prev().html("");
	})
	//失去焦点时     实现验证码输入是否和获取的验证码内容一致
	$("#yzm").blur(function(){
		var iptCode = $(this).val().trim();//用户输入的验证码
		var getCode = $("#code a").html();//获取的验证码
		if( iptCode.length == 0 ){ //非空判断
			$(this).next().css({
				display : "inline",
				opacity : 1
			})
		}else if( iptCode != getCode ){
			$(this).next().next().css({
				display : "inline",
				opacity : 1
			})
		}else{
			$(this).next().css({
				display : "none",
				opacity : 0
			}).next().css({
				display : "none",
				opacity : 0
			})
		}
		
	})
	
	
	//手机号码验证 : 非空验证   手机格式验证 访问接口实现唯一性验证
	$("#tel").blur(function(){
		//获取手机号码 
		var tel = $(this).val().trim();
		//定义正则 验证手机格式
		var reg = /^1[3587]\d{9}$/;
		if( tel.length == 0 ){
			$(this).next().css({
				display : "inline",
				opacity : 1
			})
		}else if( !reg.test( tel ) ){//手机号码验证
			$(this).next().next().css({
				display : "inline",
				opacity : 1
			})
		}else{
			//请求接口验证手机号码的唯一性
			$.ajax({
				type:"get",
				url:"http://localhost/smartisan/php/login_register.php",
				data : {
					status : "checkTel",
					tel : tel
				},
				async:true,
				timeout : 10000,
				success : function(msg){
					if( msg == 1 ){ // 手机号被注册
						$(this).next().next().next().css({
							display : "inline",
							opacity : 1
						})
					}else{ //手机号可以被注册  手机号没有问题了
						$(this).next().css({
							display : "none",
							opacity : 0
						}).next().css({
							display : "none",
							opacity : 0
						}).next().css({
							display : "none",
							opacity : 0
						})
					}
				}.bind(this)
			});
		}
	})
	
	//密码验证
	$("#password").focus(function(){
		$(this).prev().html("");
	})
	//重复密码
	$("#repassword").focus(function(){
		$(this).prev().html("");
	})
	//重复密码和原密码一致
	$("#repassword").blur(function(){
		//获取原密码
		var oldPwd = $("#password").val().trim();
		var newPwd = $("#repassword").val().trim();
		if( oldPwd != newPwd ){
			$(this).next().next().next().css({
				display : "inline",
				opacity : 1
			})
		}else{
			$(this).next().next().next().css({
				display : "none",
				opacity : 0
			})
		}
	})
	
	//注册功能实现  请求服务器接口
	$("#reg").click(function(){
		//获取要注册的手机号和密码
		var tel = $("#tel").val().trim();
		var pwd = $("#password").val().trim();
		$.ajax({
			type : "get",
			url : "http://localhost/smartisan/php/login_register.php",
			data : {
				status : "register",
				tel : tel,
				pwd : pwd
			},
			success : function(msg){
				if( msg == 1 ){
					location.href = "http://localhost/smartisan/login.html";
				}
			}
		})
	})
}
