// pages/rateandcomment/index.js
//给老师评分的界面


Page({

  /**
   * 页面的初始数据
   */
  data: {
    rateNumbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    rateNumbersindex: 0,
    teacherId: "",
    teacherName: "",
    //老师分数
    teacherRate: 1,
    //老师是否点名
    teacherCheckin: false,
    //老师的评价内容
    teacherComment: "",
    //当前评论的用户
    userOpenid:"",
    //判断是否是第一次评论
    //false是第一次评论 true状态的话就是修改评论
    newOrold:false, //!传入参数后改为字符串型
    myRateid:"",
    myCommentid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //绑定数据
    var that = this
    wx.setNavigationBarTitle({
      title: "给" + options.teacherName + "老师 打分"
    });
    that.setData({
      teacherId: options.teacherId,
      teacherName: options.teacherName,
      newOrold: options.newOrold,
      userOpenid: options.userOpenid
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(this.data.newOrold)
    if (this.data.newOrold == "true"){
      this.searchRateandCommentid();
    }
    else{

    }
  },
  bindtap:function(){
    this.sendTeacherRate()
    this.sendTeachercomment()

    wx.showToast({
      title: '已完成',
      icon: 'success',
      duration: 3000
    });
    wx.redirectTo({
      url: '../teacher/index'
    })
  },
  //根据 useropid与teacherid求rateid commentid
  searchRateandCommentid:function(){
    var that = this
    console.log("run searchRateandCommentid")
    wx.request({
      url: 'https://api.taxn.top/rate/',
      data: {
        user: that.data.userOpenid,
        teacher: that.data.teacherId
      },
      header: {
        'content-type': 'application/json' 
      },
      success: function (res) {
        console.log("my rateid is "+res.data.results[0].id)
        that.setData({
          myRateid: res.data.results[0].id
        });
      }
    });
    wx.request({
      url: 'https://api.taxn.top/comment/',
      data: {
        user: that.data.userOpenid,
        teacher: that.data.teacherId
      },
      header: {
        'content-type': 'application/json' 
      },
      success: function (res) {
        console.log("my commentid is " + res.data.results[0].id)
        that.setData({
          myCommentid: res.data.results[0].id
        });
      }
    })
    
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

  },
  //教师分数
  bindChange: function (e) {
    this.setData({
      rateNumbersindex: e.detail.value,
      teacherRate: parseInt(e.detail.value) + 1
    })
  },
  //教师是否点名
  switchChange: function (e) {
    this.setData({
      teacherCheckin: e.detail.value
    })
  },
  //教师评价
  bindTextAreaBlur: function (e) {
    this.setData({
      teacherComment: e.detail.value
    })
  },
  //发送教师的评价分数与是否点名信息
  sendTeacherRate:function(){
    //创建分数情况
    if (this.data.newOrold == "false"){
      console.log('创建新的分数')
      wx.request({
        url: 'https://api.taxn.top/rate/',
        data: {
          user: this.data.userOpenid,
          rate: this.data.teacherRate,
          check_in: this.data.teacherCheckin,
          teacher: this.data.teacherId
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
        }
      })
    }
    //修改分数情况
    else{
      console.log('修改原有分数')
      wx.request({
        url: 'https://api.taxn.top/rate/' + this.data.myRateid +'/',
        data: {
          user: this.data.userOpenid,
          rate: this.data.teacherRate,
          check_in: this.data.teacherCheckin,
          teacher: this.data.teacherId
        },
        method: 'PUT',//注意是PUT
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
        }
      })
    }
    
  },
  //发送教师的评论
  sendTeachercomment:function(){
    //创建评论情况
    if (this.data.newOrold == "false") {
      console.log('创建新的评价')
      wx.request({
        url: 'https://api.taxn.top/comment/',
        data: {
          content: this.data.teacherComment, 
          user: this.data.userOpenid,
          teacher: this.data.teacherId
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
        }
      })
    }
    //修改原有评论情况
    else {
      console.log('修改原有评论')
      wx.request({
        url: 'https://api.taxn.top/comment/' + this.data.myCommentid+'/',
        data: {
          content: this.data.teacherComment,
          user: this.data.userOpenid,
          teacher: this.data.teacherId
        },
        method: 'PUT',//注意是PUT
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
        }
      })
    }
  }
})