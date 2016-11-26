const util = require("../../utils/util.js");

var data_id = 0;//帖子的ID
var page = 1;
var lastcid = 0;//最后一条评论的ID

Page({
  data:{
    item:{},
    hotcomemnt_hidden:false,
    dataList: []
  },
  onLoad:function(options){
    data_id = options.id;
    //页面初始化 options为页面跳转所带来的参数
    this.refreshNewData();

  },
  //刷新数据
  refreshNewData:function(){
    //加载提示框
    util.showLoading();
    var that = this;
    var parameters = 'a=dataList&c=comment&data_id='+data_id+"&hot=1";
    console.log("parameters = "+parameters);
    util.request(parameters,function(res){
        page = 1;
        console.log("最热");
        
        var newObj = res.data.hot[0];
        console.log(newObj);
        that.setData({
          hotcomemnt_hidden: newObj ? false : true,
          item:newObj ? newObj : {},
          dataList: res.data.data
        })
        if (res.data.data.length > 0) {
          lastcid = res.data.data[res.data.data.length-1].id;
        }
        
        setTimeout(function(){
            util.hideToast();
            wx.stopPullDownRefresh();
          },1000);
      });
  },
  refreshData:function(){
    console.log("刷新数据");
  },
  //加载更多操作
  onReachBottom:function(){
    console.log("加载更多");
    //加载提示框
    util.showLoading();

    var that = this;
    var parameters = 'a=dataList&c=comment&data_id='+data_id + "&page="+(page+1) + "&lastcid="+lastcid;
    console.log("parameters = "+parameters);
    util.request(parameters,function(res){
      
        if (res.data.data) {
            page += 1;
            that.setData({
              dataList: that.data.dataList.concat(res.data.data)
            });
            lastcid = res.data.data[res.data.data.length-1].id;
            setTimeout(function(){
              util.hideToast();
              wx.stopPullDownRefresh();
            },1000);
        } else {
            util.showSuccess("没有新数据了",300);
        }
      });
      
    }
})