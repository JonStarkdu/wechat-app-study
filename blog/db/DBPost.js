/* protoType风格
var DBPost = function(){
  this.storageKeyName='postList';//所有文章本地缓存存储的键值
}

DBPost.prototype={
  //得到全部文章信息
  getAllPostData:function(){
    var res = wx.getStorageSync(this.storageKeyName);
    if(!res){
      res = require('../data/data.js').postList
      this.execSetStorageSync(res);
    }
    return res;
  },

  //本地缓存 保存/更新
  execSetStorageSync:function(data){
    wx.setStorageSync(this.storageKeyName, data)
  },
};
module.exports={
  DBPost:DBPost
};*/

var util = require('../utils/util.js')
//ES6风格
class DBPost {
  constructor(postId) {
    this.storageKeyName = 'postList';
    this.postId = postId;
  }

  //得到全部文章信息
  getAllPostData() {
    var res = wx.getStorageSync(this.storageKeyName);
    if (!res) {
      res = require('../data/data.js').postList;
      this.initPostList(res);
    }
    return res;
  }
  //保存或者更新缓存数据
  execSetStorageSync(data) {
    wx.setStorageSync(this.storageKeyName, data)
  }

  //获取指定id号的文章数据
  getPostItemById() {
    var postsData = this.getAllPostData();
    var len = postsData.length;
    for (var i = 0; i < len; i++) {
      if (postsData[i].postId == this.postId) {
        return {
          //当前文章在缓存数据库数组中的序号
          index: i,
          data: postsData[i]
        }
      }
    }
  }

  //收藏
  collect() {
    return this.updatePostData('collect');
  }
  //点赞
  up(){
    return this.updatePostData('up');
  }
  //更新本地点赞，评论信息，收藏，阅读量
  updatePostData(category,newComment) {
    var itemData = this.getPostItemById();
    var postData = itemData.data;
    var allPostData = this.getAllPostData();
    switch (category) {
      case 'collect':
        //处理收藏
        if (!postData.collectionStatus) {
          //如果当前状态是未收藏
          postData.collectionNum++;
          postData.collectionStatus = true;
        } else {
          //如果当前状态是收藏
          postData.collectionNum--;
          postData.collectionStatus = false;
        }
        break;
      case 'up':
        //处理点赞
        if(!postData.upStatus){
          postData.upNum++;
          postData.upStatus = true;
        } else {
          postData.upNum--;
          postData.upStatus = false;
        }
        break;
      case 'comment':
        postData.comments.push(newComment);
        postData.commentNum++;
        break; 
      case 'reading':
        postData.readingNum++;
        break;   
      default:
        break;
    }
    //更新缓存数据库
    allPostData[itemData.index] = postData;
    this.execSetStorageSync(allPostData);
    return postData;
  }

  //获取评论数据
  getCommentData() {
    var itemData = this.getPostItemById().data;
    //按照时间降序排列评论
    itemData.comments.sort(this.compareWithTime);
    var len = itemData.comments.length;
    var comment;
    for(var i = 0; i< len;i++){
      //将comments中的时间戳转换成可阅读格式
      comment = itemData.comments[i];
      comment.create_time = util.getDiffTime(comment.create_time,true);
    }
    return itemData.comments;
  }

  //比较评论先后
  compareWithTime(value1,value2){
    var flag = parseFloat(value1.create_time)-parseFloat(value2.create_time);
    if(flag < 0){
      return 1;
    } else if(flag>0) {
      return -1;
    } else {
      return 0;
    }
  }

  /**
 * 阅读数+1
 */
  addReadingTimes() {
    this.updatePostData('reading');
  }

  //发表评论
  newComment(newComment){
    this.updatePostData('comment',newComment);
  }

};

export {
  DBPost
}