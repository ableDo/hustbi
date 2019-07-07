// pages/admin/change-password.js

const baseUrl = 'https://temp.l-do.cn'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account_shown: 1,
    password_shown: 0,
    new_password_shown: 0,
    new_password_confirm: 0,
    account: '',
    password: '',
    newPassword: '',
    confirmPassword: ''
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
  getAccount: function(e) {
    this.setData({
      account: e.detail.value,
    })
  },
  getPassword: function(e) {
    this.setData({
      password: e.detail.value,
    })
  },
  getNewPassword: function(e) {
    this.setData({
      newPassword: e.detail.value,
    })
  },
  getConfirmPassword: function(e) {
    this.setData({
      confirmPassword: e.detail.value,
    })
  },
  onAccountFocus: function() {
    this.setData({
      account_shown: 1,
      password_shown: 0,
      new_password_shown: 0,
      new_password_confirm: 0,
    })
  },
  onPasswordFocus: function() {
    this.setData({
      account_shown: 0,
      password_shown: 1,
      new_password_shown: 0,
      new_password_confirm: 0,
    })
  },
  onNewPasswordFocus: function() {
    this.setData({
      account_shown: 0,
      password_shown: 0,
      new_password_shown: 1,
      new_password_confirm: 0,
    })
  },
  onConfirmPasswordFocus: function() {
    this.setData({
      account_shown: 0,
      password_shown: 0,
      new_password_shown: 0,
      new_password_confirm: 1,
    })
  },
  submit: function() {
    let that = this;
    if (!that.data.account || !that.data.password || !that.data.newPassword || !that.data.confirmPassword) {
      wx.showToast({
        title: '不能为空',
      })
      return;
    }
    if (that.data.newPassword !== that.data.confirmPassword) {
      wx.showToast({
        title: '两次输入的密码不相同哦',
      })
      return;
    }
    wx.request({
      url: baseUrl + '/api/login/changepassword',
      method: 'POST',
      data: {
        user_name: that.data.account,
        password: that.data.password,
        newpassword: that.data.newPassword
      },
      success: (res) => {
        if (res.data.code == "303") {
          wx.showToast({
            title: '错误的账号',
          })
          return;
        } else if (res.data.code == "304") {
          wx.showToast({
            title: '密码错误',
          })
          return;
        } else if (res.data.code == "200") {
          wx.showToast({
            title: '修改成功',
          })
          wx.navigateBack()
        } else {
          wx.showToast({
            title: '未知错误',
          })
          return;
        }
      }
    })
  }
})