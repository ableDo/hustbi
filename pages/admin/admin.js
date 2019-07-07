// pages/admin/admin.js
const s = require("../../utils/store.js")
const t = require("../../utils/t.js")

// const check = require("../../utils/password.js")

const baseUrl = 'https://temp.l-do.cn/api/login';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountConfig: 'color: #6F6F6F',
    passwordConfig: 'color: #6F6F6F',
    accountInput:'',
    passwordInput:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: s("l") === 0 ? "管理员登陆" : "Admin Login"
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

  // 获得焦点时颜色改变
  onAccountFocus: function() {
    this.setData({'accountConfig': 'color: #2C9A42'});
  },

  onAccountBlur: function() {
    this.setData({ 'accountConfig': 'color: #6F6F6F' });
  },

  onPasswordFocus: function () {
    this.setData({ 'passwordConfig': 'color: #2C9A42' });
  },

  onPasswordBlur: function () {
    this.setData({ 'passwordConfig': 'color: #6F6F6F' });
  },

  // 提交数据
  submit: function() {
    var that = this;
    wx.request({
      url: baseUrl,
      method: "POST",
      data: {
        user_name: that.data.accountInput,
        password: that.data.passwordInput
      },
      success: (res) => {
        if (res.data.code !== "200") {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          return;
        }
        wx.navigateTo({
          url: '../forest/admin/admin',
        })
      }
    })

  },

  // 获得输入
  getAccount: function(e) {
    this.setData({'accountInput': e.detail.value});
  },
  getPassword: function(e) {
    this.setData({'passwordInput': e.detail.value});
  },

  showMessage: function(title, icon, duration) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration
    })
  },
  chagePassword: function() {
    wx.navigateTo({
      url: './change-password',
    })
  }
})

