var express = require('express');
var router = express.Router();

var User=require('../util/model').User;
// 登录页面
router.get('/login', function(req, res, next) {

  res.render('login');
});

/*
{ username: 'liuxiao123456',
  password: 'e10adc3949ba59abbe56e057f20f883e' }

{ username: 'liuxiao123456',
  password: 'e10adc3949ba59abbe56e057f20f883e' }
  */
// 执行登录页面
router.post('/login', function(req, res, next) {
	// req.body获取用户表单的用户名和密码，密码没有加密
	// 数据库中密码加密了。所有要加密密码
	req.body.password=require('../util/md5').md5(req.body.password)
	console.log(req.body)

	// 根据用户名和密码查询用户数据
	User.findOne(req.body,function(err,user){
		if(err){
			next(err)
		}else {
			// 查询成功，返回一个对象
			// 查询成功，没有结果，null，没有数据就登录失败
			if(user){
				// 如果查询到数据，
				console.log('登陆成功',user);
				//将cookie和用户的数据关联到一起
				req.session.admin=user;

				res.redirect('/users')
			}else {
				console.log('用户名和密码错误');
				res.redirect('/login')
			}
		}
	})
});
// 退出
router.get('/logout', function(req, res, next) {
  // 让session数据变成null

  req.session.admin=null;
  console.log(req.session.admin)
  // 返回登录页面
  res.redirect('/login')
});

// 注册页面
router.get('/reg', function(req, res, next) {
  res.render('reg')
});


// 执行注册页面
router.post('/checkUsername', function(req, res, next) {

	req.body.password=require('../util/md5').md5(req.body.password)
	// 查找数据
	User.findOne(req.body,function(err,user){
		if(err){
			res.json({error:"服务器出错"})
		}else {
			// 如果查到数据，用户已经注册,重新注册
			if(user){
				// res.json({success:1})
				res.redirect('back')
			}else {
				// 如果没有查到数据，注册成功，去登陆
				// 把注册的用户名和密码存储到数据库中
				User.create(req.body,function(err,result){
					if(err){
						next(err)
					}else {
						console.log(result)
						res.redirect('/login');
					}
				})
			}
		}
	})
});

// 接收手机号,并且发送短信
router.post('/send',function(req,res,next){
	
	// 接收手机号码并发送短信
    var phone = req.body.phone;

    // 获取随机的验证码
    function rand(m, n) {
        return Math.floor(Math.random() * (n - m + 1) + m)
    }
    var code = rand(1000, 9999);
    req.session.code = code;

    // 引入阿里大于提供的短信发送代码
    var TopClient = require('../util/msg/topClient.js').TopClient;

    var client = new TopClient({
        'appkey': '23341634',
        'appsecret': '7e30a1c2c254c9a109f283067e8d5e18',
        'REST_URL': 'http://gw.api.taobao.com/router/rest'
    });

    // 执行短信发送
    client.execute('alibaba.aliqin.fc.sms.num.send', {
            'extend': '123456',
            'sms_type': 'normal',
            'sms_free_sign_name': '俊哥技术小站',
            'sms_param': '{\"code\":\"' + code + '\"}',
            'rec_num': phone,
            'sms_template_code': 'SMS_105890028'
        },
        function(error, response) {
            if (error) {
                // 发送失败
                res.json({
                    success: 0
                })
            } else {
                // 发送成功
                res.json({
                    success: 1
                });
            }
        })
})


module.exports = router;