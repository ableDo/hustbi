// pages/forest/create/create.js

const baseUrl = 'https://temp.l-do.cn'

const s = require("../../../utils/store.js")
const t = require("../../../utils/t.js")

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
    // is trend
    is_trend: 0,
    // pics to be submitted
    uploadImages: [],
    // max submitted number
    maxImages: 9,
    // if the number to be uploaded reached the max numeber
    isMaxImagesNum: false,

    formData: {},

    pictureNames: '',

    steps: 0,
    bonus: 0,
    carbon: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: s("l") === 0 ? "发布" : "Post"
    });

    var o = JSON.parse(options.formData);
    this.setData({
      formData:{
        studentId: o.studentId,
        name: o.name,
      }
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
        content: '您当前所做更改可能丢失！',
        success: function(res) {
          console.log('wh');
          if (res.confirm) {
            that.setData({
              'hidden': false,
              content: '',
              topic: '',
              is_trend: 0,
            });
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
            that.setData({
               'hidden': true,
               content: '',
               topic: '',
               is_trend: 1,
            });
          }
        }
      })
    }
  },

  // submit
  submit: function() {
    var that = this;
    if (!that.data.topic.length && !that.data.content.length || !that.data.is_trend && !that.data.topic.length) {
      wx.showToast({
        title: '不能发表空内容',
        icon: 'none',
      })
      return;
    }
    if (that.data.uploadImages.length !== 0) {
      // 有图片
      that.uploadImagesOneByOne(that.data.uploadImages, 0, 0, 0, that.data.uploadImages.length);
      return;
    }
    that.onImageLoadedFinished();
  },


  onImageLoadedFinished: function() {
    let that = this;
    wx.request({
      url: baseUrl + '/api/trends',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        user_id: that.data.formData.studentId,
        user_name: that.data.formData.name,
        trend_picture: that.data.pictureNames,
        trend_content: that.data.content,
        is_trend: that.data.is_trend,
        argue_topic: '#' + that.data.topic + '#'
      },
      success: (res) => {
        if (res.statusCode !== 200) {
          wx.showToast({
            title: '网络错误',
          });
          wx.navigateTo({
            url: '../forest',
          })
          return;
        }
        wx.navigateTo({
          url: '../forest',
        })
      }
    })
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
    var that = this;
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

  uploadImagesOneByOne: function(imagePaths, successUp, failUp, count, length) {
    var that = this;
    wx.showLoading({
      title: '正在上传第' + count + '张',
    });
   
    wx.uploadFile({
      url: baseUrl + '/img/',
      filePath: imagePaths[count],
      name: 'image',
      header: {
        'content-type': 'multipart/form-data',
      },
      success: function(e) {
        successUp++;
        let str = JSON.parse(e.data);
        let picName = str.data;
        let baseStr = '';
        if (successUp < length) {
          baseStr = that.data.pictureNames + picName + ';';
        } else {
          baseStr = that.data.pictureNames + picName;
        }
        that.setData({
          pictureNames: baseStr
        });

      },
      failUp: function(e) {
        failUp++;
      },
      complete: function(e) {
        count++;
        if (count == length) {
          wx.showToast({
            title: '上传成功' + successUp + '张',
            icon: 'success',
            duration: 2000
          });
          that.onImageLoadedFinished();
        } else {
          //递归调用，上传下一张
          that.uploadImagesOneByOne(imagePaths, successUp, failUp, count, length);
        }
      }
    })
  },
  generateStepPic: function() {
    let that = this;
    wx.showLoading({
      title: '保存中',
    })
    that.getStep();
    console.log('111');
  },
  getStep: function() {
    const self = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: baseUrl + "/api/auth/login",
            method: 'POST',
            data: {
              code: res.code
            },
            success: function (res) {
              console.log(res.data.data.session_key)
              s("session_key", res.data.data.session_key)
              self.getWeRunData();
            }
          })
        }
      }
    });

  },
  getWeRunData: function () {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.werun'] === false) {
          wx.showModal({
            title: '提示',
            content: '请开启获取微信步数权限',
            showCancel: false,
            confirmText: '知道了'
          })
        } else {
          wx.authorize({
            scope: 'scope.werun',
            success() {
              wx.getWeRunData({
                success: function (res) {
                  wx.request({
                    url: baseUrl + "/api/getwerundata",
                    method: 'POST',
                    header: {
                      "accept": "application/json",
                    },
                    data: {
                      encryptedData: res.encryptedData,
                      iv: res.iv,
                      session_key: s("session_key")
                    },
                    success: function (res) {
                      var step = res.data.data.stepnum
                      const ctx = wx.createCanvasContext('step');
                      //绘制背景图
                      ctx.drawImage('../img/test.png', 0, 0, 375, 600);
                      
                      ctx.save();
                      

                      ctx.restore();
                      //绘制文字
                      ctx.setTextAlign('center')
                      ctx.setFillStyle('#57A838')
                      ctx.setFontSize(30)
                      ctx.fillText(step, 166, 426)//用户昵称
                      ctx.stroke()
                      ctx.draw()
                      wx.canvasToTempFilePath({
                        x: 0,
                        y: 0,
                        width: 375,
                        height: 600,
                        canvasId: 'step',
                        success: function (res) {
                          let tempFilePath = res.tempFilePath;
                          wx.saveImageToPhotosAlbum({
                            filePath: tempFilePath,//canvasToTempFilePath返回的tempFilePath
                            success: (res) => {
                              console.log(res)
                              wx.hideLoading();
                            },
                            fail: (err) => {
                              console.log(err)
                              wx.hideLoading();
                            }
                          })
                        }
                      })
                    }
                  })
                },
                fail: function (res) {
                  wx.showModal({
                    title: '提示',
                    content: '请先关注“微信运动”公众号并设置数据来源，以获取并提供微信步数数据',
                    showCancel: false,
                    confirmText: '知道了'
                  })
                  return;
                }
              })
            },
            fail() {
              wx.showModal({
                title: '提示',
                content: '请开启获取微信步数权限',
                showCancel: false,
                confirmText: '知道了'
              })
            }
          })
        }
      }
    })

  },

  clearAll: function() {
    this.setData({
      topic: '',
      content: '',
      uploadImages: []
    })
  },
})