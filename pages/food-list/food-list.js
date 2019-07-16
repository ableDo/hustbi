// pages/food-list/food-list.js

const s = require("../../utils/store.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    meal: null,
    currentPage: 0,
    search: null,
    foods: [],

    countMap: {},
    caloryMap: {},

    page: 0,
    totalPage: -1,
    mealName: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const mealName = ({
      breakfast: "早餐",
      lunch: "午餐",
      dinner: "晚餐",
      addmeal: "加餐"
    })[options.meal]

    this.setData({
      meal: options.meal,
      mealName
    })

    wx.setNavigationBarTitle({
      title: '添加' + mealName
    })

    this.getCountMap().then(() => {
      this.loadMore();
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
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

  loadMore(e) {
    if (this.data.page === this.data.totalPage) {
      return
    }
    clearTimeout(this.data.t)
    const t = setTimeout(() => {
      if (this.data.search) {
        wx.request({
          url: s("url"),
          method: "POST",
          data: JSON.stringify({
            query: `
              query {
                foodSearch(name: "${this.data.search}") {
                  name
                  code
              		calory
              		weight
              		name
              		thumb_image_name
              		is_liquid
                }
              }`
          }),
          success: (res) => {
            if (res.statusCode === 200) {
              const foods = res.data.data.foodSearch
              this.setData({
                foods
              })
            }
          }
        })
      } else {
        if (this.data.search === "") {
          this.setData({
            currentPage: 0,
            search: null,
            page: 0,
            totalPage: -1,
            foods: []
          })
        }
        const success = (res) => {
          if (res.statusCode === 200) {
            const {
              foods,
              page,
              total_pages
            } = res.data.data.foodPage
            this.setData({
              foods: [
                ...(this.data.foods || []),
                ...foods,
              ],
              totalPage: total_pages,
              page,
            });

            s(page, res.data.data.foodPage);
          }
        }
        const p = this.data.currentPage + 1
        this.setData({
          currentPage: p
        })
        if (s(p)) {
          success({
            data: {
              data: {
                foodPage: s(p)
              }
            },
            statusCode: 200
          })
          return;
        }
        wx.request({
          url: s("url"),
          method: "POST",
          data: JSON.stringify({
            query: `
              query {
                foodPage(page: ${p}) {
                  page
                  total_pages
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
          success
        })
      }
    }, 500)

    this.setData({
      t
    })
  },

  onDeTap(e) {
    const [_, id] = e.currentTarget.id.match(/^de_(.*?)$/)
    if (!this.data.countMap[id]) {
      return;
    }

    this.setData({
      countMap: {
        ...this.data.countMap,
        [id]: (this.data.countMap[id] || 0) - 1
      },
      caloryMap: {
        ...this.data.caloryMap,
        [id]: e.currentTarget.dataset.calory
      }
    })
  },

  onInTap(e) {
    const [_, id] = e.currentTarget.id.match(/^in_(.*?)$/)

    this.setData({
      countMap: {
        ...this.data.countMap,
        [id]: (this.data.countMap[id] || 0) + 1
      },
      caloryMap: {
        ...this.data.caloryMap,
        [id]: e.currentTarget.dataset.calory
      }
    })
  },

  submit() {
    let sum = 0;
    let calorySum = 0;
    for (const key in this.data.countMap) {
      sum += this.data.countMap[key]
      calorySum += +this.data.caloryMap[key] * this.data.countMap[key]
    }

    // wx.request({
    //   url: '',
    // })

    if (sum === 0) {
      wx.showToast({
        title: '你还没有选任何食物!',
        icon: 'none'
      })
      return;
    }

    wx.request({
      url: s('url'),
      method: "POST",
      data: JSON.stringify({
        query: `
          mutation {
            addFood(
              userId: "${s('userId')}",
              foodInfo: {
                date:"${s('date')}",
                type: "${this.data.meal}",
                foodsCode: ${JSON.stringify(Object.entries(this.data.countMap).map(([k,v]) => `${k}:${v}`))},
                calory: ${calorySum}
              }
            )
          }`
      }),
      success: (res) => {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '添加成功！'
          })
          setTimeout(() => wx.navigateBack({}), 1000)
          return
        }
      }
    })
  },

  onSearchInput(e) {
    clearTimeout(this.data.t2)
    setTimeout(() => {
      this.setData({
        search: e.detail.value,
        currentPage: 1,
        page: 1,
        totalPage: -1,
      })
      this.loadMore();
    }, 500)
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

  getCountMap() {
    const meals = ['breakfast', "lunch", "dinner", "addmeal"]
    return Promise
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
      

        const r = data.find((d) => d.name === this.data.mealName)
        if (!r) {
          return;
        }
        
        const { foods } = r;
        
        const countMap = {};
        const caloryMap = {};        
        for (const food of foods) {
          const [k, v] = food.code.split(":")

          countMap[k] = +v;
          caloryMap[k] = food.calory
        }

        this.setData({
          countMap,
          caloryMap
        })
      })
  }
})