// pages/clothes/clothes.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputData: [['', '']],
    step: 1,
    images: [],
  },

  status: {},

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
  onMyInputClothes: function (e) {
    const i = parseInt(e.detail.id / 2)
    const ii = e.detail.id % 2
    const value = e.detail.value

    const preCompletation = !!this.data.inputData[i][0] && !!this.data.inputData[i][1]
    const completation = !!value && !!this.data.inputData[i][1 - ii]
    const allClear = !value && !this.data.inputData[i][1 - ii]

    const needToPush = (preCompletation === !completation) && completation
    const needToPop = (preCompletation === !completation) && !completation
    
    const inputData = JSON.parse(JSON.stringify(this.data.inputData))
    
    inputData[i][ii] = value

    // inputData = inputData.filter((data) => data[0] || data[1])

    if (needToPush && (!this.status[i] || i === this.data.inputData.length - 1)) {
      this.status[i] = true
      inputData.push(['', ''])
    }

    if (needToPop && i === this.data.inputData.length - 2) {
      const lastData = this.data.inputData[this.data.inputData.length - 1]
      if (!lastData[0] && !lastData[1]) {
        inputData.pop()        
      }
    }
    

    this.setData({
      inputData,
    })
  },

  nextStep: function () {
    wx.showModal({
      title: '温馨提示',
      content: '未完整填写的衣物会被忽略，点击确定下一步',
      success: (res) => {
        if (res.confirm) {
          if (this.data.inputData.filter((data) => data[0] && data[1]).length > 0) {
            this.setData({
              step: 1
            })
          } else {
            wx.showModal({
              title: '温馨提示',
              content: '请至少完整填写一个衣物',
            })
          }
        } else if (res.cancel) {
        }
      }
    })
  },

  onRequestUpload: function () {
    wx.chooseImage({
      success: (res) => {
        const tempImages = [].concat(this.data.images, res.tempFilePaths)
        this.setData({
          images: tempImages,
        })
      },
    })
  },

  onEmpty: function () {

  },
})