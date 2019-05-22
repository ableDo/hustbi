// pages/recycle/recycle.js
const s = require("../../utils/store.js")
const t = require("../../utils/t.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateInputFocus: false,
    timeInputFocus: false,
    addressInputFocus: false,

    dateYearError: false,
    dateMonthError: false,
    dateDayError: false,
    timeHourError: false,
    timeMinuteError: false,

    formData: {},

    t,
    l: s("l")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.setNavigationBarTitle({
      title: s("l") === 0 ? "绿色银行" : "Green Bank"
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

  onTimeInputFocus: function() {
    this.setData({
      timeInputFocus: true,
      addressInputFocus: false,
      dateInputFocus: false,
    })
  },

  onTimeInputBlur: function() {
    this.setData({
      timeInputFocus: false,
    })
  },

  onDateInputFocus: function() {
    this.setData({
      dateInputFocus: true,
      addressInputFocus: false,
      timeInputFocus: false,
    })
  },

  onDateInputBlur: function() {
    this.setData({
      dateInputFocus: false,
    })
  },

  onAddressInputFocus: function() {
    this.setData({
      addressInputFocus: true,
      timeInputFocus: false,
      dateInputFocus: false,
    })
  },

  onAddressInputBlur: function() {
    this.setData({
      addressInputFocus: false
    })
  },

  onDateInputYear: function(e) {
    const {
      value
    } = e.detail
    if (isNaN(value) || Number(value) < 2017 || Number(value) > 2117) {
      this.setData({
        dateYearError: true,
      })
    } else {
      this.setData({
        dateYearError: false,
      })
    }

    this.onChange(e);
  },

  onDateInputMonth: function(e) {
    const {
      value
    } = e.detail
    if (isNaN(value) || Number(value) < 1 || Number(value) > 12) {
      this.setData({
        dateMonthError: true,
      })
    } else {
      this.setData({
        dateMonthError: false,
      })
    }

    this.onChange(e);
  },

  onDateInputDay: function(e) {
    const {
      value
    } = e.detail
    if (isNaN(value) || Number(value) < 1 || Number(value) > 31) {
      this.setData({
        dateDayError: true,
      })
    } else {
      this.setData({
        dateDayError: false,
      })
    }

    this.onChange(e);
  },

  onTimeInputHour: function(e) {
    const {
      value
    } = e.detail
    if (isNaN(value) || Number(value) < 0 || Number(value) > 23) {
      this.setData({
        timeHourError: true,
      })
    } else {
      this.setData({
        timeHourError: false,
      })
    }

    this.onChange(e);
  },

  onTimeInputMinute: function(e) {
    const {
      value
    } = e.detail
    if (isNaN(value) || Number(value) < 0 || Number(value) > 60) {
      this.setData({
        timeMinuteError: true,
      })
    } else {
      this.setData({
        timeMinuteError: false,
      })
    }

    this.onChange(e);
  },

  onChange(e) {
    const id = e.target.id
    this.setData({
      formData: {
        ...this.data.formData,
        [id]: e.detail.value
      }
    })
  },

  submit() {
    if (!this.data.dateYearError &&
      !this.data.dateMonthError &&
      !this.data.dateDayError &&
      !this.data.timeHourError &&
      !this.data.timeMinuteError
    ) {
      if (
        this.data.formData['year'] &&
        this.data.formData['month'] &&
        this.data.formData['day'] &&
        this.data.formData['hour'] &&
        this.data.formData['minute'] &&
        this.data.formData['address']
      ) {
        let {
          year,
          month,
          day,
          hour,
          minute,
          address
        } = this.data.formData

        month = month.padStart(2, "0")
        day = day.padStart(2, "0")
        hour = hour.padStart(2, "0")
        minute = minute.padStart(2, "0")

        wx.request({
          url: s('url'),
          data: JSON.stringify({
            query: `
              mutation {
                addRecycle(
                  userId: "${s('userId')}",
                  recycleInfo: {
                    recycleDate: "${year}/${month}/${day}",
                    recycleTime: "${hour}:${minute}",
                    recyclePlace: "${address}"
                  }
                ) {
                  id
                }
              }`
          }),
          method: "POST",
          success: (res) => {
            if (res.statusCode === 200) {
              if (res.data.data.addRecycle.id) {
                wx.showToast({
                  title: '预约成功！'
                })
                setTimeout(() => wx.navigateBack({}), 1000)
                return
              }
            }

            wx.showToast({
              title: `预约失败！`,
              icon: 'none'
            })
          }
        })
      } else {
        wx.showToast({
          title: '请完整填写！',
          icon: 'none'
        })
      }
    }
  }
})