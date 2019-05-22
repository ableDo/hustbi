const store = {}

function s(key, value) {
  if (key === undefined) {
    return store;
  }
  if (value !== undefined) {
    store[key] = value
  }
  return typeof store[key] === "function"
    ? store[key]()
    : store[key]
}

// s("url", "https://hustbi.cn/graphql")
s("url", () => `https://temp.l-do.cn/graphql?t=${Date.now()}`)
s("date", new Date().toLocaleDateString())


wx.getSystemInfo({
  success(res) {
    s("l", res.language === "zh_CN" ? 0 : 1)
    wx.setNavigationBarTitle({
      title: s("l") === 0 ? "绿色银行": "Green Bank"
    })
  }
})

module.exports = s