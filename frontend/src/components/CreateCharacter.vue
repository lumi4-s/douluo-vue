<template>
  <div class="create-container">
    <!-- 发光占卜球 -->
    <div class="crystal-ball-container" @click="handleCreate">
      <div class="crystal-ball">
        <div class="crystal-ball-inner"></div>
        <div class="crystal-ball-glow"></div>
        <div class="crystal-ball-sparkle"></div>
        <!-- 白色光环 -->
        <div class="white-ring ring-1"></div>
        <div class="white-ring ring-2"></div>
        <div class="white-ring ring-3"></div>
        <!-- 白色光点 -->
        <div class="white-particles">
          <span class="particle p1"></span>
          <span class="particle p2"></span>
          <span class="particle p3"></span>
          <span class="particle p4"></span>
          <span class="particle p5"></span>
          <span class="particle p6"></span>
          <span class="particle p7"></span>
          <span class="particle p8"></span>
        </div>
      </div>
      <div class="crystal-ball-base"></div>
    </div>
    
    <div class="create-panel">
      <div class="title">魂穿斗罗模拟器</div>
      <div class="subtitle">
        你从现代穿越而来，灵魂降临在斗罗大陆<br>
        此时唐三尚未觉醒武魂，你比剧情早了半年<br>
        「这个世界，因你的到来而改变」
      </div>

      <label>📛 你的名字</label>
      <input
        type="text"
        v-model="name"
        placeholder="请告诉我你的名字"
        @keyup.enter="handleCreate"
      />

      <label>⚥ 性别</label>
      <select v-model="gender">
        <option value="男">男</option>
        <option value="女">女</option>
      </select>

      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createCharacter } from '../api'

const emit = defineEmits(['created'])

const name = ref('')
const gender = ref('男')
const loading = ref(false)
const error = ref('')

async function handleCreate() {
  error.value = ''
  loading.value = true
  try {
    let playerName = name.value.trim()
    // 如果名字为空或全是数字，则不传名字，让后端随机生成
    if (!playerName || /^\d+$/.test(playerName)) {
      playerName = ''
    }
    const res = await createCharacter(playerName, gender.value)
    emit('created', res.data)
  } catch (e) {
    error.value = e.response?.data?.error || '创建失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #0a0a1a;
}

/* 神殿背景层 */
.create-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    /* 顶部神圣光芒 */
    radial-gradient(ellipse at 50% 0%, rgba(255, 215, 100, 0.4) 0%, rgba(200, 180, 100, 0.2) 20%, transparent 50%),
    /* 中心神圣光晕 */
    radial-gradient(ellipse at 50% 40%, rgba(100, 150, 255, 0.25) 0%, transparent 45%),
    /* 地面金色反光 */
    radial-gradient(ellipse at 50% 100%, rgba(200, 170, 80, 0.2) 0%, transparent 40%),
    /* 左侧深色柱廊 */
    linear-gradient(90deg, rgba(15, 15, 35, 0.9) 0%, rgba(30, 30, 60, 0.6) 10%, transparent 20%),
    /* 右侧深色柱廊 */
    linear-gradient(-90deg, rgba(15, 15, 35, 0.9) 0%, rgba(30, 30, 60, 0.6) 10%, transparent 20%),
    /* 主背景渐变（神殿深蓝紫） */
    linear-gradient(180deg, #1a1a3a 0%, #2a2a5a 25%, #1f1f4a 50%, #151535 75%, #0a0a20 100%);
  filter: blur(10px);
  transform: scale(1.15);
  z-index: 0;
}

/* 神殿装饰层 */
.create-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    /* 左侧神殿柱子（金色装饰） */
    linear-gradient(90deg, 
      transparent 3%, 
      rgba(180, 150, 80, 0.3) 6%, 
      rgba(220, 190, 100, 0.5) 8%, 
      rgba(255, 220, 120, 0.4) 9%, 
      rgba(220, 190, 100, 0.5) 10%, 
      rgba(180, 150, 80, 0.3) 12%, 
      transparent 15%
    ),
    /* 右侧神殿柱子（金色装饰） */
    linear-gradient(-90deg, 
      transparent 3%, 
      rgba(180, 150, 80, 0.3) 6%, 
      rgba(220, 190, 100, 0.5) 8%, 
      rgba(255, 220, 120, 0.4) 9%, 
      rgba(220, 190, 100, 0.5) 10%, 
      rgba(180, 150, 80, 0.3) 12%, 
      transparent 15%
    ),
    /* 顶部神殿穹顶横梁（金色） */
    linear-gradient(180deg, 
      rgba(180, 150, 80, 0.4) 0%, 
      rgba(220, 190, 100, 0.3) 2%, 
      rgba(180, 150, 80, 0.2) 4%, 
      transparent 7%
    ),
    /* 顶部第二道横梁 */
    linear-gradient(180deg, 
      transparent 8%, 
      rgba(150, 120, 60, 0.3) 9%, 
      rgba(180, 150, 80, 0.2) 10%, 
      transparent 12%
    ),
    /* 底部神殿祭坛台阶 */
    linear-gradient(0deg, 
      rgba(100, 80, 40, 0.6) 0%, 
      rgba(150, 120, 60, 0.4) 3%, 
      rgba(120, 100, 50, 0.3) 6%, 
      rgba(100, 80, 40, 0.2) 10%, 
      transparent 15%
    ),
    /* 中心神圣光柱 */
    linear-gradient(90deg, 
      transparent 45%, 
      rgba(255, 220, 120, 0.08) 48%, 
      rgba(255, 240, 180, 0.12) 50%, 
      rgba(255, 220, 120, 0.08) 52%, 
      transparent 55%
    );
  filter: blur(5px);
  z-index: 0;
  pointer-events: none;
}

/* 发光占卜球容器 */
.crystal-ball-container {
  position: absolute;
  top: 75%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.crystal-ball-container:hover {
  transform: translate(-50%, -50%) scale(1.05);
}
.crystal-ball-container:hover .crystal-ball {
  box-shadow: 
    0 0 120px rgba(0, 180, 255, 0.9),
    0 0 200px rgba(0, 180, 255, 0.6),
    0 0 300px rgba(0, 180, 255, 0.4),
    inset 0 0 100px rgba(255, 255, 255, 0.2);
}

/* 占卜球主体 */
.crystal-ball {
  width: 450px;
  height: 450px;
  border-radius: 50%;
  position: relative;
  background: radial-gradient(circle at 30% 30%, rgba(0, 150, 255, 0.4) 0%, rgba(0, 80, 200, 0.6) 40%, rgba(0, 30, 80, 0.8) 100%);
  box-shadow: 
    0 0 80px rgba(0, 150, 255, 0.7),
    0 0 160px rgba(0, 150, 255, 0.5),
    0 0 240px rgba(0, 150, 255, 0.3),
    inset 0 0 80px rgba(255, 255, 255, 0.15);
  animation: ballPulse 3s ease-in-out infinite;
}

/* 占卜球内部 */
.crystal-ball-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  height: 60%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  animation: innerGlow 2s ease-in-out infinite alternate;
}

/* 占卜球光晕 */
.crystal-ball-glow {
  position: absolute;
  top: -20%;
  left: -20%;
  width: 140%;
  height: 140%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 150, 255, 0.4) 0%, transparent 60%);
  animation: glowRotate 8s linear infinite;
  pointer-events: none;
}

/* 占卜球闪光 */
.crystal-ball-sparkle {
  position: absolute;
  top: 20%;
  left: 25%;
  width: 20%;
  height: 20%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  animation: sparkle 1.5s ease-in-out infinite;
}

/* 白色光环 */
.white-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  pointer-events: none;
}
.ring-1 {
  width: 110%;
  height: 110%;
  transform: translate(-50%, -50%);
  animation: ringRotate 8s linear infinite, ringPulse 3s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.2);
}
.ring-2 {
  width: 125%;
  height: 125%;
  transform: translate(-50%, -50%);
  animation: ringRotateReverse 12s linear infinite, ringPulse 4s ease-in-out infinite 0.5s;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}
.ring-3 {
  width: 140%;
  height: 140%;
  transform: translate(-50%, -50%);
  animation: ringRotate 16s linear infinite, ringPulse 5s ease-in-out infinite 1s;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

/* 白色光点容器 */
.white-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 130%;
  height: 130%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

/* 白色光点 */
.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  animation: particleOrbit 6s linear infinite, particleTwinkle 2s ease-in-out infinite;
}
.p1 { top: 0%; left: 50%; animation-delay: 0s, 0s; }
.p2 { top: 15%; left: 85%; animation-delay: -0.75s, -0.3s; }
.p3 { top: 50%; left: 100%; animation-delay: -1.5s, -0.6s; }
.p4 { top: 85%; left: 85%; animation-delay: -2.25s, -0.9s; }
.p5 { top: 100%; left: 50%; animation-delay: -3s, -1.2s; }
.p6 { top: 85%; left: 15%; animation-delay: -3.75s, -1.5s; }
.p7 { top: 50%; left: 0%; animation-delay: -4.5s, -1.8s; }
.p8 { top: 15%; left: 15%; animation-delay: -5.25s, -2.1s; }

/* 占卜球底座 */
.crystal-ball-base {
  width: 180px;
  height: 40px;
  background: linear-gradient(180deg, #4a6a8a 0%, #2a4a6a 100%);
  border-radius: 0 0 50% 50%;
  margin-top: -15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
}

/* 动画 */
@keyframes ballPulse {
  0%, 100% {
    box-shadow: 
      0 0 80px rgba(0, 150, 255, 0.7),
      0 0 160px rgba(0, 150, 255, 0.5),
      0 0 240px rgba(0, 150, 255, 0.3),
      inset 0 0 80px rgba(255, 255, 255, 0.15);
  }
  50% {
    box-shadow: 
      0 0 100px rgba(0, 180, 255, 0.9),
      0 0 200px rgba(0, 180, 255, 0.6),
      0 0 300px rgba(0, 180, 255, 0.4),
      inset 0 0 100px rgba(255, 255, 255, 0.2);
  }
}

@keyframes innerGlow {
  0% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

@keyframes glowRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* 白色光环旋转动画 */
@keyframes ringRotate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
@keyframes ringRotateReverse {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
}

/* 白色光环呼吸动画 */
@keyframes ringPulse {
  0%, 100% {
    opacity: 0.4;
    border-color: rgba(255, 255, 255, 0.4);
  }
  50% {
    opacity: 0.8;
    border-color: rgba(255, 255, 255, 0.8);
  }
}

/* 白色光点轨道旋转动画 */
@keyframes particleOrbit {
  0% {
    transform: rotate(0deg) translateX(0px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(0px) rotate(-360deg);
  }
}

/* 白色光点闪烁动画 */
@keyframes particleTwinkle {
  0%, 100% {
    opacity: 0.4;
    transform: scale(0.6);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.create-panel {
  background: transparent;
  border-radius: 16px;
  padding: 30px;
  width: 100%;
  max-width: 900px;
  box-shadow: none;
  position: relative;
  z-index: 2;
  border: none;
}
.title {
  text-align: center;
  font-size: 72px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  letter-spacing: 4px;
}
.subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.8;
}
label {
  display: block;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  margin: 12px auto 6px;
  font-weight: 600;
  max-width: 400px;
}
input, select {
  width: 100%;
  max-width: 400px;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  margin: 0 auto;
  display: block;
}
input:focus, select:focus {
  border-color: #8a2be2;
  box-shadow: 0 0 8px rgba(138, 43, 226, 0.5);
}
.random-tip {
  margin: 16px 0;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
}
.btn-create {
  width: 100%;
  max-width: 400px;
  padding: 12px;
  background: #5b8def;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 80px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
.btn-create:hover:not(:disabled) {
  background: #4a7de0;
}
.btn-create:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.error {
  margin-top: 12px;
  color: #ff6b6b;
  font-size: 13px;
  text-align: center;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}
</style>
