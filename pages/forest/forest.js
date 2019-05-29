// pages/forest/forest.js

const s = require("../../utils/store.js")
const t = require("../../utils/t.js")



Page({
  /**
   * 页面的初始数据
   */
  data: {
    chat: false,
    search: false,
    moments: false,
    total: true,

    windowHeight: 0,
    navbarHeight: 0,
    scrollerViewHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: s("l") === 0 ? "绿色森林" : "Green Forest"
    });

    let that = this;
    // get window height
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      },
    });
    // get navbar height
    let query = wx.createSelectorQuery();
    query.select('#navbar').boundingClientRect();
    query.exec((res) => {
      let navbarHeight = res[0].height;
      let scrollViewHeight = that.data.windowHeight - navbarHeight;
      that.setData({
        scrollerViewHeight: scrollViewHeight
      });
    });
    
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

  onUserTap: function() {
    wx.navigateTo({
      url: '/pages/forest/user/user',
    })
  },

  onSearchTap: function() {
    let that = this;
    if (!that.data.search) {
      that.setData({
        search: true,
        chat: false,
        moments: false,
        total: false,
      });
    } else {
      that.setInitState();
    }
  },

  onChatTap: function() {
    let that = this;
    if (!that.data.chat) {
      that.setData({
      search: false,
      chat: true,
      moments: false
      });
    } else {
      that.setInitState();
    } 
  },

  onMomentsTap: function() {
    let that = this;
    if (!that.data.moments) {
       that.setData({
      search: false,
      chat: false,
      moments: true
      });
    } else {
      that.setInitState();
    }
   
  },
  onCreateTap: function() {
    wx.navigateTo({
      url: '../forest/create/create',
    })
  },

  setInitState: function() {
    let that = this;
    that.setData({
      search: false,
      chat: false,
      moments: false,
      total: true,
    })
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

  }
})