const util = require("../../utils/util.js"); 
var leftSelectedIdx = 0;/*左侧选中的行号*/
var currentPage = 1;

Page({
  data:{
    leftTabArray:[],
    rightTabArray:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    util.showLoading();
    var that = this;
    //请求左侧栏目的数据
    var parameters = "a=category&c=subscribe";
    util.request(parameters,function(res){

        console.log("推荐关注");
        var temArray = res.data.list;
        //默认选中第一个
        temArray[0].selected = true;
        temArray[0].index = 0;
        for (var i = 1; i < temArray.length; i++) {
           temArray[i].selected = false;
           temArray[i].index = i;
        }
        that.setData({
          leftTabArray: temArray
        })
      
        //再获取第一个栏目对应的右侧列表数据
        that.loadRightTabData(that,temArray[0].id);
        
      });
  },

  //加载右侧列表数据
  loadRightTabData:function(target, category_id){

    console.log("右侧栏目数据");
    util.showLoading();
    var parameters = "a=list&c=subscribe&category_id="+category_id+"&page="+currentPage;
    util.request(parameters,function(res){

      console.log("右侧列表数据");
      console.log(res.data.list);
        target.setData({
          rightTabArray : target.data.rightTabArray.concat(res.data.list)

        });
        if (res.data.list.length == 0) {
          util.showSuccess("没有新数据了");
          wx.stopPullDownRefresh();
        } else {
          // 隐藏提示框
          setTimeout(function(){
              util.hideToast();
              wx.stopPullDownRefresh();
            },1000);
        }
        
    });
  },

  //左侧cell的点击事件
  leftCellTap:function (e){
    console.log(e);
    // 当前选中的行
    var selectIdx = Number(e.currentTarget.dataset.idx);
    // 如果点击的是已经选中的就不再发送请求
    if (leftSelectedIdx == selectIdx) {
      return;
    }
    var temArray = this.data.leftTabArray;
    // 取消选中
    temArray[leftSelectedIdx].selected = false;
    // 记录当前选中的行
    leftSelectedIdx = selectIdx;
    // 改变当前选中的行的样式
    temArray[leftSelectedIdx].selected = true;

    this.setData({
        leftTabArray: temArray
    });

    //清除右侧数组中的数据
    this.setData({
      rightTabArray : []
    });
    currentPage = 1;
    //重新加载右侧数组中的数据
    this.loadRightTabData(this,this.data.leftTabArray[leftSelectedIdx].id);
  },

  // 重新加载
  // 一个系统方法，到达顶部执行
  onPullDownRefresh:function(){
    currentPage = 0;
    this.loadRightTabData(this,this.data.leftTabArray[leftSelectedIdx].id);
  },

  //加载更多操作
  //一个系统方法，到达底部执行
  onReachBottom:function(){
    currentPage++;
    this.loadRightTabData(this,this.data.leftTabArray[leftSelectedIdx].id);
  }

})