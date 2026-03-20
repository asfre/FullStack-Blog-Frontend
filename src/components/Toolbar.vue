<template>
  <!-- 工具栏组件 - 书签样式固定在页面右侧 -->
  <div class="toolbar-bookmark" :class="{ 'visible': showScrollTop }" @click="scrollToTop">
    <!-- 书签标签 -->
    <div class="bookmark-tab" title="回到顶部">
      <el-icon :size="18"><ArrowUp /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowUp } from '@element-plus/icons-vue'

// 显示回到顶部按钮
const showScrollTop = ref(false)

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 处理滚动事件
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  // 滚动超过200px显示回到顶部按钮
  showScrollTop.value = scrollTop > 200
}

// 组件挂载时添加滚动监听
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  // 初始检查
  handleScroll()
})

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 书签样式容器 */
.toolbar-bookmark {
  position: fixed;
  right: 0;
  top: 65%;
  transform: translateY(-50%) translateX(100%);
  z-index: 998;
  transition: transform 0.3s ease;
}

.toolbar-bookmark.visible {
  transform: translateY(-50%) translateX(0);
}

/* 书签标签 */
.bookmark-tab {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 12px 8px;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.bookmark-tab:hover {
  padding-right: 12px;
  box-shadow: -4px 4px 12px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
}

/* 响应式 - 移动端 */
@media (max-width: 768px) {
  .toolbar-bookmark {
    top: 65%;
  }

  .bookmark-tab {
    padding: 10px 6px;
  }
}
</style>
