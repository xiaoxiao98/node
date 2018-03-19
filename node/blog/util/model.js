var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blog');

// 定义数据字段
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    username: String,
    password: String,
    age:Number,
    sex: String,
    likes: Array,
    position: String,
    intro: String,
    avatar: String
    /*
    timestamps:自动添加时间
    	创建时间：createdAt
    	最后一次修改时间：updatedAt
    */
}, { timestamps: true });

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
    type: {type: Schema.Types.ObjectId, ref: 'Type'},
    content:String
    /*
    timestamps:自动添加时间
        创建时间：createdAt
        最后一次修改时间：updatedAt
    */
}, { timestamps: true });


// 我喜欢的页面
var LikeSchema = new Schema({
    title: String,
    image: String,
    price: Number
    // price: Number

}, {timestamps:true});

exports.User= mongoose.model('User', UserSchema);
exports.Type= mongoose.model('Type', TypeSchema);
exports.Article= mongoose.model('Article', ArticleSchema);
exports.Like = mongoose.model('Like', LikeSchema);


