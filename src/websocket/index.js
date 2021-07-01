
let wsConnection = {
  $wsurl:null,
  $ws: null,
  $initdata:null,
  lockReturn: false,
  timeout: 60 * 1000 * 2,
  timeoutObj: null,
  timeoutNum: null,
  serverTimeoutObj: null,
  //初始化webSocket长连接
  initWebSocket: function () {
    this.$ws = new WebSocket(this.$wsurl);//写入地址 这里的地址可以在initWebSocket方法加入参数
    this.$ws.onopen = this.wsOpen;
    this.$ws.onclose = this.wsClose;
    // this.$ws.onmessage = this.wsMsg;
    this.$ws.onerror = this.wsError;
  },
  //打开websocket
  wsOpen: function (e) {
    //给后台发送初始化的数据
    let msg = JSON.stringify(wsConnection.$initdata);
    wsConnection.$ws.send(msg);
    //开始websocket心跳
    wsConnection.startWsHeartbeat();
  },
  wsClose: function (e) {
    console.log(e, 'ws close')
  },
  wsMsg: function (e) {
    //每次接收到服务端消息后 重置websocket心跳
    wsConnection.resetHeartbeat();
    console.log('接收到服务器返回的数据'+e.data);
    //服务端发送来的消息存到vuex
    // store.commit('web_socket_msg', msg)
  },
  wsError: function (err) {
    console.log(err, 'ws error');
    wsConnection.reconnect()
  },
  //重启websocket
  reconnect: function () {
    let _this = this;
    if (_this.lockReturn) {
      return;
    }
    _this.lockReturn = true;
    _this.timeoutNum && clearTimeout(_this.timeoutNum);
    _this.timeoutNum = setTimeout(function () {
      _this.initWebSocket();
      _this.lockReturn = false;
    }, 3000);
  },
  startWsHeartbeat: function () {
    let _this = this;
    _this.timeoutObj && clearTimeout(_this.timeoutObj);
    _this.timeoutObj = setInterval(function () {
      //判断websocket当前状态
      if (_this.$ws.readyState != 1) {
        _this.reconnect()
      }
    }, _this.timeout);
  },
  //重置websocket心跳
  resetHeartbeat: function () {
    let _this = this;
    clearTimeout(_this.timeoutObj);
    _this.startWsHeartbeat()
  }
};

//抛出websocket对象
export default wsConnection