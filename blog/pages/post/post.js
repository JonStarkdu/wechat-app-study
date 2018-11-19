//引入模块
//var dataObj = require("../../data/data.js");
//prototype
//var DBPost = require("../../db/DBPost.js").DBPost;
//es6
import {DBPost} from '../../db/DBPost.js'
Page({
  data: {},
  onLoad: function(options) {
    //页面初始化 options为页面跳转带来的参数
    console.log("onLoad:页面被加载");
    var dbPost = new DBPost();
    this.setData({
      postList:dbPost.getAllPostData()
    });
  },
  onShow: function() {
    //页面显示
    console.log("onShow:页面被显示");
  },
  onReady: function() {
    //页面渲染完成
    console.log("onReady:页面被渲染");
  },
  onHide: function() {
    //页面隐藏
    console.log("onHide:页面被隐藏");
  },
  onUnload: function() {
    //页面关闭
    console.log("onUnload:页面被卸载");
  },
  onTapToDetail(event){
    //currentTarget事件绑定的当前组件 dataset 当前组件所有以data-开头的属性
    var postId = event.currentTarget.dataset.postId;
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+postId,
    })
  }
})