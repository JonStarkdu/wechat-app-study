// pages/post/post-detail/post-detail.js
import { DBPost } from '../../../db/DBPost.js'
//获取小程序app对象
var app = getApp();
console.log(app)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic:false
  },

  /**
   * 评论功能跳转
   */
  onCommentTap(event){
    var id = event.currentTarget.dataset.postId;
    wx.navigateTo({
      url: '../post-comment/post-comment?id='+id,
    })
  },

  /**
   * 收藏按钮功能
   */
  onCollectionTap(event){
    //DBPost对象已经被onLoad加载，不用再次实例化
    var newData = this.dbPost.collect();
    //重新绑定数据，有选择的更新部分数据
    this.setData({
      'post.collectionStatus':newData.collectionStatus,
      'post.collectionNum':newData.collectionNum
    }),
      //交互反馈
      wx.showToast({
        title: newData.collectionStatus?"收藏成功":"取消成功",
        duration:1000,
        icon: "success",
        mask: true
      })
  },

  /**
   * 点赞功能实现
   */
  onUpTap:function(event){
    var newData = this.dbPost.up();
    this.setData({
      'post.upStatus':newData.upStatus,
      'post.upNum':newData.upNum
    })
  },
  /**
   * 阅读量+1
   */
  addReadingTimes(){
    this.dbPost.addReadingTimes();
  },
  /**
   * 切换音乐播放图标
   */
  onMusicTap:function(event){
    if(this.data.isPlayingMusic){
      //暂停音乐播放
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic:false
      })
      app.globalData.g_isPlayingMusic = false;
    } else {
      //播放音乐
      wx.playBackgroundAudio({
        dataUrl: this.postData.music.url,
        title:this.postData.music.title,
        coverImgUrl:this.postData.music.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = this.postData.postId;
    }
  },

  /**
   * 设置音乐播放监听
   */
  setMusicMonitor:function(){
    var that = this;
    wx.onBackgroundAudioStop(function(){
      that.setData({
        isPlayingMusic:false
      })
      app.globalData.g_isPlayingMusic = false;
    });
    wx.onBackgroundAudioPlay(function(event){
      //只处理当前页面的音乐播放
      if(app.globalData.g_currentMusicPostId === that.postData.postId){
        that.setData({
          isPlayingMusic:true
        })
      }
      app.globalData.g_isPlayingMusic = true;
    })
    wx.onBackgroundAudioPause(function(){
      //只处理当前页面的音乐暂停
      if (app.globalData.g_currentMusicPostId === that.postData.postId) {
        that.setData({
          isPlayingMusic: false
        })
      }
      app.globalData.g_isPlayingMusic = false;
    })
  },
  /**
   * 初始化音乐播放图标状态
   */
  initMusicStatus(){
    var currentMusicPostId = this.postData.postId;
    if (app.globalData.g_isPlayingMusic && currentMusicPostId === currentPostId){
      //如果全局播放的音乐是当前文章的音乐，将图标设为正在播放
      this.setData({
        isPlayingMusic: true
      })
    } else {
      this.setData({
        isPlayingMusic: false
      })
    }
  },
  /**
   * 定义页面分享函数
   */
  onShareAppMessage:function(){
    return {
      title:this.postData.title,
      desc:this.postData.content,
      path:"/pages/post/post_detail/post_detail"
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //与url中的key对应
    var postId = options.id;
    this.dbPost = new DBPost(postId);
    this.postData = this.dbPost.getPostItemById().data;
    this.setData({
      post:this.postData
    })
    this.addReadingTimes();
    //onLoad中调用,才能使监听生效
    this.setMusicMonitor();
    //
    this.initMusicStatus();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.postData.title,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //关闭音乐
    wx.stopBackgroundAudio()
    this.setData({
      isPlayingMusic:false
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})