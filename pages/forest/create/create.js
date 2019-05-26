// pages/forest/create/create.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'maxlength': 1200,
    hidden: false,
    animationData: {},
    animationDataBody: {},
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
            var animation = wx.createAnimation({
              duration: 2000,
              timingFunction: 'ease-in',
              delay: 0,
            })
            animation.translate(0, 0).opacity(1).step();
            that.setData({animationData: animation.export()});
            // setTimeout(function() {
              that.setData({ 'hidden': false });
            // }.bind(this), 1000);
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
            var animation = wx.createAnimation({
              duration: 1000,
              timingFunction: 'ease-in',
              delay: 0,
            })
            animation.translate(0, -100).opacity(0).step();
            that.setData({ animationData: animation.export() });
            setTimeout(function () {
              that.setData({ 'hidden': true });
            }.bind(this), 1000);
          }
        }
      })
    }
  },
})