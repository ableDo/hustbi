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

    // 上传的案例图片集合
    uploadImages: [],
    // 设置上传案例图片的最大数目
    maxImages: 9,
    // 案例图片数目是否达到了最大数目
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
      
    }
  },
  bindTopicInput: function(e) {
    this.setData({topic: e.detail.value});
  },
  bindContentInput: function(e) {
    this.setData({content: e.detail.value });
  },


  // 选择图片
  chooseImageTap: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },

  // 选图
  chooseWxImage: function (type) {
    let _this = this;
    var picsItems;
    wx.chooseImage({
      // 相关属性设置
      count: _this.data.maxImages,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        var imgsrc = res.tempFilePaths;
        // concat数组连接，且不会改变现有数组
        var picss = _this.data.uploadImages.concat(imgsrc);
        var imagesArr = '';
        if (picss.length >= _this.data.maxImages) {
          _this.setData({
            isMaxImagesNum: true
          });
        }
        // 判断选择的数量是否超过设定数量
        let num = picss.length <= _this.data.maxImages ? picss.length : _this.data.maxImages;
        for (var i = 0; i < num; i++) {
          imagesArr += '{"imgurl":"' + picss[i] + '"},';
        }
        imagesArr = JSON.parse('[' + imagesArr.substring(0, imagesArr.length - 1) + ']');
        _this.setData({
          uploadImages: picss,
          picsItems: imagesArr
        });
      }
    })
  },

  // 预览所选图片
  selImagePre: function (e) {
    let _this = this;
    wx.previewImage({
      urls: this.data.uploadImages,
      current: e.currentTarget.dataset.src
    })
  },

})