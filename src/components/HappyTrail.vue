<template>
  <!-- 笑脸拖尾效果组件 - 仅在happy主题下显示 -->
  <div v-if="themeStore.currentTheme === 'happy'" class="happy-trail-container">
    <!-- 背景笑脸 -->
    <div class="bg-smiles">
      <div
        v-for="(smile, index) in bgSmiles"
        :key="index"
        class="bg-smile"
        :style="smile.style"
      >
        {{ smile.emoji }}
      </div>
    </div>
    
    <!-- 鼠标拖尾笑脸 -->
    <div
      v-for="(trail, index) in trails"
      :key="trail.id"
      class="trail-smile"
      :style="trail.style"
    >
      {{ trail.emoji }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useThemeStore } from '../stores/themeStore'

const themeStore = useThemeStore()

// 背景笑脸
const bgSmiles = ref<Array<{ emoji: string; style: any }>>([])

// 鼠标拖尾
const trails = ref<Array<{ id: number; emoji: string; style: any }>>([])
let trailId = 0
let mouseX = 0
let mouseY = 0
let lastTrailTime = 0

// 笑脸表情数组
const smileEmojis = ['😊', '😄', '😃', '🙂', '😉', '😋', '😎', '🥳', '🤗', '✨']

// 初始化背景笑脸
const initBgSmiles = () => {
  const smiles = []
  for (let i = 0; i < 20; i++) {
    smiles.push({
      emoji: smileEmojis[Math.floor(Math.random() * smileEmojis.length)],
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        fontSize: `${Math.random() * 20 + 20}px`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 3 + 4}s`,
        opacity: Math.random() * 0.3 + 0.1
      }
    })
  }
  bgSmiles.value = smiles
}

// 鼠标移动处理
const handleMouseMove = (e: MouseEvent) => {
  mouseX = e.clientX
  mouseY = e.clientY
  
  const now = Date.now()
  // 限制生成频率，每50ms生成一个
  if (now - lastTrailTime > 50) {
    createTrail(mouseX, mouseY)
    lastTrailTime = now
  }
}

// 创建拖尾
const createTrail = (x: number, y: number) => {
  const emoji = smileEmojis[Math.floor(Math.random() * smileEmojis.length)]
  const id = trailId++
  
  trails.value.push({
    id,
    emoji,
    style: {
      left: `${x}px`,
      top: `${y}px`,
      fontSize: `${Math.random() * 16 + 16}px`,
      transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`
    }
  })
  
  // 1秒后移除
  setTimeout(() => {
    const index = trails.value.findIndex(t => t.id === id)
    if (index > -1) {
      trails.value.splice(index, 1)
    }
  }, 1000)
}

// 监听主题变化
watch(() => themeStore.currentTheme, (newTheme) => {
  if (newTheme === 'happy') {
    initBgSmiles()
    window.addEventListener('mousemove', handleMouseMove)
  } else {
    window.removeEventListener('mousemove', handleMouseMove)
    trails.value = []
    bgSmiles.value = []
  }
}, { immediate: true })

onMounted(() => {
  if (themeStore.currentTheme === 'happy') {
    initBgSmiles()
    window.addEventListener('mousemove', handleMouseMove)
  }
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
.happy-trail-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* 背景笑脸 */
.bg-smiles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.bg-smile {
  position: absolute;
  animation: float 5s ease-in-out infinite;
  user-select: none;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(20px) rotate(-5deg);
  }
}

/* 拖尾笑脸 */
.trail-smile {
  position: fixed;
  pointer-events: none;
  animation: trailFade 1s ease-out forwards;
  user-select: none;
  z-index: 1;
}

@keyframes trailFade {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5) translateY(-50px);
  }
}
</style>
