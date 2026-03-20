import { defineStore } from 'pinia'

// 全局配置存储
export const useConfigStore = defineStore('config', {
  state: () => ({
    siteTitle: 'FullStack-Blog',
    siteDescription: '基于 Vue 3 + Node.js + MySQL 的全栈博客系统',
    siteCopyright: '© 2026 FullStack-Blog. All rights reserved.'
  }),
  
  getters: {
    getSiteTitle: (state) => state.siteTitle,
    getSiteDescription: (state) => state.siteDescription,
    getSiteCopyright: (state) => state.siteCopyright
  },
  
  actions: {
    // 更新站点标题
    updateSiteTitle(title: string) {
      this.siteTitle = title
    },
    
    // 更新站点描述
    updateSiteDescription(description: string) {
      this.siteDescription = description
    },
    
    // 更新站点版权信息
    updateSiteCopyright(copyright: string) {
      this.siteCopyright = copyright
    }
  }
})