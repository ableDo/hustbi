// pages/forest/create/create.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'maxlength': 1200,
    'text': '发起讨论',
    hidden: false,
    isChat: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },

  onTapChat: function() {
    var that = this;
    // if (that.data.isChat === 0) {
    if (that.data.hidden) {
      that.setData({'hidden': false});
      that.setData({'isChat': 1});
    }
  },

  onTapMoments: function() {
    var that = this;
    // if (that.data.isChat === 1) {
    if (!that.data.hidden) {
      that.setData({ 'hidden': true });
      that.setData({'isChat': 0});
    }
  }
})