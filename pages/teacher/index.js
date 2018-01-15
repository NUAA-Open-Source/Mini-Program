// pages/teacher/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
        teacherId : "",
        teacherName:"",
        teacherAveragescore:"",
        teacherCollege:"",
        teacherCheckinpercentage:"",
        teacherRate:"",
        commentData:[],
        selectIdx: 0,//选中哪一条评论
        likeClass: [],//每一条评论的点赞情况
        dislikeClass: [],//每一条评论的反对情况
        //判断是否是第一次评论
        //false是第一次评论 true状态的话就是修改评论
        newOrold:false,
        oldCommentRate:[],//用户之前点过赞或者反对的评论
        userOpenid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)

    console.log(options)
    var that = this
    that.setData({
      teacherId : options.id,
    });
    that.searchTeacherbyid()

    try {
      var value = wx.getStorageSync('openid')
      if (value) {
        // Do something with return value
        that.setData({
          userOpenid: value.openid
        });
      }
    } catch (e) {
      // Do something when catch error
      console.log(e)
    }

    // //  获取当前用户-异步
    // wx.getStorage({
    //   key: 'openid',
    //   success: function (res) {
    //     that.setData({
    //       userOpenid: res.data['openid']
    //     });
    //   }
    // })

    that.judgeCommentRate()
    that.searchCommentdata()
  },
  //通过ID刷新老师界面
  searchTeacherbyid:function(){
    var that = this
    wx.request({
      url: 'https://api.taxn.top/teacher/' + that.data.teacherId+'/',
      success:function(res){
        that.setData({
          teacherName: res.data.name,
          teacherAveragescore: res.data.average_score,
          // searchResultKey['college'] = app.globalData.table[searchResultKey['college']
          teacherCollege: app.globalData.table[res.data.college],
          teacherCheckinpercentage: res.data.check_in_percentage,
          teacherRate: res.data.rate
        })
        wx.setNavigationBarTitle({
          title: that.data.teacherName + "老师 " + that.data.teacherAveragescore + "分"
        });
      }
    })
  },
  // 判断用户是否之前存在评价
  judgeNeworold:function(){
    var that = this
    wx.request({
      url: 'https://api.taxn.top/rate/',
      data: {
        teacher: that.data.teacherId,
        user: that.data.userOpenid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res){
        console.log(res.data)
        if(res.data.count > 0){
          that.setData({
            newOrold:true
          })
        }
      }
    })
  },
  //载入评论数据
  searchCommentdata: function () {
    var that = this

    var searchResult
    // 获取当前老师ID的所有评论
    wx.request({
      url: 'https://api.taxn.top/comment/',
      data: {
        teacher: that.data.teacherId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var like = []
        var dislike = []

        searchResult = res.data.results
        console.log("searchResult",searchResult)
        console.log("oldCommentRate", that.data.oldCommentRate)
        for (var i = 0; i < searchResult.length; i++) {
          // 将编辑日期切分至年月日
          searchResult[i].edit_time = searchResult[i].edit_time.substr(0, searchResult[i].edit_time.indexOf('T'))
          // 载入当前用户以前点过赞的内容样式
          var j
          for (j = 0; j < that.data.oldCommentRate.length; j++) {
            if (searchResult[i].id == that.data.oldCommentRate[j].comment) {
              if (that.data.oldCommentRate[i].like == true) {
                like.push("select-tri")
                dislike.push("default-tri")
              } else {
                like.push("default-tri")
                dislike.push("select-tri")
              }
              break;
            }
          }
          if (j == that.data.oldCommentRate.length) {
            like.push("default-tri")
            dislike.push("default-tri")
          }
        }
        console.log(searchResult, like, dislike)
        that.setData({
          commentData: searchResult,
          likeClass: like,
          dislikeClass: dislike,
        })
      }
    })
  },

  likeTap: function (e) {
    var that = this
    // 如果该评论已经点过赞，则用PUT方法
    var method = "POST"

    var like = this.data.likeClass
    var dislike = this.data.dislikeClass
    var commentData = this.data.commentData
    // 如果已经点过赞，则无需再次PUT
    if (like[e.currentTarget.id] == "select-tri") return;
    // 如果之前反对过，则用PUT方法
    if (dislike[e.currentTarget.id] == "select-tri") method = "PUT"

    if (dislike[e.currentTarget.id] == "select-tri")
      commentData[e.currentTarget.id].rate = commentData[e.currentTarget.id].rate + 2
    else
      commentData[e.currentTarget.id].rate = commentData[e.currentTarget.id].rate + 1

    console.log("here")
    like[e.currentTarget.id] = "select-tri"
    dislike[e.currentTarget.id] = "default-tri"
    console.log(like, dislike);

    var _id //点赞或反对的id
    for (var i = 0; i < that.data.oldCommentRate.length; i++) {
      if (that.data.commentData[e.currentTarget.id].id == that.data.oldCommentRate[i].comment) {
        _id = that.data.oldCommentRate[i].id
        break;
      }
    }
    console.log("_id is ", _id)

    wx.request({
      url: 'https://api.taxn.top/roc/' + (method=="PUT"?_id +'/':"") ,
      data: {
        user: that.data.userOpenid,
        like: "true",
        comment: parseInt(that.data.commentData[e.currentTarget.id].id)
      },
      method: method,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    })

    that.setData({
      selectId: e.currentTarget.id,
      likeClass: like,
      dislikeClass: dislike,
      commentData: commentData
    })
  },
  // 反对的处理
  dislikeTap: function (e) {
    var that = this
    // 如果该评论已经反对过，则用PUT方法
    var method = "POST"

    var like = this.data.likeClass
    var dislike = this.data.dislikeClass
    var commentData = this.data.commentData
    // 如果已经反对过，则无需再次PUT
    if (dislike[e.currentTarget.id] == "select-tri") return;
    // 如果之前点过赞，则选择用PUT
    if (like[e.currentTarget.id] == "select-tri") method = "PUT"

    if (like[e.currentTarget.id] == "select-tri")
      commentData[e.currentTarget.id].rate = commentData[e.currentTarget.id].rate - 2
    else
      commentData[e.currentTarget.id].rate = commentData[e.currentTarget.id].rate - 1

    var _id //点赞或反对的id
    dislike[e.currentTarget.id] = "select-tri"
    like[e.currentTarget.id] = "default-tri"
    for (var i = 0;i<that.data.oldCommentRate.length;i++){
      if (that.data.commentData[e.currentTarget.id].id == that.data.oldCommentRate[i].comment){
        _id = that.data.oldCommentRate[i].id
        break;
      }
    }
    console.log("_id is ",_id)

    wx.request({
      url: 'https://api.taxn.top/roc/'+(method=="PUT"?_id +'/':""),
      data: {
        user: that.data.userOpenid,
        like: false,
        comment: parseInt(that.data.commentData[e.currentTarget.id].id)
      },
      method: method,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    })

    that.setData({
      selectId: e.currentTarget.id,
      likeClass: like,
      dislikeClass: dislike,
      commentData: commentData
    })
  },
  // 获取用户之前点过赞的评论
  judgeCommentRate: function () {
    var that = this
    console.log("judgeCommentRate ",that.data.userOpenid)
    wx.request({
      url: 'https://api.taxn.top/roc/',
      data: {
        user: that.data.userOpenid
      },
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.results)
        that.setData({
          oldCommentRate: res.data.results
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    this.judgeNeworold()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})