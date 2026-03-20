import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type ThemeType = 'light' | 'dark' | 'dusk' | 'happy'

export const useThemeStore = defineStore('theme', () => {
  // 当前主题
  const currentTheme = ref<ThemeType>('light')
  
  // 是否已登录（用于解锁happy模式）
  const isLoggedIn = ref(false)
  
  // 检查happy模式是否解锁
  const isHappyUnlocked = computed(() => isLoggedIn.value)
  
  // 可用的主题列表
  const availableThemes = computed(() => [
    { value: 'light' as ThemeType, label: '白天模式', icon: '☀️', unlocked: true },
    { value: 'dark' as ThemeType, label: '黑夜模式', icon: '🌙', unlocked: true },
    { value: 'dusk' as ThemeType, label: '黄昏模式', icon: '🌅', unlocked: true },
    { value: 'happy' as ThemeType, label: '个性情感', icon: '😊', unlocked: isHappyUnlocked.value }
  ])
  
  // 设置主题
  const setTheme = (theme: ThemeType) => {
    // 检查happy模式是否已解锁
    if (theme === 'happy' && !isHappyUnlocked.value) {
      return false
    }
    currentTheme.value = theme
    // 保存到localStorage
    localStorage.setItem('theme', theme)
    // 应用主题到body
    applyTheme(theme)
    return true
  }
  
  // 应用主题
  const applyTheme = (theme: ThemeType) => {
    const body = document.body
    // 移除所有主题类
    body.classList.remove('theme-light', 'theme-dark', 'theme-dusk', 'theme-happy')
    // 添加当前主题类
    body.classList.add(`theme-${theme}`)

    // 设置CSS变量
    const root = document.documentElement
    switch (theme) {
      case 'light':
        // 白天模式 - 清新明亮
        root.style.setProperty('--bg-primary', '#f8fafc')
        root.style.setProperty('--bg-secondary', '#ffffff')
        root.style.setProperty('--bg-tertiary', '#f1f5f9')
        root.style.setProperty('--text-primary', '#1f2937')
        root.style.setProperty('--text-secondary', '#6b7280')
        root.style.setProperty('--text-tertiary', '#9ca3af')
        root.style.setProperty('--accent-color', '#667eea')
        root.style.setProperty('--accent-secondary', '#764ba2')
        root.style.setProperty('--border-color', '#e5e7eb')
        root.style.setProperty('--card-bg', '#ffffff')
        root.style.setProperty('--hover-bg', '#f3f4f6')
        root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.08)')
        // 后台侧边栏专用变量
        root.style.setProperty('--sidebar-bg-start', '#1f2937')
        root.style.setProperty('--sidebar-bg-end', '#111827')
        root.style.setProperty('--sidebar-text', '#e5e7eb')
        root.style.setProperty('--sidebar-text-active', '#ffffff')
        root.style.setProperty('--sidebar-hover', '#374151')
        root.style.setProperty('--sidebar-border', '#374151')
        root.style.setProperty('--sidebar-glow', 'rgba(59, 130, 246, 0.1)')
        root.style.setProperty('--header-shadow', '0 1px 3px rgba(0, 0, 0, 0.1)')
        // Element Plus 主题变量
        root.style.setProperty('--el-color-primary', '#667eea')
        root.style.setProperty('--el-color-success', '#10b981')
        root.style.setProperty('--el-color-warning', '#f59e0b')
        root.style.setProperty('--el-color-danger', '#ef4444')
        root.style.setProperty('--el-color-info', '#3b82f6')
        root.style.setProperty('--el-bg-color', '#f8fafc')
        root.style.setProperty('--el-bg-color-page', '#ffffff')
        root.style.setProperty('--el-bg-color-overlay', '#ffffff')
        root.style.setProperty('--el-text-color-primary', '#1f2937')
        root.style.setProperty('--el-text-color-regular', '#4b5563')
        root.style.setProperty('--el-text-color-secondary', '#6b7280')
        root.style.setProperty('--el-text-color-placeholder', '#9ca3af')
        root.style.setProperty('--el-border-color', '#e5e7eb')
        root.style.setProperty('--el-border-color-light', '#f3f4f6')
        root.style.setProperty('--el-border-color-lighter', '#f9fafb')
        root.style.setProperty('--el-border-color-extra-light', '#ffffff')
        root.style.setProperty('--el-fill-color', '#f3f4f6')
        root.style.setProperty('--el-fill-color-light', '#f9fafb')
        root.style.setProperty('--el-fill-color-lighter', '#ffffff')
        root.style.setProperty('--el-fill-color-extra-light', '#ffffff')
        root.style.setProperty('--el-box-shadow', '0 1px 2px 0 rgba(0, 0, 0, 0.05)')
        root.style.setProperty('--el-box-shadow-light', '0 1px 2px 0 rgba(0, 0, 0, 0.05)')
        root.style.setProperty('--el-box-shadow-lighter', '0 1px 2px 0 rgba(0, 0, 0, 0.05)')
        root.style.setProperty('--el-box-shadow-dark', '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)')
        break
      case 'dark':
        // 黑夜模式 - 深邃星空蓝调（优化版）
        root.style.setProperty('--bg-primary', '#0d1117')
        root.style.setProperty('--bg-secondary', '#161b22')
        root.style.setProperty('--bg-tertiary', '#21262d')
        root.style.setProperty('--text-primary', '#e6edf3')
        root.style.setProperty('--text-secondary', '#8b949e')
        root.style.setProperty('--text-tertiary', '#6e7681')
        root.style.setProperty('--accent-color', '#58a6ff')
        root.style.setProperty('--accent-secondary', '#a371f7')
        root.style.setProperty('--border-color', '#30363d')
        root.style.setProperty('--card-bg', '#161b22')
        root.style.setProperty('--hover-bg', '#21262d')
        root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.4)')
        // 后台侧边栏专用变量
        root.style.setProperty('--sidebar-bg-start', '#161b22')
        root.style.setProperty('--sidebar-bg-end', '#0d1117')
        root.style.setProperty('--sidebar-text', '#c9d1d9')
        root.style.setProperty('--sidebar-text-active', '#ffffff')
        root.style.setProperty('--sidebar-hover', '#21262d')
        root.style.setProperty('--sidebar-border', '#30363d')
        root.style.setProperty('--sidebar-glow', 'rgba(88, 166, 255, 0.15)')
        root.style.setProperty('--header-shadow', '0 4px 20px rgba(0, 0, 0, 0.4)')
        // Element Plus 主题变量
        root.style.setProperty('--el-color-primary', '#58a6ff')
        root.style.setProperty('--el-color-success', '#3fb950')
        root.style.setProperty('--el-color-warning', '#d29922')
        root.style.setProperty('--el-color-danger', '#f85149')
        root.style.setProperty('--el-color-info', '#58a6ff')
        root.style.setProperty('--el-bg-color', '#0d1117')
        root.style.setProperty('--el-bg-color-page', '#161b22')
        root.style.setProperty('--el-bg-color-overlay', '#161b22')
        root.style.setProperty('--el-text-color-primary', '#e6edf3')
        root.style.setProperty('--el-text-color-regular', '#c9d1d9')
        root.style.setProperty('--el-text-color-secondary', '#8b949e')
        root.style.setProperty('--el-text-color-placeholder', '#6e7681')
        root.style.setProperty('--el-border-color', '#30363d')
        root.style.setProperty('--el-border-color-light', '#21262d')
        root.style.setProperty('--el-border-color-lighter', '#30363d')
        root.style.setProperty('--el-border-color-extra-light', '#484f58')
        root.style.setProperty('--el-fill-color', '#21262d')
        root.style.setProperty('--el-fill-color-light', '#161b22')
        root.style.setProperty('--el-fill-color-lighter', '#21262d')
        root.style.setProperty('--el-fill-color-extra-light', '#30363d')
        root.style.setProperty('--el-box-shadow', '0 1px 3px rgba(0, 0, 0, 0.3)')
        root.style.setProperty('--el-box-shadow-light', '0 1px 3px rgba(0, 0, 0, 0.3)')
        root.style.setProperty('--el-box-shadow-lighter', '0 1px 3px rgba(0, 0, 0, 0.3)')
        root.style.setProperty('--el-box-shadow-dark', '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)')
        break
      case 'dusk':
        // 黄昏模式 - 温暖夕阳橙金调（优化版）
        root.style.setProperty('--bg-primary', '#1c1917')
        root.style.setProperty('--bg-secondary', '#292524')
        root.style.setProperty('--bg-tertiary', '#353130')
        root.style.setProperty('--text-primary', '#fafaf9')
        root.style.setProperty('--text-secondary', '#a8a29e')
        root.style.setProperty('--text-tertiary', '#78716c')
        root.style.setProperty('--accent-color', '#f97316')
        root.style.setProperty('--accent-secondary', '#fbbf24')
        root.style.setProperty('--border-color', '#44403c')
        root.style.setProperty('--card-bg', '#292524')
        root.style.setProperty('--hover-bg', '#353130')
        root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)')
        // 后台侧边栏专用变量
        root.style.setProperty('--sidebar-bg-start', '#292524')
        root.style.setProperty('--sidebar-bg-end', '#1c1917')
        root.style.setProperty('--sidebar-text', '#d6d3d1')
        root.style.setProperty('--sidebar-text-active', '#fafaf9')
        root.style.setProperty('--sidebar-hover', '#353130')
        root.style.setProperty('--sidebar-border', '#44403c')
        root.style.setProperty('--sidebar-glow', 'rgba(249, 115, 22, 0.15)')
        root.style.setProperty('--header-shadow', '0 4px 20px rgba(0, 0, 0, 0.3)')
        // Element Plus 主题变量
        root.style.setProperty('--el-color-primary', '#f97316')
        root.style.setProperty('--el-color-success', '#34d399')
        root.style.setProperty('--el-color-warning', '#fbbf24')
        root.style.setProperty('--el-color-danger', '#f87171')
        root.style.setProperty('--el-color-info', '#60a5fa')
        root.style.setProperty('--el-bg-color', '#1c1917')
        root.style.setProperty('--el-bg-color-page', '#292524')
        root.style.setProperty('--el-bg-color-overlay', '#292524')
        root.style.setProperty('--el-text-color-primary', '#fafaf9')
        root.style.setProperty('--el-text-color-regular', '#d6d3d1')
        root.style.setProperty('--el-text-color-secondary', '#a8a29e')
        root.style.setProperty('--el-text-color-placeholder', '#78716c')
        root.style.setProperty('--el-border-color', '#44403c')
        root.style.setProperty('--el-border-color-light', '#353130')
        root.style.setProperty('--el-border-color-lighter', '#44403c')
        root.style.setProperty('--el-border-color-extra-light', '#57534e')
        root.style.setProperty('--el-fill-color', '#353130')
        root.style.setProperty('--el-fill-color-light', '#292524')
        root.style.setProperty('--el-fill-color-lighter', '#353130')
        root.style.setProperty('--el-fill-color-extra-light', '#44403c')
        root.style.setProperty('--el-box-shadow', '0 1px 3px rgba(0, 0, 0, 0.3)')
        root.style.setProperty('--el-box-shadow-light', '0 1px 3px rgba(0, 0, 0, 0.3)')
        root.style.setProperty('--el-box-shadow-lighter', '0 1px 3px rgba(0, 0, 0, 0.3)')
        root.style.setProperty('--el-box-shadow-dark', '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)')
        break
      case 'happy':
        // 个性情感模式 - 快乐阳光
        root.style.setProperty('--bg-primary', '#fef9c3')
        root.style.setProperty('--bg-secondary', '#fefce8')
        root.style.setProperty('--bg-tertiary', '#fde047')
        root.style.setProperty('--text-primary', '#713f12')
        root.style.setProperty('--text-secondary', '#a16207')
        root.style.setProperty('--text-tertiary', '#ca8a04')
        root.style.setProperty('--accent-color', '#fbbf24')
        root.style.setProperty('--accent-secondary', '#f59e0b')
        root.style.setProperty('--border-color', '#fcd34d')
        root.style.setProperty('--card-bg', '#fffbeb')
        root.style.setProperty('--hover-bg', '#fef3c7')
        root.style.setProperty('--shadow-color', 'rgba(251, 191, 36, 0.2)')
        // Element Plus 主题变量
        root.style.setProperty('--el-color-primary', '#fbbf24')
        root.style.setProperty('--el-color-success', '#10b981')
        root.style.setProperty('--el-color-warning', '#f59e0b')
        root.style.setProperty('--el-color-danger', '#ef4444')
        root.style.setProperty('--el-color-info', '#3b82f6')
        root.style.setProperty('--el-bg-color', '#fef9c3')
        root.style.setProperty('--el-bg-color-page', '#fefce8')
        root.style.setProperty('--el-bg-color-overlay', '#fefce8')
        root.style.setProperty('--el-text-color-primary', '#713f12')
        root.style.setProperty('--el-text-color-regular', '#a16207')
        root.style.setProperty('--el-text-color-secondary', '#ca8a04')
        root.style.setProperty('--el-text-color-placeholder', '#d97706')
        root.style.setProperty('--el-border-color', '#fcd34d')
        root.style.setProperty('--el-border-color-light', '#fde047')
        root.style.setProperty('--el-border-color-lighter', '#fef3c7')
        root.style.setProperty('--el-border-color-extra-light', '#fefce8')
        root.style.setProperty('--el-fill-color', '#fef3c7')
        root.style.setProperty('--el-fill-color-light', '#fefce8')
        root.style.setProperty('--el-fill-color-lighter', '#ffffff')
        root.style.setProperty('--el-fill-color-extra-light', '#ffffff')
        root.style.setProperty('--el-box-shadow', '0 1px 3px rgba(251, 191, 36, 0.2)')
        root.style.setProperty('--el-box-shadow-light', '0 1px 3px rgba(251, 191, 36, 0.2)')
        root.style.setProperty('--el-box-shadow-lighter', '0 1px 3px rgba(251, 191, 36, 0.2)')
        root.style.setProperty('--el-box-shadow-dark', '0 4px 6px -1px rgba(251, 191, 36, 0.3), 0 2px 4px -1px rgba(251, 191, 36, 0.2)')
        break
    }
  }
  
  // 初始化主题
  const initTheme = (loggedIn: boolean) => {
    isLoggedIn.value = loggedIn
    const savedTheme = localStorage.getItem('theme') as ThemeType
    if (savedTheme && availableThemes.value.find(t => t.value === savedTheme)?.unlocked) {
      setTheme(savedTheme)
    } else {
      setTheme('light')
    }
  }
  
  // 切换登录状态
  const setLoginStatus = (status: boolean) => {
    isLoggedIn.value = status
    // 如果当前是happy模式但已登出，切换到light模式
    if (!status && currentTheme.value === 'happy') {
      setTheme('light')
    }
  }
  
  return {
    currentTheme,
    isHappyUnlocked,
    availableThemes,
    setTheme,
    initTheme,
    setLoginStatus,
    applyTheme
  }
})
