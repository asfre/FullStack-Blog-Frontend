/**
 * PWA 工具模块
 * 功能：提供 PWA 相关功能，如更新检测、离线提示等
 */

import { ref } from 'vue'

// PWA 更新状态
export const needRefresh = ref(false)
export const offlineReady = ref(false)

/**
 * 注册 PWA Service Worker
 * 功能：注册 Service Worker 并监听更新事件
 */
export const registerSW = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')

      // 监听更新
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing

        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // 有新版本可用
              needRefresh.value = true
              console.log('PWA: 有新版本可用，请刷新页面')
            }
          })
        }
      })

      // 检查离线状态
      window.addEventListener('online', () => {
        offlineReady.value = false
        console.log('PWA: 已连接到网络')
      })

      window.addEventListener('offline', () => {
        offlineReady.value = true
        console.log('PWA: 进入离线模式')
      })

      // 初始检查网络状态
      offlineReady.value = !navigator.onLine

      console.log('PWA: Service Worker 注册成功')
    } catch (error) {
      console.error('PWA: Service Worker 注册失败:', error)
    }
  }
}

/**
 * 更新 Service Worker
 * 功能：跳过等待，立即激活新版本
 */
export const updateSW = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready

    // 发送消息给 Service Worker 跳过等待
    registration.waiting?.postMessage({ type: 'SKIP_WAITING' })

    // 刷新页面
    window.location.reload()
  }
}

/**
 * 检查 PWA 是否可以安装
 * 功能：检测浏览器是否支持 PWA 安装
 */
export const checkPWAInstallable = (): boolean => {
  return 'BeforeInstallPromptEvent' in window
}

/**
 * 获取安装提示事件
 * 功能：监听 PWA 安装提示事件
 * @returns 安装提示事件或 null
 */
let deferredPrompt: any = null

export const initPWAInstall = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // 阻止默认提示
    e.preventDefault()
    // 保存事件以便后续使用
    deferredPrompt = e
    console.log('PWA: 可以安装应用')
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    console.log('PWA: 应用已安装')
  })
}

/**
 * 触发 PWA 安装
 * 功能：显示 PWA 安装提示
 */
export const promptInstall = async (): Promise<boolean> => {
  if (!deferredPrompt) {
    return false
  }

  deferredPrompt.prompt()

  const { outcome } = await deferredPrompt.userChoice
  deferredPrompt = null

  return outcome === 'accepted'
}

/**
 * 检查是否已安装 PWA
 * 功能：检测应用是否以 PWA 模式运行
 */
export const isPWAInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
}
