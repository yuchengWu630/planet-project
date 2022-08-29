<template>
    <div id="game">game</div>
</template>

<script setup>
// 场景页面
import { useGameDetail } from '@/hooks/useGameDetail'
import { getQueryParam } from '@/utils/utils'
import useGameHandle from '@/hooks/useGameHandle'

const orientation = getQueryParam('orientation')
const roomId = getQueryParam('roomId')
// console.log('roomId', roomId)

// 返回大厅
const goBack = (data) => {
  if (data && data.leaveGame) {
    // 销毁游戏
    SudSDk && SudSDk.onDestroy()
  }
  setTimeout(() => {
    location.href = '/home'
  }, 1000)
}

const { SudSDk } = useGameDetail('1556909306879725569', roomId, goBack)

const { joinGame, quitGame, readyGame, cancelReadyGame, startGame } = useGameHandle(SudSDk)

// console.log(useGameDetail)

</script>

<style lang="stylus">
#game
  font-size 32px
  display flex
  justify-content center
  height 100%
  width 100%
  align-items center
</style>