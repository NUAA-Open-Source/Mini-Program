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
        userOpenid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    that.setData({
      teacherId : options.id,
    });
    that.searchTeacherbyid()


    //  获取当前用户
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          userOpenid: res.data['openid']
        });
      }
    })
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
  searchCommentdata:function(){
    var that = this

    var searchResult

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
        var commentScore = []
        console.log(res.data)
        searchResult = res.data.results

        for (var i = 0; i < searchResult.length; i++) {
          searchResult[i].edit_time = searchResult[i].edit_time.substr(0, searchResult[i].edit_time.indexOf('T'))
          like.push("default-tri")
          dislike.push("default-tri")
          commentScore.push("0")
        }
        console.log(searchResult, like, dislike)
        that.setData({
          commentData: searchResult,
          likeClass: like,
          dislikeClass: dislike,
          commentScore: commentScore
        })
      }
    })
  },

  likeTap: function (e) {
    var that = this
    var method = "POST"
    console.log(e)
    var like = this.data.likeClass
    var dislike = this.data.dislikeClass
    var commentData = this.data.commentData
    if (like[e.currentTarget.id] == "select-tri") return;
    if (dislike[e.currentTarget.id] == "select-tri") method = "PUT"
    console.log("here")
    like[e.currentTarget.id] = "select-tri"
    dislike[e.currentTarget.id] = "default-tri"
    console.log(like, dislike);

    wx.request({
      url: 'https://api.taxn.top/roc/' + (method == "PUT" ? commentData[e.currentTarget.id].id : "") + '/',
      data: {
        user: "osjsP0cUOBuqPBMDGwJvDlBsu6yg",
        like: true,
        comment: that.data.commentData[e.currentTarget.id].id
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

    if (dislike[e.currentTarget.id] == "select-tri")
      commentData[e.currentTarget.id].rate = commentData[e.currentTarget.id].rate == 0 ? 0 : commentData[e.currentTarget.id].rate + 2
    else
      commentData[e.currentTarget.id].rate = commentData[e.currentTarget.id].rate == 0 ? 0 : commentData[e.currentTarget.id].rate + 1

    that.setData({
      selectId: e.currentTarget.id,
      likeClass: like,
      dislikeClass: dislike,
      commentData: commentData
    })
  },

  dislikeTap: function (e) {
    var that = this
    var method = "POST"
    console.log(e)

    var like = this.data.likeClass
    var dislike = this.data.dislikeClass
    var commentData = this.data.commentData
    if (dislike[e.currentTarget.id] == "select-tri") return;
    if (like[e.currentTarget.id] == "select-tri") method = "PUT"

    dislike[e.currentTarget.id] = "select-tri"
    like[e.currentTarget.id] = "default-tri"
    wx.request({
      url: 'https://api.taxn.top/roc/' + (method == "PUT" ? commentData[e.currentTarget.id].id : "") + '/',
      data: {
        user: "osjsP0cUOBuqPBMDGwJvDlBsu6yg",
        like: false,
        comment: that.data.commentData[e.currentTarget.id].id
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
    if (like[e.currentTarget.id] == "select-tri")
      commentData[e.currentTarget.id].rate = commentData[e.currentTarget.id].rate == 0 ? 0 : commentData[e.currentTarget.id].rate - 2
    else
      commentData[e.currentTarget.id].rate = commentData[e.currentTarget.id].rate == 0 ? 0 : commentData[e.currentTarget.id].rate - 1

    that.setData({
      selectId: e.currentTarget.id,
      likeClass: like,
      dislikeClass: dislike,
      commentData: commentData
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