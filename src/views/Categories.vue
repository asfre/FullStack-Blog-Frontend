<template>
  <div class="categories">
    <h1 class="page-title">
      文章分类
      <span class="title-underline"></span>
    </h1>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-16">
      <el-spinner type="chasing-dots" size="40" />
      <p class="mt-4 text-gray-600">加载中...</p>
    </div>

    <!-- 内容区域 -->
    <div v-else class="max-w-4xl mx-auto">
      <!-- 分类手风琴列表 -->
      <div class="accordion-container">
        <div
          v-for="category in categories"
          :key="category.id"
          class="accordion-item"
          :class="{ 'expanded': expandedCategories.has(category.id) }"
        >
          <!-- 分类标题 - 可点击展开/折叠 -->
          <div
            class="accordion-header"
            @click="toggleCategory(category.id)"
            :style="{ '--marker-color': getCategoryColor(category.id) }"
          >
            <div class="marker-mark"></div>
            <h2 class="category-name">{{ category.name }}</h2>
            <span class="post-count">{{ getPostsByCategory(category.id).length }} 篇</span>
            <el-icon class="expand-icon" :size="20">
              <ArrowDown v-if="!expandedCategories.has(category.id)" />
              <ArrowUp v-else />
            </el-icon>
          </div>

          <!-- 分类下的文章列表 -->
          <div class="accordion-content" v-show="expandedCategories.has(category.id)">
            <div v-if="getPostsByCategory(category.id).length === 0" class="empty-state">
              <p>该分类下暂无文章</p>
            </div>
            <div v-else class="posts-list">
              <div
                v-for="(post, index) in getPostsByCategory(category.id)"
                :key="post.id"
                class="post-item"
                :class="{ 'last-item': index === getPostsByCategory(category.id).length - 1 }"
              >
                <div class="post-dot" :style="{ backgroundColor: getCategoryColor(category.id) }"></div>
                <div class="post-card">
                  <h3 class="post-title">
                    <router-link :to="`/post/${post.slug}`">{{ post.title }}</router-link>
                  </h3>
                  <div class="post-meta">
                    <span class="post-date">{{ formatDate(post.createdAt) }}</span>
                    <span class="post-views">{{ post.viewCount || 0 }} 阅读</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 无分类提示 -->
      <div v-if="categories.length === 0" class="text-center py-16">
        <p class="text-gray-600">暂无分类</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { postApi } from '../api/post'
import request from '../utils/request'
import type { Post, Category } from '../types'

// 响应式数据
const posts = ref<Post[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const expandedCategories = ref<Set<number>>(new Set())

// 分类标记笔颜色（与归档页面不同）
const categoryColors = [
  '#f5576c', // 粉红
  '#f093fb', // 紫色
  '#fa709a', // 桃红
  '#ffecd2', // 暖黄
  '#a8edea', // 青色
  '#fed6e3', // 浅粉
  '#d299c2', // 紫红
  '#fef9d7', // 米黄
]

// 获取分类颜色
const getCategoryColor = (categoryId: number): string => {
  return categoryColors[categoryId % categoryColors.length]
}

// 根据分类ID获取文章
const getPostsByCategory = (categoryId: number): Post[] => {
  return posts.value.filter(post => post.categoryId === categoryId)
}

// 切换分类展开/折叠状态
const toggleCategory = (categoryId: number) => {
  if (expandedCategories.value.has(categoryId)) {
    expandedCategories.value.delete(categoryId)
  } else {
    expandedCategories.value.add(categoryId)
  }
}

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 获取文章列表
const fetchPosts = async () => {
  try {
    const response = await postApi.getPosts({ limit: 100 })
    posts.value = response.data.posts
  } catch (error) {
    console.error('获取文章列表失败:', error)
  }
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    const response = await request.get('/categories')
    categories.value = response.data
    // 默认展开第一个分类
    if (categories.value.length > 0) {
      expandedCategories.value.add(categories.value[0].id)
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

// 页面挂载时获取数据
onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([fetchPosts(), fetchCategories()])
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* 页面标题 */
.page-title {
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  display: block;
}

.title-underline {
  display: block;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #f5576c, #f093fb);
  margin: 8px auto 0;
  border-radius: 2px;
}

/* 手风琴容器 */
.accordion-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 手风琴项 */
.accordion-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;
}

.accordion-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 手风琴头部 */
.accordion-header {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.accordion-header:hover {
  background: rgba(0, 0, 0, 0.02);
}

/* 标记笔效果 - 与归档页面不同 */
.marker-mark {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 24px;
  background-color: var(--marker-color, #f5576c);
  border-radius: 3px;
  opacity: 0.7;
}

.category-name {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0 24px;
  flex: 1;
}

.post-count {
  font-size: 14px;
  color: #6b7280;
  margin-right: 12px;
}

.expand-icon {
  color: #9ca3af;
  transition: transform 0.3s ease;
}

.accordion-item.expanded .expand-icon {
  color: #6b7280;
}

/* 手风琴内容 */
.accordion-content {
  padding: 0 24px 20px 48px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 24px;
  color: #9ca3af;
  font-size: 14px;
}

/* 文章列表 */
.posts-list {
  position: relative;
  padding-left: 20px;
}

/* 文章项 */
.post-item {
  position: relative;
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
}

.post-item.last-item {
  margin-bottom: 0;
}

/* 文章圆点 */
.post-dot {
  position: absolute;
  left: -26px;
  top: 10px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 2px currentColor;
  z-index: 1;
}

/* 连接线 */
.post-item:not(.last-item)::before {
  content: '';
  position: absolute;
  left: -22px;
  top: 20px;
  bottom: -16px;
  width: 2px;
  background: linear-gradient(to bottom, #e5e7eb, transparent);
}

/* 文章卡片 */
.post-card {
  flex: 1;
  background: #f9fafb;
  border-radius: 8px;
  padding: 14px 16px;
  transition: all 0.3s ease;
}

.post-card:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.post-title {
  font-size: 15px;
  font-weight: 500;
  margin: 0 0 8px 0;
}

.post-title a {
  color: #1f2937;
  text-decoration: none;
  transition: color 0.3s ease;
}

.post-title a:hover {
  color: #f5576c;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #9ca3af;
}

.post-date {
  color: #6b7280;
}

.post-views {
  color: #9ca3af;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
    margin-bottom: 32px;
  }

  .accordion-header {
    padding: 16px 20px;
  }

  .category-name {
    font-size: 16px;
    margin-left: 20px;
  }

  .accordion-content {
    padding: 0 20px 16px 40px;
  }

  .post-card {
    padding: 12px 14px;
  }

  .post-title {
    font-size: 14px;
  }
}
</style>
