var mongoose  = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blog');
// 定义数据字段
var Schema = mongoose.Schema;
// 分类管理
var TypeSchema = new Schema({
    
    typename: String
    /*
    timestamps:自动添加时间
        创建时间：createdAt
        最后一次修改时间：updatedAt
    */
}, { timestamps: true });


// 文章管理
var ArticleSchema = new Schema({
    articlename: String,
    type:String,
    content:String

   
    /*
    timestamps:自动添加时间
        创建时间：createdAt
        最后一次修改时间：updatedAt
    */
}, { timestamps: true });

var Type= mongoose.model('Type', TypeSchema);
var Article= mongoose.model('Article', ArticleSchema);

Article.find(function(err,articles){
    console.log(articles);
})

// .populate('type');



