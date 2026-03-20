/**
 * 实时评论组合式函数
 * 提供评论实时更新功能（基于轮询）
 */

import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as postApi from '../api/post'
import type { Comment } from '../types'
import { useUserStore } from '../stores/userStore'

// 轮询间隔（毫秒）
const POLLING_INTERVAL = 5000

export function useRealtimeComments(
  postId: number | undefined,
  onNewComments?: (comments: Comment[]) => void
) {
  const userStore = useUserStore()
  const comments = ref<Comment[]>([])
  const lastCommentCount = ref(0)
  let pollingTimer: NodeJS.Timeout | null = null
  let isActive = false

  /**
   * 获取评论列表
   */
  const fetchComments = async () => {
    if (!postId) return

    try {
      const response = await postApi.getComments(postId)
      const newComments = response.data || []

      // 检查是否有新评论
      if (newComments.length > lastCommentCount.value && lastCommentCount.value > 0) {
        const newCount = newComments.length - lastCommentCount.value
        // 触发回调通知有新评论
        onNewComments?.(newComments.slice(-newCount))
      }

      comments.value = newComments
      lastCommentCount.value = newComments.length
    } catch (error) {
      console.error('获取评论失败:', error)
    }
  }

  /**
   * 开始轮询
   */
  const startPolling = () => {
    if (pollingTimer || !postId) return
    isActive = true

    // 立即获取一次
    fetchComments()

    // 设置定时轮询
    pollingTimer = setInterval(() => {
      if (isActive) {
        fetchComments()
      }
    }, POLLING_INTERVAL)
  }

  /**
   * 停止轮询
   */
  const stopPolling = () => {
    isActive = false
    if (pollingTimer) {
      clearInterval(pollingTimer)
      pollingTimer = null
    }
  }

  /**
   * 手动刷新评论
   */
  const refreshComments = async () => {
    await fetchComments()
  }

  // 监听 postId 变化
  watch(() => postId, (newId) => {
    if (newId) {
      stopPolling()
      startPolling()
    } else {
      stopPolling()
    }
  })

  // 组件挂载时开始轮询
  onMounted(() => {
    if (postId) {
      startPolling()
    }
  })

  // 组件卸载时停止轮询
  onUnmounted(() => {
    stopPolling()
  })

  return {
    comments,
    refreshComments,
    startPolling,
    stopPolling
  }
}
