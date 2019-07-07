// pages/steps/steps.js

const s = require("../../utils/store.js")
const t = require("../../utils/t.js")
const str = require("../../utils/stringify.js")


const genPages = () => {
  const l = s("l");

  return [
    [{
      src: './icon_door_w@2x.png',
      title: t['上门回收'][l],
      url: '/pages/recycle/recycle'
    },
    {
      src: './icon_food_w@2x.png',
      title: t['饮食分析'][l],
      url: '/pages/food-analyze/food-analyze'
    },
    {
      src: './icon_trash_w@2x.png',
      title: t['垃圾分类'][l],
      url: '/pages/trash/trash'
    },
    ],
    [{
      src: './icon_bus.png',
      title: '公交出行',
      url: '/pages/bus/bus'
    },],
  ]
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPageIndex: 0,
    pages: genPages(),

    steps: 0,
    bonus: 0,
    carbon: 0,

    t,
    l: s("l")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData(s('stepData'))

    wx.showLoading({
      title: '正在加载步数...',
    })

    wx.setNavigationBarTitle({
      title: s("l") === 0 ? "绿色银行" : "Green Bank"
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.getWeRunData({
      success: (res) => {
        const { errMsg: _, ...rest } = res
        rest["date"] = s('date')
        wx.request({
          url: s('url'),
          method: "POST",
          data: JSON.stringify({
            query: `
              mutation {
                addSteps(userId: "${s('userId')}", stepsInfo: ${str(rest)} ) {
	              	steps,
	              	addBonus,
	              	reduceCarbon
                }
              }`
          }),
          success: (res) => {
            if (res.statusCode === 200) {
              if (res.data.data.addSteps) {
                const {
                  addBonus,
                  reduceCarbon,
                  steps
                } = res.data.data.addSteps

                const data = {
                  bonus: addBonus,
                  carbon: (reduceCarbon / 1000).toFixed(1) + "kg",
                  steps,
                }
                this.setData(data)
                s('stepData', data)
                wx.hideLoading()
              }
            }
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  onPreviousTap: function() {
    if (this.data.currentPageIndex === 0) return
    this.setData({
      currentPageIndex: this.data.currentPageIndex - 1,
    })
  },

  onNextTap: function() {
    if (this.data.currentPageIndex === this.data.pages.length - 1) return
    this.setData({
      currentPageIndex: this.data.currentPageIndex + 1,
    })
  },

  onNavsIconTap: function(e) {
    wx.navigateTo({
      url: this.data.pages[this.data.currentPageIndex][e.target.dataset.id].url || '',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
})