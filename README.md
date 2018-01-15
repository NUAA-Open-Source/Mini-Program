# 匿匿评 小程序端
### 关于本项目：
计划于2018年春季学期上线的 南京航空航天**匿名教评**微信小程序

> 我们不要上枯燥无味，只念PPT，学不到东西的课。
> 我们不要成为一个没有思想，只是默默接受一切事物的机器人。
> 我们希望南航大优秀的教师能得到赞扬，让更多人学到受益终身的思想与真正有用的知识。
> 我们也希望一些“不合格”的老师能够反省自己的教学方法与教学态度。

### 项目计划 [项目主页](https://github.com/NiNiPing)

* [x] [程序后端](https://github.com/NiNiPing/Server)
* [x] 微信小程序客户端
* [ ] 移动web端

### 小程序界面展示
注：展示界面中对老师的评价均为模拟测试。
#### 1.学院筛选与按照热度，评分，拼音排序 包含 1627 条 教师数据[了解我们如何获取全部老师信息](https://github.com/NiNiPing/teacherinfo)
![](http://p0xjmrizh.bkt.clouddn.com/15160083852364.gif)
#### 2. 拼音模糊搜索教师![](http://p0xjmrizh.bkt.clouddn.com/15160084090136.gif)
#### 3. 对教师的进行评分与评价![](http://p0xjmrizh.bkt.clouddn.com/15160084237196.gif)
#### 4. 对用户评论进行点赞与反对的支持![](http://p0xjmrizh.bkt.clouddn.com/15160084422650.gif)
#### 5. 防刷分与刷评论![](http://p0xjmrizh.bkt.clouddn.com/15160084523309.gif)

### 如何复现
**由于项目中 防刷分与刷评 论加入了对微信用户openid的验证。复现有两种方式**
[查看微信官方文档了解openid](https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html#wxchecksessionobject)
1. 申请小程序的开发权限并在app.js的wx.login模块加入appid与appsecrt。并且勾选微信开发工具中不校验安全域名的选项。

![](http://p0xjmrizh.bkt.clouddn.com/15160035478151.jpg)


2.联系我们。

### TODO
* [ ] 更多评价方式
* [ ] 更加好看的UI
* [ ] 更多的教师数据展示
* [ ] 分享界面
* [ ] **推广**

### 联系方式
对于功能与意见的反馈可以直接在 **issue** 里面反应。我们很希望我们这个项目可以得到大家的支持与意见。如果你想加入我们的团队（**运营，代码，美工，开发，产品都可以加入进来**）也请直接联系我们。

Email：wongguobin@gmail.com

### 项目成员

[arcosx](https://github.com/arcosx)：产品,小程序端

[lcgooder](https://github.com/lcgooder)：后端，运维

[hason-5](https://github.com/rsonghao)：小程序端



