import { defineStore } from 'pinia'
import type { User } from '../types'

// 用户登录状态存储
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    // 登录
    login(user: User, token: string, remember: boolean = true) {
      this.user = user
      this.token = token
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },

    // 登出
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    // 设置用户信息
    setUser(user: User) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },

    // 初始化用户信息
    initUser() {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        try {
          this.user = JSON.parse(savedUser)
        } catch (error) {
          console.error('Failed to parse saved user:', error)
        }
      }
    }
  }
})