// pages/forest/forest.js

const s = require("../../utils/store.js")
const t = require("../../utils/t.js")



Page({
  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: s("l") === 0 ? "绿色森林" : "Green Forest"
    })
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

  },

  onChatTap: function() {

  },
  onMomentsTap: function() {

  },
  onCreateTap: function() {
    wx.showActionSheet({
      itemList: ['发布动态', '发起讨论'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.navigateTo({
            url: "/pages/forest/create/create-page/create-page?isChatPage=0",
          })
        } else if(res.tapIndex === 1) {
          wx.navigateTo({
            url: "/pages/forest/create/create-page/create-page?isChatPage=1",
          })
        }
      },
      fail: function(res) {
        // 啥也不干
      }
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