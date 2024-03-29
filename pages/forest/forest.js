// pages/forest/forest.js

const s = require("../../utils/store.js")
const t = require("../../utils/t.js")
const baseUrl = 'https://temp.l-do.cn'

const utils = require('../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    scroll: 0,
    scrollTop: 0,
    hidden: false,
    chat: false,
    search: false,
    moments: false,
    total: true,

    windowHeight: 0,
    windowWidth: 0,
    navbarHeight: 0,
    scrollerViewHeight: 0,

    posts: {},
    tmpPosts: {},
    searchInput: '',

    favorList:{},
    isFirst: true,

    formData: {
      isStuff: false,
    },

    t,
    l: s("l"),
    path: "./img/profile-1.png",

    unrefreshing: true,
  },

 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: s("l") === 0 ? "绿色森林" : "Green Forest"
    });

    utils.genProfile("./img/profile-", 'path', this);
    // this.genProfile();
    this.onLoadUserInfo();

    let that = this;
    // get window height
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
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

  // 加载用户信息
  onLoadUserInfo: function() {
    wx.showLoading({
      title: '正在加载',
    });
    wx.request({
      url: s('url'),
      method: 'POST',
      data: JSON.stringify({
        query: `
        query {
          user(userId: "${s('userId')}") {
            name,
		        studentId,
          }
        }`
      }),
      success: (res) => {
        if (res.statusCode !== 200) {
          wx.showToast({
            title: '获取用户信息失败！',
            icon: "none"
          })
          return;
        }
        if (!res.data.data.user) {
          this.setData({
            formData: {
              name: "游客",
              studentId: '',
            }
          });
          wx.hideLoading();
          return;
        }
        this.setData({
          formData: {
            name: res.data.data.user.name,
            studentId: res.data.data.user.studentId,
          }
        });
        wx.hideLoading();
      }
    })
    this.getData();
  },

  // 点击用户头像
  onUserTap: function() {
    console.log(this.data.formData)
    let formData = JSON.stringify(this.data.formData);
    wx.navigateTo({
      url: '/pages/forest/user/user?formData=' + formData,
    })
  },

// 查询特定内容
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

  // 只看讨论
  onDiscussionTap: function() {
    let that = this;
    if (!that.data.chat) {
      that.setData({
      search: false,
      chat: true,
      moments: false
      });
      for (let i = 0; i < that.data.posts.length; i++) {
        if (that.data.posts[i].is_trend == 1) {
          let tmp = 'posts[' + i + '].type';
          that.setData({ [tmp]: true });
        } else {
          let tmp = 'posts[' + i + '].type';
          that.setData({ [tmp]: false });
        }
      }
    } else {
      that.setInitState();
      for (let i = 0; i < that.data.posts.length; i++) {
        let tmp = 'posts[' + i + '].type';
        that.setData({ [tmp]: false });
      }
    } 
  },

  // 只看动态
  onTrendTap: function() {
    let that = this;
    if (!that.data.moments) {
      that.setData({
      search: false,
      chat: false,
      moments: true
      });
      for (let i = 0; i < that.data.posts.length; i++) {
        if (that.data.posts[i].is_trend == 1) {
          let tmp = 'posts[' + i + '].type';
          that.setData({[tmp] : false});
        } else {
          let tmp = 'posts[' + i + '].type';
          that.setData({[tmp] : true });
        }
      }
    } else {
      that.setInitState();
      for (let i = 0; i < that.data.posts.length; i++) {
        let tmp = 'posts[' + i + '].type';
        that.setData({ [tmp]: false });
      }
    }
  },

  // 发布新内容
  onCreateTap: function() {
    var o = JSON.stringify(this.data.formData);
    if (!o) {
      wx.showLoading({
        title: '未登陆情况下不能发表评论！',
        icon: null,
      });
      return;
    }
    wx.navigateTo({
      url: '../forest/create/create?formData=' + o,
    })
  },
  // 设置初始状态
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

  },

  // 点击卡片查看详情
  onTapCertainCard: function(e) {
    let dataBean = JSON.stringify(e.currentTarget.dataset.item)
    let formData = JSON.stringify(this.data.formData);
    console.log(formData);
    let str1 = './detail/trend?dataBean=' + dataBean + '&formData=' + formData;
    let str2 = './detail/discussion?dataBean=' + dataBean + '&formData=' + formData;
    console.log(str1);
    wx.navigateTo({
      url: e.currentTarget.dataset.item.is_trend == "1" ? str1 : str2,
    })
  },

  // 获取列表数据
  getData: function() {
    var that = this;
    wx.request({
      url: baseUrl + '/api/trends',
      method: "GET",
      success: (res) => {     
        console.log(res); 
        let statusCode = res.data.data.code;
        if (statusCode !== 200 && statusCode !== "200") {
          that.setData({
             posts: res.data.data.trends,
             tmpPosts: res.data.data.trends,
          });
          utils.getPic(that, res.data, 'posts');
          utils.getType(that, res.data, 'posts');
          that.getState(res.data);
        } else {
          wx.showToast({
            title: '未知错误',
          })
        }
      }
    })
  },

  // 点赞
  onTapFavor: function(e) {
    let that = this;
    var index = e.currentTarget.dataset.item;
    var o = {};
    wx.request({
      url: baseUrl + '/api/trends/favor',
      method: 'PUT',
      data: {
        trend_id: that.data.posts[index].trend_id ,
        user_id: that.data.formData.studentId,
      },
      complete: function(res) {
        if (res.data.code == 200 ) {
          let str = 'posts[' + index + '].state';
          let number = that.data.posts[index].favor_num + 1;
          let str2 = 'posts[' + index + '].favor_num'
          that.setData({
            [str]: 1,
            [str2]: number,
          });
        } else if (res.data.code == 305) {
            wx.showToast({
              title: '您已经点过赞了',
              icon: 'none',
            });
            return;
          }else {
          wx.showToast({
            title: '似乎有网络错误哦',
          })
        }
      }
    })
  },

  getState: function (value) {
    let that = this;
    let totalList = JSON.parse(JSON.stringify(value).replace('\n', '')).data.trends;
    for (let index = 0; index < totalList.length; index++) {
      wx.request({
        url: baseUrl + '/api/trends/favor/status',
        method: "PUT",
        data: {
          user_id: that.data.formData.studentId,
          trend_id: that.data.posts[index].trend_id,
        },
        success: (res) => {
          if (res.data.data.isfavor == 1) {
            let str = 'posts[' + index + '].state';
            that.setData({
              [str]: 1,
            })
          } else {
            let str = 'posts[' + index + '].state';
            that.setData({
              [str]: 0,
            })
          }
        }
      })
    };
  },

  onTapScrollToTop: function() {
    this.setData({
      scrollTop: 0,
    })
  },
  getSearchInput: function(e) {
    this.setData({
      searchInput: e.detail.value,
    })
  },
  search: function() {
    let that = this;
    wx.request({
      url: baseUrl + '/api/searchtrends/?word=' + that.data.searchInput,
      success: (res) => {
        that.setData({
          posts: res.data.data.trends,
        })
      }
    });
    // console.log(that.data.posts);
  },
  back: function() {
    let that = this;
    that.setData({
      posts: that.data.tmpPosts,
      search: false,
    })
  },
  onScrollToUpper: function(e) {
    var that = this;
    if (that.data.scroll <= 2 ) {
      return;
    }
    that.setData({
      unrefreshing: false,
    })
    that.getData();
    setTimeout(function(){
      that.getData();
      that.setData({
        unrefreshing: true,
      });
      that.setInitState();
    }, 3000);
  },
  onScroll: function(e) {
    console.log(e);
    this.setData({
      scroll: e.detail.scrollTop,
    })
  }
})