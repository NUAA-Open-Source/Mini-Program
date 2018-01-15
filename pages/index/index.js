//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    inputShowed: false,
    inputVal: "", //当前输入的查询数据
    searchData: {},
    //song
    teacherIdx: "0",
    orderIdx: "0",
    ordering: [
      { "id": "热度", "name": "ordering=hot" },
      { "id": "评分", "name": "ordering=rate" },
      { "id": "拼音", "name": "ordering=pinyin" }
    ],
    teacherList: [],
    array: [
      { "id": "16", "name": "全部" },
      { "id": "17", "name": "航空宇航学院" },
      { "id": "18", "name": "能源与动力学院" },
      { "id": "19", "name": "自动化学院" },
      { "id": "20", "name": "电子信息工程学院" },
      { "id": "21", "name": "机电学院" },
      { "id": "22", "name": "材料科学与技术学院" },
      { "id": "23", "name": "民航学院" },
      { "id": "24", "name": "理学院" },
      { "id": "25", "name": "经济与管理学院" },
      { "id": "26", "name": "人文与社会科学学院" },
      { "id": "27", "name": "艺术学院" },
      { "id": "28", "name": "外国语学院" },
      { "id": "29", "name": "航天学院" },
      { "id": "30", "name": "计算机科学技术学院" },
      { "id": "31", "name": "马克思主义学院" },
      { "id": "32", "name": "国际教育学院" },
      { "id": "32", "name": "国际教育学院" },
      { "id": "36", "name": "图书馆" },
      { "id": "37", "name": "信息化技术中心/工程训练中心" },
      { "id": "38", "name": "电工电子实验中心" },
      { "id": "39", "name": "教务处" },
      { "id": "40", "name": "基础训练" },
      { "id": "41", "name": "竞赛活动" }
    ]

  },
  //song
  bindOrderChange: function (e) {
    console.log('排序picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      orderIdx: e.detail.value
    });
    var that = this;
    var teacherList = [];

    var requestUrl = 'https://api.taxn.top/teacher/?';
    requestUrl += this.data.teacherIdx == 0 ? '' : 'college=' + this.data.array[this.data.teacherIdx].id + '&';
    requestUrl += this.data.ordering[this.data.orderIdx].name;
    wx.request({
      url: requestUrl,
      data: {
        limit: 8
      },
      success: function (result) {
        // 获取当前页的老师的信息
        for (var i = 0; i < result.data.results.length; i++) {
          teacherList.push(result.data.results[i]);
        }
        that.setData({
          teacherList: teacherList,
        })
      },

      fail: function ({ errMsg }) {
        console.log('request fail', errMsg)
      }
    })

  },
  bindTeacherChange: function (e) {
    console.log('学院picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      teacherIdx: e.detail.value
    });

    var that = this;
    var teacherList = [];

    var requestUrl = 'https://api.taxn.top/teacher/?';
    requestUrl += this.data.teacherIdx == 0 ? '' : 'college=' + this.data.array[this.data.teacherIdx].id + '&';
    requestUrl += this.data.ordering[this.data.orderIdx].name;
    wx.request({
      url: requestUrl,
      
      data: {
        limit:8
      },
      success: function (result) {
        // 获取当前页的老师的信息
        for (var i = 0; i < result.data.results.length; i++) {
          teacherList.push(result.data.results[i]);
        }
        that.setData({
          teacherList: teacherList,
        })
        console.log('request success', result)
      },

      fail: function ({ errMsg }) {
        console.log('request fail', errMsg)
      }
    })
  },
  // 跳转到老师详情的页面
  selectTeacher: function (e) {
    console.log('../teacher/details?search=' + this.data.teacherList[e.currentTarget.id].pinyin + '&ordering=pinyin');
    wx.navigateTo({
      url: '../teacher/index?id=' + this.data.teacherList[e.currentTarget.id].id,
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    var that = this;
    var teacherList = [];
    wx.request({
      url: 'https://api.taxn.top/teacher/?ordering=hot',
      data: {
        limit: 8
      },
      success: function (result) {
        // 获取当前页的老师的信息
        for (var i = 0; i < result.data.results.length; i++) {
          teacherList.push(result.data.results[i]);
        }
        console.log("teacherList");
        console.log(teacherList);
        that.setData({
          teacherList: teacherList,
        })
        //console.log('request success', result)
      },

      fail: function ({ errMsg }) {
        console.log('request fail', errMsg)
      }
    })
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    this.searchInput(e.detail.value);
  },

  // 向服务器发送查找请求
  searchInput: function (inputString) {
    var searchResult = []
    var that = this
    wx.request({
      url: 'https://api.taxn.top/teacher/',
      data: {
        search: inputString,
        ordering: 'hot',
        limit: '15'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        for (var i = 0; i < res.data.results.length; i++) {
          var searchResultKey = res.data.results[i];
          searchResultKey['college'] = app.globalData.table[searchResultKey['college']]
          searchResult.push(searchResultKey);
        }
        that.setData({
          searchData: searchResult
        });
      },
    })
  }
  //song


})
