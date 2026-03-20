<template>
  <!-- 右侧气泡通知组件 - 右滑消失动效 -->
  <div class="toast-container">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item"
        :class="[`toast-${toast.type}`]"
        @touchstart="handleTouchStart($event, toast.id)"
        @touchmove="handleTouchMove($event, toast.id)"
        @touchend="handleTouchEnd(toast.id)"
        @mousedown="handleMouseDown($event, toast.id)"
        @mousemove="handleMouseMove($event, toast.id)"
        @mouseup="handleMouseUp(toast.id)"
        @mouseleave="handleMouseUp(toast.id)"
        :style="getToastStyle(toast.id)"
      >
        <div class="toast-content">
          <el-icon v-if="toast.type === 'error'" class="toast-icon"><CircleCloseFilled /></el-icon>
          <el-icon v-else-if="toast.type === 'warning'" class="toast-icon"><WarningFilled /></el-icon>
          <el-icon v-else-if="toast.type === 'success'" class="toast-icon"><CircleCheckFilled /></el-icon>
          <el-icon v-else class="toast-icon"><InfoFilled /></el-icon>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
        <div class="toast-progress" :style="{ animationDuration: `${toast.duration}ms` }"></div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
/**
 * 右侧气泡通知组件
 * 支持右滑消失动效，自动消失
 */
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { CircleCloseFilled, WarningFilled, CircleCheckFilled, InfoFilled } from '@element-plus/icons-vue'

interface Toast {
  id: number
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration: number
  timer?: NodeJS.Timeout
}

interface ToastPosition {
  x: number
  startX: number
  isDragging: boolean
}

const toasts = ref<Toast[]>([])
const toastPositions = reactive<Map<number, ToastPosition>>(new Map())
let toastIdCounter = 0

// 添加通知
const addToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', duration: number = 3000) => {
  const id = ++toastIdCounter
  const toast: Toast = {
    id,
    message,
    type,
    duration
  }

  // 初始化位置
  toastPositions.set(id, { x: 0, startX: 0, isDragging: false })

  toasts.value.push(toast)

  // 自动消失
  toast.timer = setTimeout(() => {
    removeToast(id)
  }, duration)
}

// 移除通知
const removeToast = (id: number) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    const toast = toasts.value[index]
    if (toast.timer) {
      clearTimeout(toast.timer)
    }
    toasts.value.splice(index, 1)
    toastPositions.delete(id)
  }
}

// 获取样式
const getToastStyle = (id: number) => {
  const pos = toastPositions.get(id)
  if (!pos) return {}
  return {
    transform: `translateX(${pos.x}px)`
  }
}

// 触摸/鼠标事件处理
const handleTouchStart = (e: TouchEvent, id: number) => {
  const pos = toastPositions.get(id)
  if (pos) {
    pos.startX = e.touches[0].clientX - pos.x
    pos.isDragging = true
  }
}

const handleTouchMove = (e: TouchEvent, id: number) => {
  const pos = toastPositions.get(id)
  if (pos && pos.isDragging) {
    const newX = e.touches[0].clientX - pos.startX
    // 只允许向右滑动
    pos.x = Math.max(0, newX)
  }
}

const handleTouchEnd = (id: number) => {
  const pos = toastPositions.get(id)
  if (pos) {
    pos.isDragging = false
    // 如果滑动超过 100px，移除通知
    if (pos.x > 100) {
      removeToast(id)
    } else {
      // 否则回弹
      pos.x = 0
    }
  }
}

// 鼠标事件处理（桌面端支持）
const handleMouseDown = (e: MouseEvent, id: number) => {
  const pos = toastPositions.get(id)
  if (pos) {
    pos.startX = e.clientX - pos.x
    pos.isDragging = true
  }
}

const handleMouseMove = (e: MouseEvent, id: number) => {
  const pos = toastPositions.get(id)
  if (pos && pos.isDragging) {
    const newX = e.clientX - pos.startX
    pos.x = Math.max(0, newX)
  }
}

const handleMouseUp = (id: number) => {
  const pos = toastPositions.get(id)
  if (pos) {
    pos.isDragging = false
    if (pos.x > 100) {
      removeToast(id)
    } else {
      pos.x = 0
    }
  }
}

// 暴露方法给外部使用
defineExpose({
  addToast,
  removeToast
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  min-width: 280px;
  max-width: 400px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  cursor: grab;
  user-select: none;
  transition: transform 0.3s ease;
}

.toast-item:active {
  cursor: grabbing;
}

.toast-content {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  gap: 10px;
}

.toast-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.toast-message {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  word-break: break-word;
}

.toast-progress {
  height: 3px;
  background: rgba(0, 0, 0, 0.1);
  position: relative;
}

.toast-progress::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: currentColor;
  animation: progress linear forwards;
  opacity: 0.3;
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* 不同类型样式 */
.toast-error {
  border-left: 4px solid #f56c6c;
}
.toast-error .toast-icon {
  color: #f56c6c;
}

.toast-warning {
  border-left: 4px solid #e6a23c;
}
.toast-warning .toast-icon {
  color: #e6a23c;
}

.toast-success {
  border-left: 4px solid #67c23a;
}
.toast-success .toast-icon {
  color: #67c23a;
}

.toast-info {
  border-left: 4px solid #909399;
}
.toast-info .toast-icon {
  color: #909399;
}

/* 过渡动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
