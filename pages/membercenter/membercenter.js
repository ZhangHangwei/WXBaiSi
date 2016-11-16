const util = require("../../utils/util.js");

Page({

    data:{
        dataList: []
    },

    onLoad:function(options){
        util.showLoading();
        var that = this;
        var parameters = "a=square&c=topic";
        console.log("parameters = "+parameters);
        util.request(parameters,function(res){
            that.setData({
                dataList:res.data.square_list
            });
            setTimeout(function(){
                util.hideToast();
                wx.stopPullDownRefresh();
            },1000);
        });
    },
    //登录
    taplogin:function(){
        wx.navigateTo({
        url: '../login/login',
        success: function(res){
          // success
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
    }


});