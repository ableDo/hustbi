// pages/forest/create/create.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // max length of input text
    'maxlength': 1200,
    // if the topic box is shown
    hidden: false,
    // topic input
    topic: '',
    // content input
    content: '',
    // pics to be submitted
    uploadImages: [],
    // max submitted number
    maxImages: 9,
    // if the number to be uploaded reached the max numeber
    isMaxImagesNum: false,
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

  // switch chat page
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

  // switch moments page
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

  // submit
  submit: function() {
    if (!this.data.hidden && this.data.topic.length === 0) {
      // 懒得写了现在
    }
  },
  bindTopicInput: function(e) {
    this.setData({topic: e.detail.value});
  },
  bindContentInput: function(e) {
    this.setData({content: e.detail.value });
  },


  // choose pictures
  chooseImageTap: function () {
    let that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },

  // 选图
  chooseWxImage: function (type) {
    let that = this;
    var picsItems;
    wx.chooseImage({
      // 相关属性设置
      count: that.data.maxImages,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        var imgsrc = res.tempFilePaths;
        // concat数组连接，且不会改变现有数组
        var picss = that.data.uploadImages.concat(imgsrc);
        var imagesArr = '';
        if (picss.length >= that.data.maxImages) {
          that.setData({
            isMaxImagesNum: true
          });
        }
        // 判断选择的数量是否超过设定数量
        let num = picss.length <= that.data.maxImages ? picss.length : that.data.maxImages;
        for (var i = 0; i < num; i++) {
          imagesArr += '{"imgurl":"' + picss[i] + '"},';
        }
        imagesArr = JSON.parse('[' + imagesArr.substring(0, imagesArr.length - 1) + ']');
        that.setData({
          uploadImages: picss,
          picsItems: imagesArr
        });
      }
    })
  },

  // 预览所选图片
  selImagePre: function (e) {
    let that = this;
    wx.previewImage({
      urls: this.data.uploadImages,
      current: e.currentTarget.dataset.src
    })
  },

})