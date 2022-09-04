<template>
  <div class="container">
    <!-- <div class="chat-textarea"></div> -->
    <div id="game">game</div>
  </div>
</template>

<script setup>
// 场景页面
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// import { useGameDetail } from '@/hooks/useGameDressUp'
import { SDKGameView } from '@/utils/sdk'
import useStateHandle from '@/hooks/useStateHandle'
import { saveUserAvatar } from '@/api/login' // 短期令牌code接口
import { useUserStore } from '@/store/index.js'

const [SudSDk, setSudSDk] = useStateHandle()
let store = useUserStore()
if (!store.id) store = JSON.parse(localStorage.getItem('userInfo'))
const game = {
  gameId: '1556909306879725569',
  roomId: store.roomId,
  userId: store.id,
  code: store.key,
}
console.log(
  game,
  '===============================store.id======================='
)

onMounted(() => {
  loadGame(game.gameId, game.roomId, goBack, goScenes)
})

// 返回大厅
const goBack = data => {
  if (data && data.leaveGame) {
    // 销毁游戏
    SudSDk && SudSDk.onDestroy()
  }
  setTimeout(() => {
    location.href = '/home'
  }, 1000)
}

function loadGame(
  gameId = '1560939199401668609',
  roomId = store.roomId,
  goBack,
  goScenes
) {
  // 要挂载的元素
  const root = document.getElementById('game')
  const userId = store.id

  if (root) {
    const nsdk = new SDKGameView({
      root,
      gameRoomId: roomId,
      gameId,
      userId,
    })
    nsdk.setSudFSMMGListener({
      onGameStarted() {
        console.log('========自定义的game start=====')
      },
      onGameMGCommonGameBackLobby(handle, data) {
        // 返回游戏大厅
        goBack && goBack(data)
      },
      onGameCustomerStateChange(handle, state, data) {
        switch (state) {
          case 'mg_common_click_user_profile':
            console.log('handle mg_common_click_user_profile')
            break
          case 'mg_avatar_get_avatar':
            console.log(
              '===========mg_avatar_get_avatar=============',
              store.avatar
            )
            handle.success(store.avatar)
            break
          case 'mg_avatar_modify_avatar':
            console.log(
              '===========mg_avatar_modify_avatar=============',
              data.avatar
            )
            // console.log(userStore.key)
            let param = new FormData()
            param.append(
              'avatar',
              `{"gender": "Male", "avatar": "${data.avatar}"}`
            )
            // param.append('gender', 'Male')
            saveUserAvatar(param).then(res => {
              goScenes && goScenes(data)
              console.log('==============saveUserAvatar==========', res)
            })
            break
        }
      },
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
}

const goScenes = data => {
  if (data && data.leaveGame) {
    // 销毁游戏
    SudSDk && SudSDk.onDestroy()
  }
  setTimeout(() => {
    const router = useRouter()
    router.push('./game')
  }, 1000)
}

// const { SudSDk } = useGameDetail('1556909306879725569', roomId, goBack)

// const { joinGame, quitGame, readyGame, cancelReadyGame, startGame } = useGameHandle(SudSDk)

// console.log(useGameDetail)
</script>

<style lang="stylus">
.container
    position relative
    width 100%
    height 100%
    .chat-textarea
        position absolute
        left 0
        top 10px
        width 100%
        height 64px
        background-color rgba(0, 0, 0, 0.5)
        border 1px solid rgba(0, 0, 0, 0,3)
    #game
        font-size 32px
        display flex
        justify-content center
        height 100%
        width 100%
        align-items center
</style>
