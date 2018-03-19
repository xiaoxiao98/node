// 1.引入模块
var request = require('request'),
	cheerio = require('cheerio');	// 服务器端的解析dom的模块

exports.get = function(url){
	return new Promise(function(resolve,reject){
		// 2.偷数据
		request(url, function(err,response,body){
			if (err) {
				reject(err);
			} else {
				var $ = cheerio.load(body);

				resolve($);
			}
		})
	})
}

// get().then()
