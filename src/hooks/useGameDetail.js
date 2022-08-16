import { SDKGameView } from "../utils/sdk"
import { ref, onMounted, reactive } from "vue";
import useStateHandle from "@/hooks/useStateHandle";

export const useGameDetail = (gameId = '1472142640866779138', roomId, goBack) => {
  console.log('32131231', gameId, roomId)
  const [SudSDk, setSudSDk] = useStateHandle()
  // 页面挂载后进行sdk初始化
  onMounted(() => {
    // 要挂载的元素
    const root = document.getElementById('game')
    const userId = Math.floor((Math.random() + 1) * 10000).toString()
    if (root) {
      const nsdk = new SDKGameView({ root, gameRoomId: roomId, gameId, userId })
      console.log(nsdk)
      nsdk.setSudFSMMGListener({
        onGameStarted() {
          console.log('========自定义的game start=====')
        },
        onGameMGCommonGameBackLobby(handle, data) {
          // 返回游戏大厅
          console.log('onGameMGCommonGameBackLobby', data)

          goBack && goBack(data)
        }
      })
      // 自定义loading
      // nsdk.beforeInitSdk = function (SudMGP) {
      //   return new Promise(() => {
      //     SudMGP.getSudCfg().setShowCustomLoading(true)
      //   })
      // }
      // nsdk.sudFSMMGDecorator.onGameLoadingProgress = function (stage: number, retCode: number, progress: number) {
      //   console.log(stage, retCode, progress, '自定义进度')
      // }
      setSudSDk(nsdk)
      console.log(userId)
      nsdk.login(userId)
    }
  })
  return {
    SudSDk
  }
}