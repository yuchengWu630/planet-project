<template>
  <div class="box">
    <div v-if="showSelect" class="select-sex">
      <div class="male">
        <div class="select-item" @click="handleSexSelect('Male')">
          <div>男</div>
        </div>
      </div>
      <div class="female">
        <div class="select-item" @click="handleSexSelect('FeMale')">
          <div>女</div>
        </div>
      </div>
    </div>
    <div id="game"></div>
  </div>
</template>

<script setup>
// 换装页面
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// import { useGameDetail } from '@/hooks/useGameDressUp'
import { SDKGameView } from '@/utils/sdk'
import useStateHandle from '@/hooks/useStateHandle'
import useGameHandle from '@/hooks/useGameHandle'
import { saveUserAvatar } from '@/api/login' // 短期令牌code接口
import { useUserStore } from '@/store/index.js'

const [SudSDk, setSudSDk] = useStateHandle()
const store = useUserStore()
const showSelect = ref(false)
const game = {
  gameId: '1560939199401668609',
  roomId: store.roomId,
  userId: store.id,
  code: store.key,
}
console.log(
  game,
  '===============================store.id======================='
)

onMounted(() => {
  console.log(
    store.avatar,
    '===============================store.avatar======================='
  )
  if (!store.avatar) {
    showSelect.value = true
    return
  }
  try {
    const avatar = JSON.parse(store.avatar)
    store.avatar = JSON.stringify({
      gender: avatar.gender,
      avatar: avatar.avatar,
    })
    loadGame(game.gameId, game.roomId, goBack, goScenes)
  } catch (err) {
    showSelect.value = true
  }
})

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
              data,
              JSON.stringify(
                `{"gender": "${JSON.parse(store.avatar).gender}", "avatar": "${
                  data.avatar
                }"}`
              )
            )
            let param = new FormData()
            param.append(
              'avatar',
              `{"gender": "${JSON.parse(store.avatar).gender}", "avatar": "${
                data.avatar
              }"}`
            )
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

const handleSexSelect = param => {
  if (param === 'Male') {
    store.avatar = JSON.stringify({
      gender: param,
      avatar:
        'Role_Male_T19_Hair_01_M_Face_01_T_T19_UB_01_M_T19_LB_01_M_T19_Shoe_01_M',
    })
  } else {
    store.avatar = JSON.stringify({
      gender: param,
      avatar:
        'Role_FeMale_T19_Hair_01_M_Face_01_T_T19_UB_01_M_T19_LB_01_M_T19_Shoe_01_M',
    })
  }
  showSelect.value = false
  loadGame(game.gameId, game.roomId, goBack, goScenes)
}

const router = useRouter()
const goBack = data => {
  if (data && data.leaveGame) {
    // 销毁游戏
    SudSDk && SudSDk.onDestroy()
  }
  setTimeout(() => {
    router.push('./home')
  }, 1000)
}

const goScenes = data => {
  if (data && data.leaveGame) {
    // 销毁游戏
    SudSDk && SudSDk.onDestroy()
  }
  setTimeout(() => {
    router.push('/scenes')
  }, 1000)
}

// const { SudSDk } = useGameDetail("1560939199401668609", 2, goBack);
</script>

<style lang="stylus">
#game {
  font-size: 32px;
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  align-items: center;
}

.box {
  height: 100%;
  width: 100%;
}

.select-sex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.male, .female {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.male .select-item {
  background: #3cc8ff;
}

.female .select-item {
  background: #ff60ba;
}

.select-item {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px;
  font-size: 80px;
  color: #fff;
}

.male .select-item:hover {
  background-color: #3cc8ff;
  -webkit-box-shadow: 10px 10px 40x 6px rgba(76, 201, 240, 1);
  -moz-box-shadow: 10px 10px 40px 6px rgba(76, 201, 240, 1);
  box-shadow: 10px 10px 40px 6px rgba(76, 201, 240, 1);
}

.female .select-item:hover {
  background-color: #ff60ba;
  -webkit-box-shadow: 10px 10px 40px 6px rgba(255, 96, 186, 1);
  -moz-box-shadow: 10px 10px 40px 6px rgba(255, 96, 186, 1);
  box-shadow: 10px 10px 40px 6px rgba(255, 96, 186, 1);
}
</style>
