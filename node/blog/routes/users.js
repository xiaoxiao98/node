var express = require('express');
var router = express.Router();

var User=require('../util/model').User;
// 用户首页
router.get('/', function(req, res, next) {

    // 搜索条件
    var where = {};
    // 用户名
    if(req.query.username){
        where.username = new RegExp(req.query.username);
    }
    // 性别
    if(req.query.sex){
        where.sex = new RegExp(req.query.sex);
    }
    // 年龄
    if(req.query.minage && req.query.maxage){
        where.age={$gt:req.query.minage,$lt:req.query.maxage}
    }

    // 搜索分页，必须将条件和页面结合在一起
    var str = '';
    for (var i in req.query) {
        // 排除page这个参数，因为在expres中，多个重名的参数，会形成数组，会有多个page
        if (i != 'page') {
            str += i+'='+req.query[i]+'&';
        }
    }
	User.count(function(err,total){
		if(err){
			next(err)
		}else {

			// 定义个空对象
			var page={}; 
			page.every=5;
			// 获取总页码
			page.totalPage=Math.ceil(total/page.every);
			// 获取当前的页码
			page.nowPage=Number(req.query.page?req.query.page:1);
			page.prevPage=page.nowPage-1 <= 1 ? 1: page.nowPage-1;
			page.nextPage=page.nowPage+1 >=page.totalPage ? page.totalPage :page.nowPage+1;
			
		    User.find(req.body, function(err, users) {
		        if (err) {
		            next(err)
		        } else {
		            // 性别的数组
		            var sex = ['男', '女', '保密']
		            // 爱好的数组
		            var likes = ['篮球', '足球', '排球', '羽毛球', '乒乓球']
		            // 省份的数组
		            var position = ['北京市', '河北省', '辽宁省', '陕西省', '河南省'];

		            // 引入moment
		            var moment = require('moment');

		            res.render('users/index', { users: users, sex: sex, position: position, likes: likes,page:page,query:req.query,str:str})
		        }
		    }).where(where).limit(page.every).skip(page.every*(page.nowPage-1))
		}
	}).where(where);
     /*
    	第一页：skip(0)		每页的数量*(1-1)
    	第二页：skip(5)		每页的数量*(2-1)
    	第三页：skip(10)	每页的数量*(3-1)
    	第四页：skip(15)	每页的数量*(4-1)
    	第五页：skip(20)	每页的数量*(5-1)
    */
});

// 添加用户
router.get('/create', function(req, res, next) {
    res.render('users/create')
});

// 执行用户添加操作
router.post('/create', function(req, res, next) {
    // 将用户信息添加到数据库

    // 把加密的密码再赋值给密码
    req.body.password = require('../util/md5.js').md5(req.body.password);


    User.create(req.body, function(err) {
        if (err) {
            console.log(req.body)
            next(err);
        } else {
            // 添加成功，跳转到用户的首页

            res.redirect('/users');
        }
    })
});

// 删除用户,获取url地址/后面的地址
router.get('/remove/:_id', function(req, res, next) {
    User.remove(req.params, function(err) {
        if (err) {
            next(err)
        } else {
            // 删除成功，返回首页
            res.redirect('/users')
        }
    })
});

/*
  修改按钮 -> 
    修改页面(get路由) -> 
    用户填写内容 -> 
    将修改的内容提交到服务器，服务器执行修改操作（post路由）
*/
// 获取修改的页面
router.get('/update/:_id', function(req, res, next) {
    User.findOne(req.params, function(err, user) {
        if (err) {
            next(err)
        } else {
            res.render('users/update', { user: user })
        }
    })
});

// 将修改的数据提交到服务器
router.post('/update', function(req, res, next) {
    // 修改条件id，修改内容username
    User.update({ _id: req.body._id }, req.body, function(err) {
        if (err) {
            next(err);
        } else {
            res.redirect('/users')
        }
    })
});

// 添加头像页面
router.get('/avatar/:_id', function(req, res, next) {
    User.findOne(req.params, function(err, user) {
        if (err) {
            next(err)
        } else {
            res.render('users/avatar', { user: user })
        }
    })
});

// 添加头像发送到服务器
router.post('/avatar', function(req, res, next) {

    // 引入上传文件模块
    var util = require('../util/upload');
    // 在路由的路径是以app.js为准
    util.upload(req, './public/uploads').then(function(data) {
        User.update(data.fields, {
                avatar: data.files.avatar.path.slice(6).replace(/\\/g, '/')
            },
            function(err) {
                if (err) {
                    next(err)
                } else {
                    res.redirect('/users')
                }
            })
    })

});
module.exports = router;

/*打印的data和files
{ fields: { _id: '5a5f0447da75e20bc4ba43a0' },
  files:
   { avatar:
      {
        domain: null,
        _events: {},
        _eventsCount: 0,
        _maxListeners: undefined,
        size: 620888,
        path: 'public\\uploads\\upload_888b1129f0ee8e2f8680440757a81262.jpg',
        name: 'Tulips.jpg',
        type: 'image/jpeg',
        hash: null,
        lastModifiedDate: 2018-01-17T08:25:03.034Z,
        _writeStream: [Object] } } } undefined
*/

function rand(m,n){
    return Math.floor(Math.random()*(n-m+1)+m);
}
User.find(function(err,users){
    users.forEach(function(value,key){
        // console.log(value._id);
        User.update({_id:value._id},{age:rand(12,40)}, function(err){
            
        })
    })
})