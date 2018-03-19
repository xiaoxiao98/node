var express = require('express');
var router = express.Router();

var Like= require('../util/model.js').Like;




router.get('/me',function(req,res,next){
	
	Like.find(function(err,likes){
		if(err){
			next(err)
		}else {
			console.log(likes)
			res.render('me',{likes:likes})
		}
	})
	
})

router.get('/me/collect',function(req,res,next){
	var spider = require('../util/spider.js');
		
	spider.get('http://search.lefeng.com/search/showresult?keyword=%E5%A5%B3%E5%A3%AB%E9%A6%99%E6%B0%B4').then(function($){
		// 引入采集模块
		$('.pruwrap').each(function(){
			var like={};
			like.title = $(this).children('dl').children('.nam').children('a').attr('title').trim();
			like.image=$(this).children('dl').children('dt').children('a').children('img').attr('src');
			// 检测¥在不在价格中，不等于-1，则表明在
			if ($(this).find('.price').text().trim().indexOf('¥') != -1) {
				like.price=$(this).children('dl').find('.pri').children('.price').text().trim().slice(1);
			}else {
				like.price=$(this).children('dl').find('.pri').children('.price').text().trim();

			}
			
			// console.log(like)

			Like.create(like,function(err){
				if(err){
					console.log(err)
				}else {
					// console.log(like)
					console.log('成功')
				}
			})

		})

	})
})
module.exports = router;








