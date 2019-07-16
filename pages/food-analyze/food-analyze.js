// pages/food-analyze/food-analyze.js

const s = require('../../utils/store.js')
const t = require("../../utils/t.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    meals: [],
    reduce_carbon: 0,
    tree: 0,
    reduce_calory: 0,

    t,
    l: s("l")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData(s('mealsData') || {})

    wx.setNavigationBarTitle({
      title: s("l") === 0 ? "绿色银行" : "Green Bank"
    })
  },

  loadFoodByType(_type) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: s('url'),
        method: "POST",
        data: JSON.stringify({
          query: `
            query {
              food(userId: "${s('userId')}", date: "${s('date')}", type: "${_type}") {
                foods {
                  name
              	  code
          			  calory
          			  weight
          			  name
          			  thumb_image_name
          			  is_liquid
                }
              }
            }`
        }),
        success(res) {
          if (res.statusCode === 200) {
            resolve(res.data.data)
          } else {
            reject(res.data)
          }
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.showLoading({
      title: '正在加载...',
    })
    const meals = ['breakfast', "lunch", "dinner", "addmeal"]
    Promise
      .all(meals.map((meal) => this.loadFoodByType(meal)))
      .then((d) => {
        const map = {
          breakfast: "早餐",
          lunch: "午餐",
          dinner: "晚餐",
          addmeal: "加餐"
        }
        const data = d
          .map((d, i) => ({ ...d.food, name: map[meals[i]], id: meals[i] }))
          .filter(({ foods }) => foods.length > 0)
          .map((d) => {
            return {
              ...d,
              foods: d.foods.map((food) => ({
                count: food.code.split(":")[1],
                overallWeight: +food.weight * +food.code.split(":")[1],
                ...food
              })),
            }
          })


        this.setData({
          meals: data
        })
        s('mealsData', {
          meals: data
        })
        wx.hideLoading()
      })

    wx.request({
      url: s('url'),
      method: "POST",
      data: JSON.stringify({
        query: `
          query {
            foodEnergy(userId: "${s('userId')}", date: "${s('date')}") {
              reduce_carbon
              tree
              reduce_calory
            }
          }`
      }),
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            ...res.data.data.foodEnergy
          })
        }
      }
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

  onMealTap: function(e) {
    if (e.target.id && e.target.id !== "wrapper") {
      wx.navigateTo({
        url: `/pages/food-list/food-list?meal=${e.target.id}`,
      })
    }
  },

  onFoodListTap(e) {
    // const map = {
    //   "早餐": "breakfast",
    //   "午餐": "",
    //   "晚餐": "",
    //   "加餐": "",      
    // }
    wx.navigateTo({
      url: `/pages/food-list/food-list?meal=${e.currentTarget.dataset.type}`,
    })
  }
})