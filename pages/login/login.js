
var util = require("../../utils/util.js");

Page({
  data:{
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },

  formSubmit:function(e){
    console.log("提交表单");
    console.log(e);
    var username = e.detail.value.username;
    var password = e.detail.value.password;
    if (username.length < 1) {
      util.alertViewWithCancel("提示","请输入用户名",function(){
        console.log("点击确定按钮");
      },"true");
      return;
    }

    if (password.length < 1) {
      util.alertView("提示","请输入密码",function(){
        console.log("点击确定按钮");
      });
      return;
    }

    util.alertView("提示","登录成功",function(){
      wx.navigateBack({
        delta: 1 // 回退前 delta(默认为1) 页面
        
      })
    })

  },
  //注册
  register:function(e){
    console.log("注册");
  },
  //忘记密码
  forgetpwd:function(){
    console.log("忘记密码");
  }

})