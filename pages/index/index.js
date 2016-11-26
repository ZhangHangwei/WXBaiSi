//index.js
const util = require("../../utils/util.js");
//播放的视频或者音频的ID
var playingID = -1;
var types = ["1","41","10","29","31"];
var page = 1;//页码
var allMaxtime = 0;//全部 最大时间
var videoMaxtime = 0;//视频 最大时间
var pictureMaxtime = 0;//图片 最大时间
var textMaxtime = 0;//段子 最大时间
var voiceMaxtime = 0;//声音 最大时间

//1->全部;41->视频;10->图片;29->段子;31->声音;
var DATATYPE = {
    ALLDATATYPE : "1",
    VIDEODATATYPE : "41",
    PICTUREDATATYPE : "10",
    TEXTDATATYPE : "29",
    VOICEDATATYPE : "31"
};

Page({
  //页面的初始化数据
  data:{
    allDataList:[],
    videoDataList:[],
    pictureDataList:[],
    textDataList:[],
    voiceDataList:[],
    topTabItems:["全部","视频","图片","段子","声音"],
    currentTopItem: "0",
    swiperHeight:"0"
  },
  //页面初始化 options为页面跳转所带来的参数
  //生命周期函数，监听页面加载
  onLoad:function(options){
    this.refreshNewData();
  },
  //生命周期函数-监听页面初次渲染完毕
  onReady:function(){
    var that = this;
     wx.getSystemInfo({
       success: function(res) {
         that.setData({
            swiperHeight: (res.windowHeight-37)
         });
       }
     })
  },
  //切换顶部标签
  switchTab:function(e){
    this.setData({
      currentTopItem:e.currentTarget.dataset.idx
    });
    //如果需要加载数据
    if (this.needLoadNewDataAfterSwiper()) {
      this.refreshNewData();
    }
  },

  //swiperChange
  bindChange:function(e){
    var that = this;
    that.setData({
      currentTopItem:e.detail.current
    });

    //如果需要加载数据
    if (this.needLoadNewDataAfterSwiper()) {
      this.refreshNewData();
    }
  },
  //刷新数据
  refreshNewData:function(){
    //加载提示框
    util.showLoading();

    var that = this;
    var parameters = 'a=list&c=data&type='+types[this.data.currentTopItem];
    console.log("parameters = "+parameters);
    util.request(parameters,function(res){
      page = 1;
      that.setNewDataWithRes(res,that);
      setTimeout(function(){
          util.hideToast();
          wx.stopPullDownRefresh();
        },1000);
      });
  },
  
  //监听用户下拉动作
  onPullDownRefresh:function(){
    this.refreshNewData();
  },

  //滚动后需不要加载数据
  needLoadNewDataAfterSwiper:function(){

    switch(types[this.data.currentTopItem]) {
      //全部
      case DATATYPE.ALLDATATYPE:
        return this.data.allDataList.length > 0 ? false : true;
        
      //视频
      case DATATYPE.VIDEODATATYPE:
        return this.data.videoDataList.length > 0 ? false : true;
        
      //图片
      case DATATYPE.PICTUREDATATYPE:
        return this.data.pictureDataList.length > 0 ? false : true;
        
      //段子
      case DATATYPE.TEXTDATATYPE:
        return this.data.textDataList.length > 0 ? false : true;
        
      //声音
      case DATATYPE.VOICEDATATYPE:
        return this.data.voiceDataList.length > 0 ? false : true;
        
      default:
        break;
    }

    return false;
  },
  //设置新数据
  setNewDataWithRes:function(res,target){
    switch(types[this.data.currentTopItem]) {
      //全部
      case DATATYPE.ALLDATATYPE:
        allMaxtime = res.data.info.maxtime;
        target.setData({
          allDataList: res.data.list
        });
        break;
      //视频
      case DATATYPE.VIDEODATATYPE:
        videoMaxtime = res.data.info.maxtime;
        target.setData({
          videoDataList: res.data.list
        });
        break;
      //图片
      case DATATYPE.PICTUREDATATYPE:
        pictureMaxtime = res.data.info.maxtime;
        target.setData({
            pictureDataList: res.data.list
        });
        break;
      //段子
      case DATATYPE.TEXTDATATYPE:
        textMaxtime = res.data.info.maxtime;
        target.setData({
          textDataList: res.data.list
        });
        break;
      //声音
      case DATATYPE.VOICEDATATYPE:
        voiceMaxtime = res.data.info.maxtime;
        target.setData({
          voiceDataList: res.data.list
        });
        break;
      default:
        break;
    }
  },

  //加载更多操作
  loadMoreData:function(){
    console.log("加载更多");
    //加载提示框
    util.showLoading();

    var that = this;
    var parameters = 'a=list&c=data&type='+types[this.data.currentTopItem] + "&page="+(page+1) + "&maxtime="+this.getMaxtime();
    console.log("parameters = "+parameters);
    util.request(parameters,function(res){
      page += 1;
      that.setMoreDataWithRes(res,that);
      setTimeout(function(){
          util.hideToast();
          wx.stopPullDownRefresh();
        },1000);
      });
  },

  //获取最大时间
  getMaxtime:function(){
    switch(types[this.data.currentTopItem]) {
      //全部
      case DATATYPE.ALLDATATYPE:
        return allMaxtime ;
      //视频
      case DATATYPE.VIDEODATATYPE:
        return videoMaxtime ;
      //图片
      case DATATYPE.PICTUREDATATYPE:
        return pictureMaxtime ;

      //段子
      case DATATYPE.TEXTDATATYPE:
        return textMaxtime ;

      //声音
      case DATATYPE.VOICEDATATYPE:
        return voiceMaxtime;
      default:
        return 0;
    }
  },
  //设置加载更多的数据
  setMoreDataWithRes(res,target) {
    switch(types[this.data.currentTopItem]) {
      //全部
      case DATATYPE.ALLDATATYPE:
        allMaxtime = res.data.info.maxtime;
        target.setData({
          allDataList: target.data.allDataList.concat(res.data.list)
        });
        break;
      //视频
      case DATATYPE.VIDEODATATYPE:
        videoMaxtime = res.data.info.maxtime;
        target.setData({
          videoDataList: target.data.videoDataList.concat(res.data.list)
        });
        console.log(array);
        break;
      //图片
      case DATATYPE.PICTUREDATATYPE:
        pictureMaxtime = res.data.info.maxtime;
        target.setData({
            pictureDataList: target.data.pictureDataList.concat(res.data.list)
        });
        break;
      //段子
      case DATATYPE.TEXTDATATYPE:
        textMaxtime = res.data.info.maxtime;
        target.setData({
          textDataList: target.data.textDataList.concat(res.data.list)
        });
        break;
      //声音
      case DATATYPE.VOICEDATATYPE:
        voiceMaxtime = res.data.info.maxtime;
        target.setData({
          voiceDataList: target.data.voiceDataList.concat(res.data.list)
        });
        break;
      default:
        break;
    }
  },

  //视频播放开始播放
  videoPlay:function(obj){
    console.log("playingID = "+playingID);
    console.log(obj);

    playingID = obj.currentTarget.id;
    //暂停音频的播放
    if(this.audioContext) {
      this.audioContext.pause();
    }
    //暂停上一条视频的播放
    if(this.videoContext){
      console.log(this.videoContext);
      this.videoContext.pause();
    }
    this.videoContext = wx.createVideoContext(obj.currentTarget.id);
  },

  //视频结束播放
  videoEndPlay:function(obj){
    this.videoContext.seek(0); 
  },
  
  //音频播放
  //音频开始播放
  audioplay:function(obj){
    
    //播放的不是同一条音频就暂停之前的音频播放
    //结束视频的播放
    if (this.videoContext) {
      this.videoContext.pause();
    }
    playingID = obj.currentTarget.id;
    this.audioContext = wx.createAudioContext(obj.currentTarget.id);
  },
  //音频结束播放
  audioEndPlay:function(obj){
    this.audioContext.seek(0);
  },
  //点击赞按钮
  zanEvent:function(e){
    console.log("------赞-------");
    console.log(e);
  }
})
