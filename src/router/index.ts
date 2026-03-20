import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import BlankLayout from '../layouts/BlankLayout.vue'
import HomeView from '../views/Home.vue'
import PostDetailView from '../views/PostDetail.vue'
import ArchiveView from '../views/Archive.vue'
import CategoriesView from '../views/Categories.vue'
import CategoryDetailView from '../views/CategoryDetail.vue'
import TagDetailView from '../views/TagDetail.vue'
import LoginView from '../views/Login.vue'
import ProfileView from '../views/Profile.vue'
import AboutView from '../views/About.vue'
import GamesView from '../views/Games.vue'

import adminRoutes from './admin'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 使用主布局的路由（有导航栏）
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
        {
          path: 'post/:slug',
          name: 'post-detail',
          component: PostDetailView,
          props: true
        },
        {
          path: 'archive',
          name: 'archive',
          component: ArchiveView
        },
        {
          path: 'categories',
          name: 'categories',
          component: CategoriesView
        },
        {
          path: 'categories/:slug',
          name: 'category-detail',
          component: CategoryDetailView,
          props: true
        },
        {
          path: 'tags/:slug',
          name: 'tag-detail',
          component: TagDetailView,
          props: true
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'about',
          name: 'about',
          component: AboutView
        },
        {
          path: 'games',
          name: 'games',
          component: GamesView
        }
      ]
    },
    
    // 使用空白布局的路由（无导航栏）
    {
      path: '/',
      component: BlankLayout,
      children: [
        {
          path: 'login',
          name: 'login',
          component: LoginView
        }
        // TODO: 创建以下页面后再启用
        // {
        //   path: 'register',
        //   name: 'register',
        //   component: () => import('../views/Register.vue')
        // },
        // {
        //   path: 'forgot-password',
        //   name: 'forgot-password',
        //   component: () => import('../views/ForgotPassword.vue')
        // },
        // {
        //   path: 'reset-password',
        //   name: 'reset-password',
        //   component: () => import('../views/ResetPassword.vue')
        // }
      ]
    },

    ...adminRoutes
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  
  // 从localStorage获取token和用户信息
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null
  
  if (requiresAuth) {
    if (!token) {
      // 未登录，跳转到登录页
      next({ path: '/login' })
    } else if (requiresAdmin && user?.role !== 'admin') {
      // 非管理员，禁止访问
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
