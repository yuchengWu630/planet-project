<template>
    <div class="game">game</div>
</template>

<script setup>
import { GameConfigModel, SudFSMMGDecorator, SudFSTAPPDecorator, SudFSMMGListener } from 'sudmgp-sdk-js-wrapper'
import { SudMGP } from 'sudmgp-sdk-js'


export class SDKGameView {
  constructor(root, gameRoomId, language = 'zh-CN', gameId, userId) {
    this.gameRoomId = gameRoomId
    this.root = root
    this.gameId = gameId
    this.userId = userId
    language && (this.language = language)
  }

  
}
</script>

<style lang="stylus">
.game
  font-size 32px
  display flex
  justify-content center
  height 100%
  align-items center
</style>