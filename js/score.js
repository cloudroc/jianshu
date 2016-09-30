$('body').append(" <a class='btn btn-danger btn-small' id='getscores' style='position: fixed;top:55px;right:15px;'>一键刷分</a>  ");
var m = $("meta[name=csrf-token]");
var csrf_token = m.attr("content");
var config = getConfig();
$("#getscores").click(function() {
	
	var html = $('body').html();
	console.log(html.indexOf("简友圈"));
	if(html.indexOf("简友圈")==-1) {
		layer.msg('请先登录简书 ！  :-)');
		return;
	}
	
	if(config == null || config.user_id == null || config.user_id == "") {
		layer.prompt({
			title: '请输入目标用户ID(user_id)，并确认',
			formType: 0
		}, function(user_id) {
			layer.prompt({
				title: '目标文章ID(post_id)，并确认',
				formType: 0
			}, function(post_id) {
				config.user_id = user_id;
				config.post_id = post_id;
				localStorage['config'] = JSON.stringify(config);
				layer.msg('保存成功！');
			});
		});
		return;
	}
	layer.msg('刷分任务已启动，请耐心等待！如果积分没刷够，请多刷几次:-)');
	
	//关注用户 每次2分，每天上限3次共6分
	togglelikes(3);

	//喜欢文章，每次1分，每天3次共3分
	//第一个喜欢文章，每次5分上限100分
	
	setTimeout(function like() {
		getlikes(3);
	}, 6000);
});

function togglelikes(n){
	if(n == 0) {
		layer.msg('获取关注任务积分完成！');
		return;
	}
	setTimeout(function like() {
		for(var i = 0; i < 2; i++) {
			setTimeout(function toggle_like() {
				$.ajax({
					type: "POST",
					url: "http://www.jianshu.com/users/"+config.user_id+"/toggle_like",
					dataType: "text",
					headers: {
						"X-CSRF-Token": csrf_token
					}
				});
			}, 1000);
		}
		n = n - 1;
		togglelikes(n);
	}, 2000);
}

function getlikes(n) {
	if(n == 0) {
		layer.msg('获取‘第一个喜欢别人文章’日常任务积分完成！');
		return;
	}
	setTimeout(function like() {
		for(var i = 0; i < 14; i++) {
			setTimeout(function like() {
				$.ajax({
					type: "POST",
					url: "http://www.jianshu.com/notes/"+config.post_id+"/like",
					dataType: "text",
					headers: {
						"X-CSRF-Token": csrf_token
					}
				});
			}, 1000);
		}
		n = n - 1;
		getlikes(n);
	}, 2000);
}

function getConfig(cfgName) {
	var name = "config";
	var config = null;
	if(cfgName) name = cfgName;
	var _config = localStorage[name];
	try {
		config = JSON.parse(_config);
	} catch(err) {
		console.error(err);
	}
	if(!config || typeof config != "object") {
		config = {};
	}
	return config;
}

function saveConfig(config, cfgName) {
	var name = "config";
	if(cfgName) name = cfgName;
	localStorage[name] = JSON.stringify(config);
}