import { GameConfigModel, SudFSMMGDecorator, SudFSTAPPDecorator, SudFSMMGListener } from 'sudmgp-sdk-js-wrapper'
import { SudMGP } from 'sudmgp-sdk-js'
import { getCode } from '@/api/login' // 短期令牌code接口


export class SDKGameView {
  static gameRoomId // 游戏房间id，房间隔离，同一房间才能一起游戏
  static language = "zh-CN" /** 游戏的语言代码 */
  static gameId // 游戏id

  /** 使用的UserId。这里随机生成作演示，开发者将其修改为业务使用的唯一userId */
  static userId = '100668' // Math.floor((Math.random() + 1) * 10000).toString()
  /** Sud平台申请的appId */
  // eslint-disable-next-line camelcase
  static SudMGP_APP_ID = '1461564080052506636' // "1498868666956988417"
  /** Sud平台申请的appKey */
  // eslint-disable-next-line camelcase
  static SudMGP_APP_KEY = '03pNxK2lEXsKiiwrBQ9GbH541Fk2Sfnc'// '1461564080052506636' //"E9Lj2Cg61pUgiSESou6WDtxntoTXH7Gf"

  /** true 加载游戏时为测试环境 false 加载游戏时为生产环境 */
  static GAME_IS_TEST_ENV = true

  // app调用sdk的封装类
  static sudFSTAPPDecorator = new SudFSTAPPDecorator()
  // 用于处理游戏SDK部分回调业务
  static sudFSMMGDecorator = new SudFSMMGDecorator()

  static customSudFSMMGListener

  constructor(root, gameRoomId, language = 'zh-CN', gameId, userId) {
    this.gameRoomId = gameRoomId
    this.root = root
    this.gameId = gameId
    this.userId = userId
    language && (this.language = language)
  }


  /** 第1步 登录  **/
  static login(userId) {
    return new Promise(() => {
      const data = {
        user_id: userId,
        app_id: this.SudMGP_APP_ID
      }
      // 获取code
      getCode(data).then(async (res) => {
        const code = res.data.code
        console.log(code)
        await this.beforeInitSdk && this.beforeInitSdk(SudMGP)
        this.initSdk({
          userId,
          code,
          appId: this.SudMGP_APP_ID,
          appKey: this.SudMGP_APP_KEY,
          isTestEnv: this.GAME_IS_TEST_ENV
        })
      })
    })
  }

  /**  第2步，初始化sdk **/
  static initSdk(
    userId,
    appId,
    code,
    appKey,
    isTestEnv) {
    const bundleId = this.getBundleId()
    const self = this
    SudMGPSDK.initSDK(appId, appKey, bundleId, isTestEnv, {
      onSuccess() {
        self.loadGame({ userId, code })
      },
      onFailure(errCode, errMsg) {
        // TODO: 2022/6/13 下面可以根据业务需要决定是否保留
        if (isTestEnv) {
          console.error(`${bundleId}, initSDK onFailure:${errMsg} (${errCode})`)
        }
      }
    })
  }


  /**  第3步，加载游戏 **/
  static loadGame(userId, code ) {
    const gameRoomId = this.gameRoomId
    const gameId = this.gameId
    const language = this.language
    const self = this
    const customSudFSMMGListener = this.customSudFSMMGListener || {}
    this.sudFSMMGDecorator.setSudFSMMGListener({
      // 默认监听事件
      onGameStarted() {
        console.log('start')
      },
      // 监听玩家状态改变
      onPlayerMGCommonPlayerIn(handle, userId, model) {
        // 获取游戏人数
        const size = self.sudFSMMGDecorator.getPlayerInNumber()
        console.log(`=======sud h5 getPlayerInNumber======= size: ${size}, userId: ${userId}, model: ${model}`)
        handle.success(JSON.stringify({ res_code: 0, msg: '' }))
      },
      onGameMGCommonGameBackLobby(handle, dataJson) { // 游戏通知app回到大厅
        // 自定义实现页面跳转或者回到大厅的操作

      },
      onGameLog(dataJson) {
        console.log('=======sud h5 onGameLog======= ', dataJson)
      },
      onGetGameViewInfo: function (handle, dataJson) {
        const width = self.root.clientWidth
        const height = self.root.clientHeight
        console.log(width, height, 'width,height', dataJson, 'dataJson')
        const data = JSON.parse(dataJson)
        const dpr = data.ratio || 1
        // TODO: 修改数据
        const gameViewInfo = {
          ret_code: 0,
          ret_msg: "success",
          view_size: {
            width: width * dpr,
            height: height * dpr
          },
          view_game_rect: {
            left: 0,
            right: 0,
            top: 50,
            bottom: 50
          }
        }
        console.log(gameViewInfo, 'gameViewInfo')

        handle.success(JSON.stringify(gameViewInfo))
      },
      onGameMGCommonSelfClickJoinBtn(handle, res) {
        handle.success(JSON.stringify(res))
      },
      onGetGameCfg: function (handle, dataJson) {
        console.log("onGetGameCfg")
        let config = new GameConfigModel()
        const gameConf = localStorage.getItem('gameconfig')

        if (gameConf) {
          // @ts-ignore
          config = gameConf
          console.log(config, 'GameConfigModel')
          // @ts-ignore
          handle.success(config)
          return
        }
        console.log(JSON.stringify(config), 'GameConfigModel')
        handle.success(JSON.stringify(config))
      },
      ...customSudFSMMGListener// 外部传入自定义listener可覆盖
    })
    console.log(userId, gameRoomId, code, gameId, language, this.sudFSMMGDecorator)

    // 调用游戏sdk加载游戏
    const iSudFSTAPP = SudMGPSDK.loadMG(userId, gameRoomId, code, gameId, language, this.sudFSMMGDecorator, this.root)
    // APP调用游戏接口的装饰类设置
    if (iSudFSTAPP) {
      this.sudFSTAPPDecorator.setISudFSTAPP(iSudFSTAPP)
    }
  }

  /** 页面销毁的时候调用 */
  static onDestroy() {
    // @ts-ignore
    this.sudFSTAPPDecorator.notifyAPPCommon('app_common_self_exit_game', JSON.stringify({}), {
      onSuccess() {

      },
      onFailure() {

      }
    })
    this.destroyMG()
  }


   /** 销毁游戏 */
   static destroyMG() {
    this.sudFSTAPPDecorator.destroyMG()
    this.sudFSMMGDecorator.destroyMG()
  }


}