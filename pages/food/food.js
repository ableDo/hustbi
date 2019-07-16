// pages/food/food.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadProgress: 0,
    imagePath: '',
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

  onRequestUploadImage: function () {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        this.setData({
          imagePath: res.tempFilePaths[0],
        })
        let p = 0
        setInterval(() => {
          p += 20;
          p = p > 100 ? 100 : p
          this.setData({
            uploadProgress: p,
          })
        }, 2000)
      },
    })
  }
})