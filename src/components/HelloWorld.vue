<template>
  <div class="hello">

    <el-container>
      <el-header>
        <el-button type="primary" v-if="isShow" @click="sendVo">发起通话</el-button>
        <el-button type="primary" v-if="hangupShow" @click="hangupF">挂断</el-button>

      </el-header>
      <el-main>
        <el-row>
          <el-col :span="10"> <div id="container" style="width: 90%;height: 500px;border: 1px solid darkgreen"></div></el-col>
          <el-col :span="6"> <div id="remoteContainer" style="width:90%;height: 200px;border: 1px solid darkgreen"></div></el-col>
          <el-col :span="8">
            <div class="texts" style="width:90%;height: 500px;border: 1px solid darkgreen">
              <div class="showText">
                <ul>
                  <li v-for="(item,index) in textList" :key="index">
                     {{item.from}}: {{item.text}}
                  </li>
                </ul>

              </div>
              <el-form  label-width="100px" class="demo-ruleForm">


                <el-form-item label="内容" >
                  <el-input type="textarea" v-model="textS"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="sendTexts">发送</el-button>
                </el-form-item>
              </el-form>

            </div>
          </el-col>
        </el-row>
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="30%">

          视频类型:{{type}}
          被叫信息:{{beCalledInfo}}
          <el-button @click="dialogVisible = false">忽略</el-button>

          <el-button  @click="acctic">接听</el-button>

        </el-dialog>


        <el-dialog
          title="选择账户"
          :visible.sync="centerDialogVisible"
          width="30%"
          center>

          <el-radio v-model="radio" label="1">账户1</el-radio>
          <el-radio v-model="radio" label="2">账户2</el-radio>



          <span slot="footer" class="dialog-footer">

            <el-button type="primary" @click="inits">确 定</el-button>
          </span>
        </el-dialog>





      </el-main>
    </el-container>



  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  data () {
    return {
      radio: '1',
      centerDialogVisible:false,
      textList:[],
      textS:'',
      isShow:false,
      nim:{},
      data:{},
      netcall:{},
//      被叫信息
      beCalledInfo:null,
//      呼叫类型
      type:null,
      dialogVisible: false,
      //挂断
      hangup:false,
      hangupShow:false,
      account:'',
      token:'',
      tosentAccount:''
    }
  },
  created(){
     this.centerDialogVisible = true
  },

  mounted(){

  },methods:{

    inits:function () {
      let _this = this
      _this.centerDialogVisible  = false
      if(_this.radio == 1){
        _this.tosentAccount = 'liqinfei'
        _this.account = 'helloworld'
        _this.token = '655f103017b89125fd6f0d5804c5ae19'
      }else {
        _this.tosentAccount = 'helloworld'
        _this.account = 'liqinfei'
        _this.token = 'd9e3b4c5ebc46d54a2e67c186ee13a8e'
      }

      _this.data = {};
      _this.nim = NIM.getInstance({
        // debug: true,
        appKey: 'be4e05bef08c90711e16dd727cf74bd0',
        account: _this.account,
        token: _this.token,
        onconnect: onConnect,
        onwillreconnect: onWillReconnect,
        ondisconnect: onDisconnect,
        onerror: onError,
        onroamingmsgs: onRoamingMsgs,
        onofflinemsgs: onOfflineMsgs,
        onmsg: onMsg,
        onsyncdone: onSyncDone,
      });

      function onSyncDone() {
        console.log('同步完成');
        _this.vio()
      }
      function onRoamingMsgs(obj) {
        console.log('收到漫游消息', obj);

      }
      function onOfflineMsgs(obj) {
        console.log('收到离线消息', obj);
        _this.textList = _this.textList.concat(obj.msgs)
      }
      function onMsg(msg) {
        console.log('收到消息', msg.scene, msg.type, msg);
        _this.textList = _this.textList.concat(msg)
        switch (msg.type) {
          case 'custom':
            onCustomMsg(msg);
            break;
          case 'notification':
            // 处理群通知消息
            onTeamNotificationMsg(msg);
            break;
          // 其它case
          default:
            break;
        }
      }

      function onCustomMsg(msg) {
        // 处理自定义消息
      }


      function onConnect() {
        console.log('连接成功');

      }
      function onWillReconnect(obj) {
        // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
        console.log('即将重连');
        console.log(obj.retryCount);
        console.log(obj.duration);
      }
      function onDisconnect(error) {
        // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
        console.log('丢失连接');
        console.log(error);
        if (error) {
          switch (error.code) {
            // 账号或者密码错误, 请跳转到登录页面并提示错误
            case 302:
              break;
            // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
            case 417:
              break;
            // 被踢, 请提示错误后跳转到登录页面
            case 'kicked':
              break;
            default:
              break;
          }
        }
      }
      function onError(error) {
        console.log(error);
      }


    },


    vio:function () {

      let _this = this
      // SDK重命名
//      NIM.use(WebRTC)
//      const Netcall = WebRTC
//      const netcall = Netcall.getInstance({
//        nim: _this.nim,
//        container: document.getElementById('container'),
//        remoteContainer: document.getElementById('remoteContainer'),
//        // 是否开启日志打印
//        debug: true
//      })
      NIM.use(Netcall)

      const netcall = Netcall.getInstance({
        kickLast: false,
        nim: _this.nim,
        container: document.getElementById('container'),
        remoteContainer: document.getElementById('remoteContainer'),
        mirror: true,
        mirrorRemote: true,
      })
      this.netcall = netcall

// 信令通道初始化完毕之后, 开发者可以启用音视频通话相关的 UI, 比如说展示呼叫别人的按钮
// 信令通道初始化失败的时候, 请展示错误并禁用所有音视频通话相关的 UI
      netcall.initSignal().then(function() {
        console.log('signalInited')
        _this.isShow = true
      }).catch(function(err) {
        console.log('initSignalError', err)
        _this.isShow = false
      })
// 当信令通道断开时, 会触发 signalClosed 事件
      netcall.on('signalClosed', function() {
        console.log('on signalClosed')
       _this.isShow = false
        netcall.hangup()
      })
// 初始化过程中会通过 devices 事件回传所有的设备列表
      netcall.on('devices', function(obj) {
        console.log('on devices', obj)
      })
      let beCalling = false
// 呼叫类型
//      let type = null
// 被叫信息
// 是否正忙
      let busy = false
// 开启监听
      netcall.on('beCalling', function(obj) {
        console.log('on beCalling', obj)
        const channelId = obj.channelId
        // 被叫回应主叫自己已经收到了通话请求
        netcall.control({
          channelId,
          command: Netcall.NETCALL_CONTROL_COMMAND_START_NOTIFY_RECEIVED
        })
        // 只有在没有通话并且没有被叫的时候才记录被叫信息, 否则通知对方忙并拒绝通话
        if (!netcall.calling && !beCalling) {
          _this.type = obj.type
          beCalling = true
          _this.beCalledInfo = obj
          _this.dialogVisible = true
        } else {
          if (netcall.calling) {
            busy = netcall.notCurrentChannelId(obj)
          } else if (beCalling) {
            busy = beCalledInfo.channelId !== channelId
          }
          if (busy) {
            netcall.control({
              channelId,
              command: Netcall.NETCALL_CONTROL_COMMAND_BUSY
            })
            // 拒绝通话
            netcall.response({
              accepted: false,
              beCalledInfo: obj
            })
          }
        }
      })

      // 被叫拒绝的通知
      netcall.on('callRejected', function(obj) {
        console.log('on callRejected', obj)
        // 挂断
        netcall.hangup()
        // 做清理工作
        _this.resetWhenHangup()
      })

      // 被叫接受的通知
      netcall.on('callAccepted', function(obj) {
        console.log('on callAccepted', obj)
        console.log(netcall)
        _this.openVi()
      })

      // 被叫拒绝的通知
      netcall.on('callRejected', function(obj) {
        console.log('on callRejected', obj)
        // 取消呼叫倒计时
        _this.$notify.info({
          title: '消息',
          message: '你被拒绝了'
        });
        // 挂断
        netcall.hangup()
        // 做清理工作
        _this.resetWhenHangup()
      })
      netcall.on('control', function(obj) {
        console.log('收到指令', obj)
      })
      netcall.on('hangup', function(obj) {
        console.log('on hangup', obj)
        // 判断需要挂断的通话是否是当前正在进行中的通话
        _this.hangupShow = false
        if (!_this.beCalledInfo || _this.beCalledInfo.channelId === obj.channelId) {
          // 清理工作
          _this.resetWhenHangup()
        }
      })
    },

    sendVo:function () {
      let _this = this
      const pushConfig = {
        enable: true,
        needBadge: true,
        needPushNick: true,
        pushContent: '',
        custom: '测试自定义数据',
        pushPayload: '',
        sound: ''
      }
      const sessionConfig = {
        videoQuality: Netcall.CHAT_VIDEO_QUALITY_HIGH,
        videoFrameRate: Netcall.CHAT_VIDEO_FRAME_RATE_15,
        videoBitrate: 0,
        recordVideo: false,
        recordAudio: false,
        highAudio: false,
        bypassRtmp: false,
        rtmpUrl: '',
        rtmpRecord: false,
        splitMode: Netcall.LAYOUT_SPLITLATTICETILE
      }
      _this.netcall.call({
        type: Netcall.NETCALL_TYPE_VIDEO,
        account: _this.tosentAccount,
        pushConfig: pushConfig,
        sessionConfig: sessionConfig,
        webrtcEnable: true
      }).then(function(obj) {
        // 成功发起呼叫
        _this.$notify.info({
          title: '消息',
          message: '发起成功，请稍后'
        });
        console.log('call success', obj)
      }).catch(function(err) {
        // 被叫不在线
        if (err.code === 11001) {
          _this.$notify.info({
            title: '消息',
            message: err.message
          });
          console.log('callee offline', err)
        }
      })
// 设置超时计时器
      let callTimer = setTimeout(function() {
        if (!_this.netcall.callAccepted) {
          console.log('超时未接听, hangup')
          _this.$notify.info({
            title: '消息',
            message: '超时未接听'
          });


          _this.netcall.hangup()
        }
      }, 1000 * 30)
    },
    acctic:function () {
      let _this = this
      _this.dialogVisible = false

      const sessionConfig = {
        videoQuality: Netcall.CHAT_VIDEO_QUALITY_HIGH,
        videoFrameRate: Netcall.CHAT_VIDEO_FRAME_RATE_15,
        videoBitrate: 0,
        recordVideo: false,
        recordAudio: false,
        highAudio: false,
        bypassRtmp: false,
        rtmpUrl: '',
        rtmpRecord: false,
        splitMode: Netcall.LAYOUT_SPLITLATTICETILE
      }
      _this.netcall.response({
        accepted: true,
        beCalledInfo: _this.beCalledInfo,
        sessionConfig: sessionConfig
      }).catch(function(err) {
        reject()
        console.log('接听失败', err)
      })




    },resetWhenHangup:function () {
      this.netcall.stopLocalStream()

// 停止对端视频预览
      this.netcall.stopRemoteStream()

// 停止设备麦克风
      this.netcall.stopDevice(Netcall.DEVICE_TYPE_AUDIO_IN)

// 停止设备摄像头
      this.netcall.stopDevice(Netcall.DEVICE_TYPE_VIDEO)

// 停止播放本地音频
      this.netcall.stopDevice(Netcall.DEVICE_TYPE_AUDIO_OUT_LOCAL)

// 停止播放对端音频
      this.netcall.stopDevice(Netcall.DEVICE_TYPE_AUDIO_OUT_CHAT)
    },
    //开启视频函数
    openVi:function () {
      let _this = this

// 开启麦克风
      _this.netcall.startDevice({
        type: Netcall.DEVICE_TYPE_AUDIO_IN
      })
        .then(function() {
          // 通知对方自己开启了麦克风
          _this.netcall.control({
            command: Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_ON
          })
        })
        .catch(function(err) {
          console.log('启动麦克风失败')
          console.log(err)
        })

// 开启摄像头
      _this.netcall.startDevice({
        type: Netcall.DEVICE_TYPE_VIDEO,
        width: 640,
        height: 480
      })
        .then(function() {
          // 通知对方自己开启了摄像头
          _this.netcall.control({
            command: Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_VIDEO_ON
          })
        })
        .catch(function(err) {
          // 通知对方自己的摄像头不可用
          _this.netcall.control({
            command: Netcall.NETCALL_CONTROL_COMMAND_SELF_CAMERA_INVALID
          })
          console.log('启动摄像头失败')
          console.log(err)
        })

// 开启本地视频预览
      _this.netcall.startLocalStream()

// 开启远程视频预览
      _this.netcall.startRemoteStream()

// 开启本地音频播放
      _this.netcall.startDevice({
        type: Netcall.DEVICE_TYPE_AUDIO_OUT_CHAT
      }).catch(function(err) {
        console.log('播放对方的声音失败')
        console.log(err)
      })

// 设置本地音量采集大小, 该API可以在通话过程中动态调用调整自己的音量采集大小
      _this.netcall.setCaptureVolume(255)

// 设置本地音量播放大小, 该API可以在通话过程中动态调用调整自己的音量播放大小(即自己听对端的音量)
      _this.netcall.setPlayVolume(255)

// 设置本地视频画面大小
      _this.netcall.setVideoViewSize({
        width: 500,
        height: 500,
        cut: true
      })

// 设置对端视频画面大小
      _this.netcall.setVideoViewRemoteSize({
        account: _this.tosentAccount,
        width: 500,
        height: 500,
        cut: true
      })

      _this.hangupShow = true

    },
    hangupF:function () {
      this.netcall.hangup()
      this.resetWhenHangup()
      this.hangupShow = false
    },
    //发送文本消息
    sendTexts:function () {

      let _this = this
      if(_this.textS == ''){
        _this.$notify.info({
          title: '消息',
          message: '不能为空'
        });
      }else {
      var msg = this.nim.sendText({
        scene: 'p2p',
        to: _this.tosentAccount,
        text: _this.textS,
        done: sendMsgDone
      });
      console.log('正在发送p2p text消息, id=' + msg.idClient);

      function sendMsgDone(error, msg) {
        console.log(error);
        console.log(msg);
        _this.textS = ''
        _this.textList = _this.textList.concat(msg)
        console.log(_this.textList)
        console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient);

      }
     }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
  .texts{
    position: relative;
    padding: 10px;
  }
  .demo-ruleForm{
    height: 20%;
    width: 80%;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .showText{
    width: 90%;
    height: 75%;
    border: 1px solid seagreen;
    margin: 0 auto;
    overflow: auto;
  }
  .showText li{
      display: block;
      height: 30px;
    line-height: 30px;
    text-align: left;
  }
</style>
