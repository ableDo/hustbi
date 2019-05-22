require('./utils/api.js')

const store = require('./utils/store.js')

console.log()
//app.js+
App({
  onLaunch: function() {
    wx.login({
      success: res => {
        wx.showToast({
          title: '登录成功',
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          method: "POST",
          url: store('url'),
          data: JSON.stringify({
            query: `mutation {addUser(encrypt:{code:"${res.code}"}) {userId}}`,
            variables: {}
          }),
          success: (res) => {
            if (res.statusCode === 200) {
              if (res.data.data.addUser.userId) {
                store("userId", res.data.data.addUser.userId)

                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback()
                } else {
                  const loop = () => {
                    if (this.userInfoReadyCallback) {
                      this.userInfoReadyCallback()
                    } else {
                      setTimeout(loop)
                    }
                  }
                  loop();
                }
              } else {
                wx.showToast({
                  title: '获取UserId失败',
                  icon: "none"
                })
              }
            }
          }
        })
      },

      fail() {
        wx.showToast({
          title: '登陆失败！',
          icon: 'none'
        })
      }
    })
  },
  globalData: {
    userInfo: null
  }
})