var express = require('express');
var router = express.Router();

var Article=require('../util/model').Article;
var Type=require('../util/model').Type;

// 文章首页
router.get('/', function(req, res, next) {

    // 搜索条件
    var where = {};
    if (req.query.articlename){
        where.articlename = new RegExp(req.query.articlename)
    }


    var str = '';
    for (var i in req.query) {
        // 排除page这个参数，因为在expres中，多个重名的参数，会形成数组，会有多个page
        if (i != 'page') {
            str += i+'='+req.query[i]+'&';
        }
    }

	Article.count(function(err,total){
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
			
             // 查找文章

		    Article.find(function(err, articles) {
		        if (err) {
		            next(err)
		        } else {
                    // console.log(articles)
                     var moment = require('moment');
                    // console.log(articles)
		            res.render('articles/index',{articles:articles,page:page,query:req.query,str:str})
		        }
		    }).where(where).populate('type').limit(page.every).skip(page.every*(page.nowPage-1))
		}
	}).where(where)

   

     /*
    	第一页：skip(0)		每页的数量*(1-1)
    	第二页：skip(5)		每页的数量*(2-1)
    	第三页：skip(10)	每页的数量*(3-1)
    	第四页：skip(15)	每页的数量*(4-1)
    	第五页：skip(20)	每页的数量*(5-1)
    */
});

// 添加文章
router.get('/create', function(req, res, next) {
    // 添加文章的时候查找分类的数据库
    Type.find(req.body,function(err,types){
        if(err){
            next(err)
        }else {
           
            res.render('articles/create',{types:types})
        }
    })
});

// 执行文章添加操作
router.post('/create', function(req, res, next) {
    // 将添加的文章信息添加到数据库

    Article.create(req.body, function(err) {
        if (err) {
            next(err);
        } else {
            console.log(req.body)
            // 添加成功，跳转到用户的首页
            res.redirect('/articles');
        }
    })
});

// 删除文章,获取url地址/后面的地址
router.get('/remove/:_id', function(req, res, next) {
    Article.remove(req.params, function(err) {
        if (err) {
            next(err)
        } else {
            // 删除成功，返回首页
            res.redirect('/articles')
        }
    })
});


// 获取修改的页面
router.get('/update/:_id', function(req, res, next) {
    Article.findOne(req.params, function(err, article) {
        if (err) {
            next(err)
        } else {

            // 修改文章的时候，需要将文章信息查询出来
            Type.find(function(err,types){
                if(err){
                    next(err)
                }else {

                    res.render('articles/update', { article: article,types:types })
                }
            })
        }
    })
});

// 将修改的分类数据提交到服务器
router.post('/update', function(req, res, next) {
    // 修改条件id，修改内容Articlesname
    Article.update({ _id: req.body._id }, req.body, function(err) {
        if (err) {
            next(err);
        } else {
            res.redirect('/articles')
        }
    })
});


module.exports = router;
