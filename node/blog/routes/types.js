var express = require('express');
var router = express.Router();

var Type=require('../util/model').Type;
// 用户首页
router.get('/', function(req, res, next) {

	Type.count(function(err,total){
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
			
		    Type.find(req.body, function(err, types) {
		        if (err) {
		            next(err)
		        } else {
                     var moment = require('moment');

		            res.render('types/index',{types:types,page:page})
		        }
		    }).limit(page.every).skip(page.every*(page.nowPage-1))
		}
	})
     /*
    	第一页：skip(0)		每页的数量*(1-1)
    	第二页：skip(5)		每页的数量*(2-1)
    	第三页：skip(10)	每页的数量*(3-1)
    	第四页：skip(15)	每页的数量*(4-1)
    	第五页：skip(20)	每页的数量*(5-1)
    */
});

// 添加分类
router.get('/create', function(req, res, next) {
    res.render('types/create')
});

// 执行用户添加操作
router.post('/create', function(req, res, next) {
    // 将用户信息添加到数据库

    Type.create(req.body, function(err) {
        if (err) {
            next(err);
        } else {
            // 添加成功，跳转到用户的首页

            res.redirect('/types');
        }
    })
});

// 删除用户,获取url地址/后面的地址
router.get('/remove/:_id', function(req, res, next) {
    Type.remove(req.params, function(err) {
        if (err) {
            next(err)
        } else {
            // 删除成功，返回首页
            res.redirect('/types')
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
    Type.findOne(req.params, function(err, type) {
        if (err) {
            next(err)
        } else {
            res.render('types/update', { type: type })
        }
    })
});

// 将修改的分类数据提交到服务器
router.post('/update', function(req, res, next) {
    // 修改条件id，修改内容Typename
    Type.update({ _id: req.body._id }, req.body, function(err) {
        if (err) {
            next(err);
        } else {
            res.redirect('/types')
        }
    })
});


module.exports = router;
