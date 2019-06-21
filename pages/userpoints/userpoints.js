// pages/userpoints/userpoints.js

const api = require('../../utils/api.js')
const s = require('../../utils/store.js')
const t = require("../../utils/t.js")

const _str = require("../../utils/stringify.js")



const genForm = (isStuff) => {
  const l = s("l");
  return !isStuff ? [
  {
    title: t['真实姓名'][l],
    id: 'name'
  },
  {
    title: t['学号'][l],
    id: 'studentId',
    reg: "^[UIMD][0-9]{9,9}$"
  },
  {
    title: t['手机号'][l],
    id: 'phone',
    reg: "^[0-9]{11,11}$"
  },
  {
    title: t['学校住址'][l],
    id: 'dorm'
  },
  {
    title: t['院系'][l],
    id: 'college'
  }
] : [
    {
      title: t['真实姓名'][l],
      id: 'name'
    },
    {
      title: t['手机号'][l],
      id: 'phone',
      reg: "^[0-9]{11,11}$"
    },
    {
      title: t['部门'][l],
      id: 'dorm'
    }
  ]
  }

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: genForm(false),
    isStuff: false,
    isFirst: true,
    activeInput: '',

    formData: {

    },

    wrongFields: {

    },

    points: "",

    t,
    l: s("l")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: s("l") === 0 ? "绿色银行" : "Green Bank"
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.showLoading({
      title: '正在加载',
    })
    let tmp = JSON.stringify({
      query: `
        query {
          user(userId: "${s('userId')}") {
            id,
		        userId,
		        name,
		        phone,
		        dorm,
            bonus {
            	points
  	        },
		        college,
		        studentId,
          }
        }`
    });
    wx.request({
      url: s("url"),
      method: "POST",
      data: JSON.stringify({
        query: `
        query {
          user(userId: "${s('userId')}") {
            id,
		        userId,
		        name,
		        phone,
		        dorm,
            bonus {
            	points
  	        },
		        college,
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
        console.log(res.data);
        if (!res.data.data.user) {
          res.data.data.user = {};
        }
        this.setData({
          formData: {
            name: res.data.data.user.name,
            studentId: res.data.data.user.studentId,
            phone: res.data.data.user.phone,
            dorm: res.data.data.user.dorm,
            college: res.data.data.user.college
          }
        })
        if (!res.data.data.user.bonus) {
          res.data.data.user.bonus = {};
          res.data.data.user.bonus.points = '';
        }
        this.setData({
          points: res.data.data.user.bonus.points
        })
        console.log(this.data.formData.studentId);
        wx.hideLoading()
      }
    })
  },

  onShow() {
    (s('isFirst') !== undefined) && this.setData({
      isFirst: s('isFirst')
    })

    this.setData({
      isStuff: s('isStuff') || false,
      form: genForm(s('isStuff'))
    })
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

  onFormFocus: function(e) {
    this.setData({
      activeInput: e.target.id
    })
  },

  onFormBlur: function(e) {
    this.setData({
      activeInput: ''
    })
  },

  onFormInput(e) {

    this.setData({
      formData: {
        ...this.data.formData,
        [e.target.id]: e.detail.value
      },
      wrongFields: {
        ...this.data.wrongFields,
        [e.target.id]: false
      }
    })
  },

  submit(e) {

    const str = (formData) => {
      const r = {};
      for (const i of this.data.form) {
        r[i.id] = this.data.formData[i.id]
      }

      console.log(r)
      return _str(r);
    }
    const data = this.data.formData
    let missingFiled = 0;

    for (const d of this.data.form) {
      let {
        reg,
        title,
        id
      } = d;
      if (!data[id]) {
        missingFiled++;
        continue
      }
      if (reg) {
        reg = new RegExp(reg);
        if (!reg.test(data[id])) {
          console.log(reg, data[id])
          this.setData({
            wrongFields: {
              ...this.data.wrongFields,
              [id]: true,
            }
          })
          return;
        }
      }
    }

    if (missingFiled > 0) {
      wx.showToast({
        title: '请完整填写！',
        icon: 'none'
      })

      return;
    }

    if (s('userId')) {
      console.log(this.data.formData)
      wx.request({
        url: s("url"),
        method: "POST",
        data: JSON.stringify({
          query: `
            mutation {
              updateUser(userId: "${s('userId')}", userInfo: ${str(this.data.formData)}) {
                name
              }
            }`,
          variables: {}
        }),
        success(res) {
          if (res.statusCode === 200 && !res.data.errors) {
            wx.showToast({
              title: '保存成功！',
            })
            s('isFirst', false)
            setTimeout(() => wx.navigateBack({}), 1000)
          } else {
            wx.showToast({
              title: '保存失败！',
              icon: 'none'
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '获取UserId失败',
        icon: "none"
      })
    }

  },

  stuffChannel() {
    this.setData({
      form: genForm(!this.data.isStuff),
      isStuff: !this.data.isStuff,
    })    
  },

  viewRule() {
    wx.showModal({
      title: "积分兑换规则",
      content: "步数规则: 10000步以上时，每5000步积分加1分，不足时不加分。\n\n上门回收时: 1个塑料瓶=0.5积分，1公斤纸制品=6积分",
      cancelText: '关闭'
    })
  }
})