var express = require('express');
var router = express.Router();


// 导入type模型
var Type = require('../util/model.js').Type;
var Article = require('../util/model.js').Article;


router.get('/', function(req, res, next) {
	 // console.log(req.query)
	 // 查找所有的type
	 Type.find(function(err,types){
	  	if(err){
	  		next(err)
	  	}else {
	  		// 如果不搜索，默认展示第一个分类的数据 types[0]._id

			 var tid=req.query.tid ? req.query.tid : types[0]._id;

			 // console.log(tid)
			 // 查询指定的分类,展示在页面
			 var article = {};
			 Article.find({type:tid},function(err,articles){
			 	if(err){
			 		next(err)
			 	}else {
			 		// 查询指定的分类对应的文章信息，展示在页面
			 		for(var i=0 ;i<articles.length; i++){
			 			// console.log(articles[i]._id)
			 			if (articles[i]._id==req.query.aid){
			 				article=articles[i];
			 				break;
			 			}else {
			 				article=articles[0]
			 			}
			 		}
			 		res.render('index',{types:types,articles:articles,article:article,tid:tid})
			 	}
			 })
	  	}
	 })
});


module.exports = router;
