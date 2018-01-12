//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    inputShowed: false,
    inputVal: "", //当前输入的查询数据
    searchData : {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  
  onLoad: function () {

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
    if (e.detail.value.length>1){
      this.searchInput(e.detail.value)
    }
  },
  
  // 向服务器发送查找请求
  searchInput:function(inputString){
    var searchResult = []
    var that = this
    wx.request({
      url: 'https://api.taxn.top/teacher/', 
      data: {
        search: inputString,
        ordering: 'hot',
        limit:'10'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.results)
        for (var i = 0; i < res.data.results.length;i++){
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

})
