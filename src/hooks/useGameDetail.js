import { SDKGameView } from "../utils/sdk"
import { ref, onMounted, reactive } from "vue";
import useStateHandle from "@/hooks/useStateHandle";
import { useUserStore } from '@/store/index.js'


export const useGameDetail = (gameId, roomId, goBack) => {
  const [SudSDk, setSudSDk] = useStateHandle()
  const store = useUserStore()
  // 页面挂载后进行sdk初始化
  onMounted(() => {
    // 要挂载的元素
    const root = document.getElementById('game')
    const userId = store.id

    if (root) {
      const nsdk = new SDKGameView({ root, gameRoomId: roomId, gameId, userId })
      nsdk.setSudFSMMGListener({
        onGameStarted() {
          console.log('========自定义的game start=====')
        },
        onGameMGCommonGameBackLobby(handle, data) {
          // 返回游戏大厅

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
      // console.log(userId)
      nsdk.login(userId)
    }
  })
  return {
    SudSDk
  }
}