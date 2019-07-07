const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const genProfile = (relativePath, param, context) => {
  let src = relativePath + Math.floor(Math.random() * 11) + '.png';
  context.setData({
    [param]: src,
  })
}

const baseUrl = 'https://temp.l-do.cn';
const getPic = (context, response, key) => {
  let unfomattedValue = JSON.stringify(response).replace('\n', '');
  let totalValue = JSON.parse(unfomattedValue).data.trends;
  var basePosts = context.data.posts;
  for (let index = 0; index < totalValue.length; index++) {
    let finalTmp = totalValue[index].trend_picture ? baseUrl + '/img/' + JSON.stringify(totalValue[index].trend_picture).split(';')[0].replace(/"/g, '') : '';
    basePosts[index].firstPic = finalTmp;
  }
  context.setData({ [key]: basePosts });
}

const getType = (context, response, key) => {
  let tmp = JSON.stringify(response).replace('\n', '');
  let totalList = JSON.parse(tmp).data.trends;
  let basePosts = context.data.posts;
  for (let index = 0; index < totalList.length; index++) {
    basePosts[index].type = false;
  }
  context.setData({ [key]: basePosts });
}


module.exports = {
  formatTime: formatTime,
  genProfile: genProfile,
  getPic: getPic, 
  getType: getType
}
