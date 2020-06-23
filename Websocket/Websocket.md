## websocket 协议

ws 和加密的 wss

## websocket 保障

### 心跳检测和重连机制

1、创建 WebSocket 链接

```
function createWebSocket() {
  try {
    ws = new WebSocket(wsUrl);
    init();
  } catch(e) {
    console.log('catch');
    reconnect(wsUrl);
  }
}
```

2、初始化，利用 close 或者 error 方法

```
ws.onclose = function () {
  reconnect(url)
}

ws.onerror = function () {
  reconnect(url)
}

ws.onpoen = function () {
  // 心跳检测
  heartCheck.start()
}

ws.onmessage = function (event) {
    console.log('接收到消息');
    //拿到任何消息都说明当前连接是正常的
    heartCheck.start();
}

```

3、重连操作

```
var lockReconnect = false;//避免重复连接
function reconnect(url) {
      if(lockReconnect) {
        return;
      };
      lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      tt && clearTimeout(tt);
      tt = setTimeout(function () {
        createWebSocket(url);
        lockReconnect = false;
      }, 4000);
}
```

4、心跳检测

```
//心跳检测
var heartCheck = {
      timeout: 3000, //每隔三秒发送心跳
      num: 3,  //3次心跳均未响应重连
      timeoutObj: null,
      serverTimeoutObj: null,
      start: function(){
        var _this = this;
        var _num = this.num;
        this.timeoutObj && clearTimeout(this.timeoutObj);
        this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
        this.timeoutObj = setTimeout(function(){
              //这里发送一个心跳，后端收到后，返回一个心跳消息，
              //onmessage拿到返回的心跳就说明连接正常
              ws.send("123456789"); // 心跳包
              _num--;
              //计算答复的超时次数
              if(_num === 0) {
                   ws.colse();
              }
        }, this.timeout)
      }
}
```
