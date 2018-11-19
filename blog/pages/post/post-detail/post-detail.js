// pages/post/post-detail/post-detail.js
import { DBPost } from '../../../db/DBPost.js'
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
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic:false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: this.postData.music.url,
        title:this.postData.music.title,
        coverImgUrl:this.postData.music.coverImg
      })
    }
    this.setData({
      isPlayingMusic:true
    })
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