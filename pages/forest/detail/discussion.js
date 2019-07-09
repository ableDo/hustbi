// pages/forest/detail/discussion.js
// 讨论

const baseUrl = 'https://temp.l-do.cn'

const s = require("../../../utils/store.js")
const t = require("../../../utils/t.js")
const utils = require("../../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataBean: '',
    pictures: '',

    formData:{
    },
    content: '',
    chat:{},

    isTrend: 0,
    isStuff: 0,
    t,
    l: s("l"),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: s("l") === 0 ? "动态详情" : "Detail"
    });

    // console.log(options);
    var that = this;
    console.log(options);
    let dataBean = JSON.parse(options.dataBean);
    let formData = JSON.parse(options.formData);
    if (options.isStuff) {
      that.setData({
        isStuff: 1
      })
    }
    that.setData({
      dataBean: dataBean,
      formData: {
        studentId: formData.studentId,
        name: formData.name,
      }
    })
    console.log(that.data.dataBean);
    that.loadPic(dataBean.trend_picture);
    that.getArguments();
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

  submit: function() {
    let that = this;
    if (!that.data.content) {
      wx.showToast({
        title: '不能为空',
        icon: 'none'
      })
      return;
    }
    let src = 'argue_content';
    wx.request({
      url: baseUrl + '/api/argues',
      method: "POST",
      data: {
        trend_id: that.data.dataBean.trend_id,
        user_id: that.data.formData.studentId,
        user_name: that.data.formData.name,
        argue_content: that.data.content,
      },
      complete: function(res) {
        if (res.data.code !== '200') {
          wx.showToast({
            title: '未知错误！',
            icon: 'none',
          })
        } else {
          wx.showToast({
            title: '评论成功',
            icon: 'success',
          })
          that.getArguments();
          that.setData({
            content: '',
          })
        }
      }
    })
  },
  // 加载图片
  loadPic: function(value) {
    var that = this;
    var pictures = {};
    var tmp = JSON.stringify(value).split(';');
    for (var index = 0; index < tmp.length; index++) {
      pictures[index] = baseUrl + '/img/normal/' + tmp[index].replace(/"/g, '');
    }
    that.setData({pictures: pictures});
    
  },

  // 举报
  onTapWarn: function(e) {
    let that = this;
    wx.request({
      url: baseUrl + '/api/trends/report/' + that.data.dataBean.trend_id,
      method: 'POST',
      complete: function(res) {
        if (res.data.code !== '200') {
          wx.showToast({
            title: '举报失败！',
            icon: 'none',
          })
        } else {
          wx.showToast({
            title: '举报成功！',
            icon: 'success',
          })
        }
      }
    })
  },
  onTapFavorArgue : function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let id = that.data.chat[index].folowargue_id, num = that.data.chat[index].favor_num;
    let str1 = 'chat[' + index + '].favor_num'; 
    let str2 = 'chat[' + index + '].isfavored';
    wx.request({
      url: baseUrl + '/api/argues/favor/status',
      method: "PUT",
      data: {
        user_id: that.data.formData.studentId,
        argue_id: id,
      },
      success: (res) => {
        if (res.data.data.isfavor == "1") {
          wx.showToast({
            title: '点过赞了哦',
            icon: 'none'
          });
          return;
        }
        wx.request({
          url: baseUrl + '/api/argues/favor/',
          method: "PUT",
          data: {
            user_id: that.data.formData.studentId,
            user_name: that.data.formData.name,
            argue_id: id,
          },
          success: (res) => {
            that.setData({
              [str1]: num += 1,
              [str2]: 1,
            })
          }
        })
        
      }
    })


    
    
  },

  // 点赞，没写呢
  onTapFavor: function(e) {
    let that = this;
    if (that.data.dataBean.state) {
      wx.showToast({
        title: '您已经点过赞了',
        icon: 'none',
      });
      return;
    }
    wx.request({
      url: baseUrl + '/api/trends/favor',
      method: 'PUT',
      data: {
        trend_id: that.data.dataBean.trend_id,
        user_id: that.data.formData.studentId,
      },
      complete: function (res) {
        if (res.data.code == 200) {
          let str = 'dataBean.state';
          that.setData({
            [str]: 1,
          });
        } else {
          wx.showToast({
            title: '似乎有网络错误哦',
          })
        }
        that.getArguments();
      }
    })
  },

  getInput: function(e) {
    this.setData({
      content: e.detail.value,
    })
  },

  getArguments: function() {
    var that = this;
    wx.request({
      url: baseUrl + '/api/argues/relevent?trend_id=' + that.data.dataBean.trend_id + '&user_id=' + that.data.formData.studentId ,
      method: "GET",
      complete: (res) => {
        console.log(res);
        let o = res.data.data.data;
        if (o) {
          that.setData({
            chat: o,
          })
          that.genProfile();
        }
      }
    })
  },
  genProfile: function() {
    let that = this;
    for (let i = 0; i < that.data.chat.length; i++) {
      let path = '../img/profile-' + Math.floor(Math.random() * 11) + '.png';
      let str = 'chat[' + i + '].path'; 
      that.setData({
        [str]: path,
      })
    }
  }

})