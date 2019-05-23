function c (obj) {
  for (const k in obj) {
    obj[k] = [k, obj[k]]
  }

  return obj
}


module.exports = c({
  "积分值": "My Points",
  "查看积分兑换规则": "View point exchange rules",
  "绿色森林": "Green Forest",
  "上门回收": "Recycle",
  "饮食分析": "Food Analyze",
  "垃圾分类": "Trash",
  "每日步数": "Daily Step",
  "宿舍地址": "Dormitory",
  "例如：韵苑X栋": "Like Yunyuan No.X",
  "回收日期": "Recycle Date",
  "回收时间": "Recycle Time",
  "年": "Y",
  "月": "M",
  "日": "D",
  "时": "Hr",
  "分": "Min",

  "每次预约将会扣除一定积分": "Some points will be charged for each reservation",
  "预约": "Submit Reservation",

  "员工": "Staffs",
  "学生": "Students",
  "通道": "Chunnel",


  "真实姓名": "Full Name",
  "学号": "StudentId",
  "手机号": "Phone",
  "学校住址": "Dormitory",
  "院系": "School",

  "请输入垃圾名称搜索": "Enter trash name to search",

  "今日减少碳排放": "Carbon Emission Reduced Today",
  "相当于": "Equals To",
  "棵树": " Tree(s)",
  "减少耗能": "Reduced Energy Consumption",
  "早餐": "Breakfast",
  "午餐": "Lunch",
  "晚餐": "Dinner",
  "加餐": "Extra",
  "暂时没有饮食记录": "No Food Record Yet",

  "碳足迹": "Green Footprint",
  "昨日": "Yesterday",
  "积分": "Point(s)",
  "减少了": "Reduced",
  "排放": ""
})