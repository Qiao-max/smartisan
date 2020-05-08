
window.onload = function(){
	$("#log").click(function(){
		var tel = $("#tel").val().trim();
		var pwd = $("#password").val().trim();
		$.ajax({
			type:"get",
			url:"http://localhost/smartisan/php/login_register.php",
			async:true,
			data : {
				status : "login",
				tel : tel,
				pwd : pwd
			},
			success : function(msg){
				if( msg == 1 ){
					location.href = "http://localhost/smartisan/index.html";
				}else if( msg == 2 ){
					alert("密码错误");
				}else{
					alert("手机号不存在");
				}
			}
		});
		
	})
}
