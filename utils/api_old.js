const sha1 = require("./sha1.js");

let userId = "";

console.log(sha1);

function query(graphql) {
  return new Promise(resolve => {
    wx.request({
      url: "http://123.207.51.86/graphql",
      method: "POST",
      data: JSON.stringify(graphql),
      header: {
        "content-type": "application/json" // 默认值
      },

      success: resolve
    });
  });
}

function mutation(...args) {
  let str = "";
  args
    .map(arg => {
      if (typeof args.then === "function") {
        return arg;
      } else {
        return Promise.resolve(arg);
      }
    })
    .forEach(arg =>
      arg.then(argStr => {
        str += argStr + "\n";
      })
    );
  return query({
    query: `
      mutation {
        ${str}
      }
    `
  });
}

/**
 * @param {string} address
 * @param {number} timestamp
 * @param {string} timeRange
 */
function submitRecycle(userId, address, timestamp, timeRange) {
  return `addRecycle(
      userId: ${userId}, 
      recyclePlace: ${address}, 
      recycleDate: ${timestamp},
      recycleTime: ${timeRange}
    )`;
}

function addUser() {
  return new Promise(resolve => {
    wx.getUserInfo({
      success: function(res) {
        userId = sha1(JSON.stringify(res.userInfo));

        resolve(`addUser( userId: ${userId} )`);
        /*
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        */
      }
    });
  });

  // return
}

// console.log(mutation(addUser()))

function updateUser(realName, qq, phone, address) {
  return `updateUser( name: ${realName}, qq: ${qq}, phone: ${phone}, dorm: ${address} )`;
}

function getUserPoints() {
  return `query bonus(userId: ${userId}) { points }`;
}

module.exports = {
  submitRecycle,
  addUser,
  updateUser,
  getUserPoints,

  query,
  mutation
};
