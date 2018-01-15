//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力 存储log日志
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //发起网络请求
          console.log("当前用户的res.code", res.code)
          wx.request({
            url: 'https://api.taxn.top/user/',
            data: {
              appid: '在此处填写appid',
              appsecret: '在此处填写secret',
              code: res.code
            },
            method: 'POST',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log("当前用户的open_id", res.data)
              try {
                wx.setStorageSync('openid', res.data)
              } catch (e) {
                console.log('存储openid-user失败')
              }
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })

  },
  globalData: {
    userInfo: null,
    table: {
      "17": "航空宇航学院",
      "18": "能源与动力学院",
      "19": "自动化学院",
      "20": "电子信息工程学院",
      "21": "机电学院",
      "22": "材料科学与技术学院",
      "23": "民航学院",
      "24": "理学院",
      "25": "经济与管理学院",
      "26": "人文与社会科学学院",
      "27": "艺术学院",
      "28": "外国语学院",
      "29": "航天学院",
      "30": "计算机科学技术学院",
      "31": "马克思主义学院",
      "32": "国际教育学院",
      "32": "国际教育学院",
      "33": "体育部",
      "34": "军事教研室",
      "35": "学生处",
      "36": "图书馆",
      "37": "信息化技术中心/工程训练中心",
      "38": "电工电子实验中心",
      "39": "教务处",
      "40": "基础训练",
      "41": "竞赛活动"
    }
  }
})