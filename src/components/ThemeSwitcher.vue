<template>
  <!-- 主题切换器组件 - 手风琴书签样式固定在页面右侧 -->
  <div class="theme-bookmark-container" @mouseenter="isExpanded = true" @mouseleave="isExpanded = false">
    <!-- 主题选项 - 手风琴展开（从下往上） -->
    <div class="theme-accordion" :class="{ 'expanded': isExpanded }">
      <button
        v-for="(theme, index) in reversedThemes"
        :key="theme.value"
        class="theme-option"
        :class="{
          'active': themeStore.currentTheme === theme.value,
          'locked': !theme.unlocked,
          'show': isExpanded
        }"
        :style="{ '--delay': index * 0.08 + 's' }"
        @click="selectTheme(theme.value, theme.unlocked)"
        :disabled="!theme.unlocked"
        :title="theme.label + (theme.unlocked ? '' : ' (登录解锁)')"
      >
        <span class="option-icon">{{ theme.icon }}</span>
        <span class="option-label">{{ theme.label }}</span>
        <span v-if="!theme.unlocked" class="lock-icon">🔒</span>
      </button>
    </div>

    <!-- 书签头部 - 始终显示 -->
    <div class="bookmark-tab" :class="{ 'shifted': isExpanded }">
      <span class="bookmark-icon">🎨</span>
    </div>

    <!-- 主题切换动画遮罩 -->
    <div
      v-if="isTransitioning"
      class="theme-transition-overlay"
      :class="[`from-${transitionFrom}`, `to-${transitionTo}`]"
    >
      <div class="transition-wave"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore, type ThemeType } from '../stores/themeStore'
import { ElMessage } from 'element-plus'

const themeStore = useThemeStore()

// 展开状态
const isExpanded = ref(false)

// 切换动画状态
const isTransitioning = ref(false)
const transitionFrom = ref('')
const transitionTo = ref('')

// 反转主题列表（用于从下往上显示）
const reversedThemes = computed(() => [...themeStore.availableThemes].reverse())

// 选择主题
const selectTheme = async (theme: ThemeType, unlocked: boolean) => {
  if (!unlocked) {
    ElMessage.warning('请先登录以解锁此主题')
    return
  }

  // 如果点击的是当前主题，不执行切换
  if (themeStore.currentTheme === theme) {
    return
  }

  // 设置动画参数
  transitionFrom.value = themeStore.currentTheme
  transitionTo.value = theme
  isTransitioning.value = true

  // 延迟执行主题切换，让动画先开始
  setTimeout(() => {
    const success = themeStore.setTheme(theme)
    if (success) {
      ElMessage.success(`已切换到${themeStore.availableThemes.find(t => t.value === theme)?.label}`)
    }
  }, 300)

  // 动画结束后移除遮罩
  setTimeout(() => {
    isTransitioning.value = false
  }, 800)
}
</script>

<style scoped>
/* 书签容器 */
.theme-bookmark-container {
  position: fixed;
  right: 0;
  top: 10%;
  transform: translateY(-0%);
  z-index: 1000;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
  /* 宽度自适应内容，避免占据多余空间 */
  width: fit-content;
  max-width: 200px;
}

/* 手风琴主题选项容器 */
.theme-accordion {
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
  gap: 4px;
  margin-bottom: 4px;
}

/* 主题选项 - 手风琴样式 */
.theme-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  background: var(--card-bg, white);
  border: 1px solid var(--border-color, #e5e7eb);
  border-right: none;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  box-shadow: -2px 2px 8px var(--shadow-color, rgba(0, 0, 0, 0.1));
  opacity: 0;
  transform: translateX(30px) scale(0.8);
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
}

.theme-option.show {
  opacity: 1;
  transform: translateX(0) scale(1);
  max-height: 50px;
  padding-top: 10px;
  padding-bottom: 10px;
  transition-delay: var(--delay);
}

.theme-option:hover:not(:disabled) {
  background: var(--hover-bg, #f3f4f6);
  border-color: var(--accent-color, #667eea);
  padding-right: 20px;
  box-shadow: -4px 4px 12px var(--shadow-color, rgba(0, 0, 0, 0.15));
}

/* hover时文字和图标同时变色 */
.theme-option:hover:not(:disabled) .option-label,
.theme-option:hover:not(:disabled) .option-icon {
  color: var(--accent-color, #667eea);
}

.theme-option.active {
  background: var(--bg-tertiary, #eff6ff);
  border-color: var(--accent-color, #667eea);
}

/* active状态文字和图标同时变色 */
.theme-option.active .option-label,
.theme-option.active .option-icon {
  color: var(--accent-color, #667eea);
}

.theme-option.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.option-icon {
  font-size: 16px;
  color: var(--text-primary, #374151);
  transition: color 0.2s ease;
}

.option-label {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary, #374151);
  transition: color 0.2s ease;
}

.lock-icon {
  font-size: 10px;
}

/* 书签标签 - 始终显示的部分 */
.bookmark-tab {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 10px;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  position: relative;
}

.bookmark-tab.shifted {
  transform: translateY(-10px);
}

.bookmark-tab:hover {
  padding-right: 14px;
  box-shadow: -4px 4px 12px rgba(0, 0, 0, 0.2);
}

.bookmark-icon {
  font-size: 18px;
  writing-mode: horizontal-tb;
}

.bookmark-text {
  font-size: 12px;
  font-weight: 500;
  writing-mode: horizontal-tb;
}

/* 主题切换动画遮罩 */
.theme-transition-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.transition-wave {
  position: absolute;
  top: 45%;
  right: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  animation: expandWave 0.8s ease-out forwards;
}

/* 从不同主题切换的动画颜色 */
.from-light .transition-wave {
  background: #f8fafc;
}

.from-dark .transition-wave {
  background: #0a0a0f;
}

.from-dusk .transition-wave {
  background: #1a0f0a;
}

.from-happy .transition-wave {
  background: #fef9c3;
}

.to-light .transition-wave {
  background: radial-gradient(circle, #f8fafc 0%, #e2e8f0 100%);
}

.to-dark .transition-wave {
  background: radial-gradient(circle, #1e1e2e 0%, #0a0a0f 100%);
}

.to-dusk .transition-wave {
  background: radial-gradient(circle, #fb923c 0%, #f97316 50%, #1a0f0a 100%);
}

.to-happy .transition-wave {
  background: radial-gradient(circle, #fde047 0%, #fbbf24 50%, #f59e0b 100%);
}

@keyframes expandWave {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(50);
    opacity: 0;
  }
}

/* 响应式 - 移动端 */
@media (max-width: 768px) {
  .theme-bookmark-container {
    top: 40%;
  }

  .bookmark-tab {
    padding: 10px 8px;
  }

  .bookmark-icon {
    font-size: 16px;
  }

  .theme-option {
    padding: 8px 12px;
  }

  .theme-option.show {
    max-height: 44px;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .option-label {
    font-size: 12px;
  }
}
</style>
