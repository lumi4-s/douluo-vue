<template>
  <div class="app">
    <div v-if="loading" class="loading">正在恢复游戏...</div>
    <CreateCharacter v-else-if="!sessionId" @created="onGameCreated" />
    <GameMain v-else :session-id="sessionId" :player="player" :logs="logs" @update="onStateUpdate" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CreateCharacter from './components/CreateCharacter.vue'
import GameMain from './components/GameMain.vue'
import { getState } from './api'

const sessionId = ref(null)
const player = ref(null)
const logs = ref([])
const loading = ref(true)

// 页面加载时尝试恢复会话
onMounted(async () => {
  const savedSessionId = localStorage.getItem('douluo_session_id')
  if (savedSessionId) {
    try {
      const res = await getState(savedSessionId)
      sessionId.value = savedSessionId
      player.value = res.data.player
      logs.value = res.data.logs
    } catch (e) {
      // 会话失效，清除本地存储
      localStorage.removeItem('douluo_session_id')
      localStorage.removeItem('douluo_player')
      localStorage.removeItem('douluo_logs')
    }
  }
  loading.value = false
})

function onGameCreated(data) {
  sessionId.value = data.sessionId
  player.value = data.player
  logs.value = data.logs
  // 保存会话到本地存储
  localStorage.setItem('douluo_session_id', data.sessionId)
  localStorage.setItem('douluo_player', JSON.stringify(data.player))
  localStorage.setItem('douluo_logs', JSON.stringify(data.logs))
}

function onStateUpdate(data) {
  player.value = data.player
  logs.value = data.logs
  // 更新本地存储
  localStorage.setItem('douluo_player', JSON.stringify(data.player))
  localStorage.setItem('douluo_logs', JSON.stringify(data.logs))
}
</script>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
  background: #f0f2f5;
  overflow: hidden;
}
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 18px;
  color: #666;
}
</style>
