<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1 class="text-xl font-bold text-white">管理后台</h1>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li>
            <router-link to="/admin/dashboard" class="nav-item" active-class="active">
              <el-icon class="nav-icon"><DashboardIcon /></el-icon>
              <span>仪表盘</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/posts" class="nav-item" active-class="active">
              <el-icon class="nav-icon"><DocumentIcon /></el-icon>
              <span>文章管理</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/categories" class="nav-item" active-class="active">
              <el-icon class="nav-icon"><CollectionIcon /></el-icon>
              <span>分类管理</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/comments" class="nav-item" active-class="active">
              <el-icon class="nav-icon"><ChatDotRoundIcon /></el-icon>
              <span>评论审核</span>
              <el-badge v-if="pendingCommentCount > 0" :value="pendingCommentCount" class="comment-badge" />
            </router-link>
          </li>
          <li>
            <router-link to="/admin/settings" class="nav-item" active-class="active">
              <el-icon class="nav-icon"><SettingIcon /></el-icon>
              <span>系统设置</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/announcement" class="nav-item" active-class="active">
              <el-icon class="nav-icon"><NotificationIcon /></el-icon>
              <span>发布公告</span>
            </router-link>
          </li>
        </ul>
      </nav>
      <div class="sidebar-footer">
        <div class="user-info" @click="showUserMenu = !showUserMenu">
          <img v-if="user?.avatar" :src="user.avatar" :alt="user.username" class="user-avatar">
          <div v-else class="user-avatar-placeholder">
            {{ user?.username?.charAt(0) || 'U' }}
          </div>
          <span class="user-name">{{ user?.username || '管理员' }}</span>
          <el-icon class="arrow-icon"><ArrowDownIcon /></el-icon>
        </div>
        <div v-if="showUserMenu" class="user-menu">
          <div class="menu-item" @click="handleLogout">
            <el-icon><SwitchButtonIcon /></el-icon>
            <span>退出登录</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 顶部导航栏 -->
      <header class="main-header">
        <div class="header-left">
          <button class="toggle-sidebar" @click="toggleSidebar">
            <el-icon><MenuIcon /></el-icon>
          </button>
          <h2 class="page-title">{{ pageTitle }}</h2>
        </div>
        <div class="header-right">
          <el-badge class="notification-badge">
            <el-icon class="notification-icon"><BellIcon /></el-icon>
          </el-badge>
        </div>
      </header>

      <!-- 内容区域 -->
      <div class="content-wrapper">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import { useThemeStore } from '../../stores/themeStore'
import request from '../../utils/request'
import {
  Management as DashboardIcon,
  Document as DocumentIcon,
  Collection as CollectionIcon,
  Setting as SettingIcon,
  Menu as MenuIcon,
  ArrowDown as ArrowDownIcon,
  Bell as BellIcon,
  SwitchButton as SwitchButtonIcon,
  Notification as NotificationIcon,
  ChatDotRound as ChatDotRoundIcon
} from '@element-plus/icons-vue'

// 响应式数据
const isSidebarCollapsed = ref(false)
const showUserMenu = ref(false)
const pendingCommentCount = ref(0)
const userStore = useUserStore()
const themeStore = useThemeStore()
const router = useRouter()

// 计算属性
const user = computed(() => userStore.currentUser)
const pageTitle = computed(() => {
  const route = router.currentRoute.value
  const titles: Record<string, string> = {
    '/admin/dashboard': '仪表盘',
    '/admin/posts': '文章管理',
    '/admin/posts/create': '创建文章',
    '/admin/posts/edit/:id': '编辑文章',
    '/admin/categories': '分类管理',
    '/admin/comments': '评论审核',
    '/admin/settings': '系统设置'
  }
  return titles[route.path] || '管理后台'
})

// 获取待审核评论数量
const fetchPendingCommentCount = async () => {
  try {
    const response = await request.get('/comments/pending')
    pendingCommentCount.value = response?.length || 0

    // 如果有新评论，发送浏览器通知
    if (pendingCommentCount.value > 0 && Notification.permission === 'granted') {
      new Notification('新评论待审核', {
        body: `您有 ${pendingCommentCount.value} 条评论待审核`,
        icon: '/favicon.ico'
      })
    }
  } catch (error) {
    console.error('获取待审核评论数量失败:', error)
  }
}

// 轮询检查新评论
let pollInterval: number | null = null
const startPolling = () => {
  fetchPendingCommentCount()
  pollInterval = window.setInterval(() => {
    fetchPendingCommentCount()
  }, 60000) // 每分钟检查一次
}

const stopPolling = () => {
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
}

// 请求通知权限
const requestNotificationPermission = () => {
  if ('Notification' in window) {
    Notification.requestPermission()
  }
}

// 方法
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const handleLogout = () => {
  userStore.logout()
  // 更新主题状态（锁定个性情感模式）
  themeStore.setLoginStatus(false)
  // 退出登录后跳转到首页
  router.push('/')
}

// 页面挂载
onMounted(() => {
  requestNotificationPermission()
  startPolling()
})

// 页面卸载
onUnmounted(() => {
  stopPolling()
})
</script>

<style scoped>
/* ===== 基础布局 - 使用CSS变量支持主题切换 ===== */
.admin-layout {
  display: flex;
  height: 100vh;
  background-color: var(--bg-primary, #f5f7fa);
  transition: background-color 0.5s ease;
}

/* ===== 侧边栏样式 - 主题自适应 ===== */
.sidebar {
  width: 240px;
  background: linear-gradient(180deg, 
    var(--sidebar-bg-start, #1f2937) 0%, 
    var(--sidebar-bg-end, #111827) 100%);
  color: var(--sidebar-text, #e5e7eb);
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

/* 侧边栏装饰光效 */
.sidebar::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at center,
    var(--sidebar-glow, rgba(59, 130, 246, 0.1)) 0%,
    transparent 70%
  );
  animation: sidebarGlow 8s ease-in-out infinite;
  pointer-events: none;
}

@keyframes sidebarGlow {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
  50% { transform: translate(-10%, 10%) scale(1.1); opacity: 0.8; }
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--sidebar-border, #374151);
  position: relative;
  z-index: 1;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  position: relative;
  z-index: 1;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.875rem 1.5rem;
  color: var(--sidebar-text, #e5e7eb);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  margin: 0.25rem 0.75rem;
  border-radius: 10px;
}

/* 导航项悬停效果 */
.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  background: linear-gradient(90deg, 
    var(--accent-color, #3b82f6) 0%, 
    transparent 100%);
  opacity: 0.3;
  transition: width 0.3s ease;
  border-radius: 10px;
}

.nav-item:hover {
  background-color: var(--sidebar-hover, #374151);
  color: var(--sidebar-text-active, #ffffff);
  transform: translateX(4px);
}

.nav-item:hover::before {
  width: 100%;
}

.nav-item.active {
  background: linear-gradient(90deg, 
    var(--accent-color, #3b82f6) 0%, 
    var(--accent-secondary, #6366f1) 100%);
  color: #ffffff;
  box-shadow: 
    0 4px 12px rgba(59, 130, 246, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.nav-icon {
  margin-right: 0.75rem;
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.nav-item:hover .nav-icon {
  transform: scale(1.1);
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--sidebar-border, #374151);
  position: relative;
  z-index: 1;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
}

.user-info:hover {
  background-color: #374151;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin-right: 0.75rem;
}

.user-avatar-placeholder {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 0.75rem;
}

.user-name {
  flex: 1;
}

.arrow-icon {
  font-size: 0.75rem;
  transition: transform 0.2s ease;
}

.user-menu {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.375rem 0.375rem 0 0;
  padding: 0.5rem 0;
  z-index: 100;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background-color: #374151;
}

.menu-item el-icon {
  margin-right: 0.75rem;
}

/* ===== 主内容区样式 - 移除圆角，主题自适应 ===== */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--bg-primary, #f5f7fa);
  /* 明确不设置圆角 */
  border-radius: 0;
  transition: background-color 0.5s ease;
}

.main-header {
  background-color: var(--bg-secondary, #ffffff);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3.75rem;
  box-shadow: var(--header-shadow, 0 1px 3px rgba(0, 0, 0, 0.1));
  transition: all 0.4s ease;
}

.header-left {
  display: flex;
  align-items: center;
}

.toggle-sidebar {
  background: none;
  border: none;
  font-size: 1.25rem;
  margin-right: 1rem;
  cursor: pointer;
  color: var(--text-secondary, #4b5563);
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 8px;
}

.toggle-sidebar:hover {
  background-color: var(--hover-bg, #f3f4f6);
  color: var(--accent-color, #3b82f6);
  transform: scale(1.05);
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary, #111827);
  transition: color 0.3s ease;
}

.header-right {
  display: flex;
  align-items: center;
}

.notification-badge {
  margin-right: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.notification-badge:hover {
  background-color: var(--hover-bg, #f3f4f6);
}

.notification-icon {
  font-size: 1.25rem;
  color: var(--text-secondary, #4b5563);
  transition: all 0.3s ease;
}

.notification-badge:hover .notification-icon {
  color: var(--accent-color, #3b82f6);
  transform: scale(1.1);
}

.content-wrapper {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background-color: var(--bg-primary, #f5f7fa);
  transition: background-color 0.5s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
  }
}
</style>