const QUERY = {}

QUERY.ADD_USER_QUERY =
`
mutation addUser($en: UserId) {
  addUser(encrypt: $en) {
    id
    userId
  }
}
`


QUERY.GET_POINTS_QUERY = 
`query getPoints($userId: ID!) {
  bonus(userId: $userId) {
    id
    points
  }
}
`

QUERY.ADD_POINTS_QUERY =
`mutation addPoints($userId: ID!, $points: Float) {
  addBonusPoints(userId: $userId, bonusPoints :$points) {
    id
  }
}`

QUERY.GET_RECYCLE_QUERY =
`query getRecycle($userId: ID!) {
  recycle(userId: $userId) {
    id
    recycleTime
    recycleDate
    reducedBonus
  }
}`

QUERY.ADD_RECYCLE_QUERY =
`mutation addRecycle($userId: ID!, $info: RecycleInfo) {
  addRecycle(userId: $userId, recycleInfo: $info) {
    id
  }
}`

let userId = '1234'

function getPoints() {
  wx.request({
    method: 'POST',
    url: 'http://139.199.90.123:3000/graphql',
    data: JSON.stringify({
      query: GET_POINTS_QUERY,
      variables: {
        userId
      }
    }),
    success (res) {
      console.log(res.data)
    }
  })
}

const constify = key => key.replace(/([A-Z])/, ($) => `_${$}`).toUpperCase()

module.exports = new Proxy({}, {
  get: function (target, key) {
    return function (variables = {}) {
      return new Promise((resolve, reject) => {
        wx.request({
          method: 'POST',
          url: 'http://123.207.51.86:3000/graphql',
          data: JSON.stringify({
            query: QUERY[`${constify(key)}_QUERY`],
            variables: {
              ...variables,
              userId
            }
          }),
          success(res) {
            resolve(res)
          },
          fail(error) {
            reject(error)
          }
        })
      })
    }
  }
});