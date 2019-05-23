
//index.js
//获取应用实例

const s = require("../../utils/store.js")
const t = require("../../utils/t.js")


const app = getApp()
let called = false;

const genTopNavs = () => [{
  image: './icon_steps@3x.png',
  title: t['每日步数'][s('l')],
  id: 'step',
},
{
  image: './icon_forest@3x.png',
  title: t['绿色森林'][s('l')],
  id: 'forest',
},
]

const genNavs = () => [{
  image: './icon_recycle.png',
  title: t['上门回收'][s('l')],
  id: 'recycle',
},
{
  image: './icon_food@3x.png',
  title: t['饮食分析'][s('l')],
  id: 'food-analyze',
},
{
  image: './icon_trash@3x.png',
  title: t['垃圾分类'][s('l')],
  id: 'trash',
},
]


Page({
  data: {
    topNavs: genTopNavs(),
    navs: genNavs(),
    navRoutes: {
      recycle: '/pages/recycle/recycle',
      steps: '/pages/steps/steps',
      "food-analyze": "/pages/food-analyze/food-analyze",
      trash: "/pages/trash/trash"
      // recycle: '/pages/recycle/recycle',
    },

    t,
    l: s("l")
  },
  onLoad: function() {

    wx.setNavigationBarTitle({
      title: s("l") === 0 ? "绿色银行" : "Green Bank"
    })
    app.userInfoReadyCallback = () => {
      called = true
      wx.request({
        url: s("url"),
        method: "POST",
        data: JSON.stringify({
          query: `
            query {
              user(userId: "${s('userId')}") {
                name
                bonus {
                	points
  	            }
                studentId
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

          const { name, studentId } = res.data.data.user
          if (!name) {
            this.onUserAvatarTap();
            wx.showToast({
              title: '请完善个人信息！',
              icon: "none"
            })
            s('isFirst', true);            
          } else {

            s('isFirst', false);
            s('isStuff', !studentId);
          }

          this.setData({
            points: res.data.data.user.bonus.points
          })
        }
      });
    }
  },
  onTopNavTap: function(e) {
    
  },
  onNavTap: function(e) {
    wx.navigateTo({
      url: this.data.navRoutes[e.currentTarget.id],
    })
  },
  onUserAvatarTap: function() {
    wx.navigateTo({
      url: '/pages/userpoints/userpoints',
    })
  },
  onStepTap: function() {
    wx.navigateTo({
      url: '/pages/steps/steps',
    })
  },
  // tap forest
  onForestTap: function() {
    wx.navigateTo({
      url: '/pages/forest/forest'
    })
  },
  onShow() {
    called && app.userInfoReadyCallback && app.userInfoReadyCallback()
  },
  // onHide() {
  //   clearInterval(nagInterval)
  // }

  viewRule() {
    wx.showModal({
      title: "积分兑换规则",
      content: "步数规则: 10000步以上时，每5000步积分加1分，不足时不加分。\n\n上门回收时: 1个塑料瓶=0.5积分，1公斤纸制品=6积分",
      cancelText: '关闭'
    })
  }
})