// pages/forest/create/create.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'maxlength': 1200,
    hidden: false,
    topic: '',
    content: '',
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
    if (that.data.hidden) {
      wx.showModal({
        title: '提示',
        content: '您当前所做更改将不会得到保存！',
        success: function(res) {
          if (res.confirm) {
              that.setData({ 'hidden': false });
          } 
        }
      })
    }
  },

  onTapMoments: function() {
    var that = this;
    if (!that.data.hidden) {
      wx.showModal({
        title: '提示',
        content: '您当前所做更改将不会得到保存！',
        success: function (res) {
          if (res.confirm) {
            that.setData({ 'hidden': true });
          }
        }
      })
    }
  },

  submit: function() {
    if (!this.data.hidden && this.data.topic.length === 0) {
      console.log('wrong!');
    }
  },
  bindTopicInput: function(e) {
    this.setData({topic: e.detail.value});
  },
  bindContentInput: function(e) {
    this.setData({content: e.detail.value });
  },
})