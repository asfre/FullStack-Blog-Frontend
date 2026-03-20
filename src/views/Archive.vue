<template>
  <div class="archive">
    <h1 class="page-title">
      文章归档
      <span class="title-underline"></span>
    </h1>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-spinner type="chasing-dots" size="40" />
      <p class="loading-text">加载中...</p>
    </div>

    <!-- 内容区域 -->
    <div v-else class="content-wrapper">
      <!-- 归档时间线 -->
      <div class="timeline-container">
        <div v-for="(monthPosts, month) in archivedPosts" :key="month" class="timeline-month">
          <div class="month-header">{{ month }}</div>
          <div class="timeline-items">
            <div
              v-for="(post, index) in monthPosts"
              :key="post.id"
              class="timeline-item"
              :class="{ 'last-item': index === monthPosts.length - 1 }"
            >
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="post-card">
                  <h3 class="post-title">
                    <router-link :to="`/post/${post.slug}`">{{ post.title }}</router-link>
                  </h3>
                  <div class="post-meta">
                    <span class="post-date">{{ formatDate(post.createdAt) }}</span>
                    <span class="post-category">{{ post.category.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 无文章提示 -->
      <div v-if="Object.keys(archivedPosts).length === 0" class="empty-container">
        <p class="empty-text">暂无文章</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { postApi } from '../api/post'
import type { Post } from '../types'

// 响应式数据
const posts = ref<Post[]>([])
const loading = ref(true)

// 按月份归档文章
const archivedPosts = computed(() => {
  const result: Record<string, Post[]> = {}

  posts.value.forEach(post => {
    const date = new Date(post.createdAt)
    const monthKey = `${date.getFullYear()}年${date.getMonth() + 1}月`

    if (!result[monthKey]) {
      result[monthKey] = []
    }

    result[monthKey].push(post)
  })

  // 按月份降序排序
  const sortedKeys = Object.keys(result).sort((a, b) => {
    return new Date(b.replace('年', '-').replace('月', '-01'))
      .getTime() - new Date(a.replace('年', '-').replace('月', '-01')).getTime()
  })

  const sortedResult: Record<string, Post[]> = {}
  sortedKeys.forEach(key => {
    sortedResult[key] = result[key]
  })

  return sortedResult
})

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit'
  })
}

// 获取文章列表
const fetchPosts = async () => {
  try {
    const response = await postApi.getPosts({
      limit: 100,
      status: 'published'
    }) // 获取更多文章用于归档
    posts.value = response.data.posts
  } catch (error) {
    console.error('获取文章列表失败:', error)
  }
}

// 页面挂载时获取数据
onMounted(async () => {
  loading.value = true
  try {
    await fetchPosts()
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
  color: var(--text-primary);
}

.title-underline {
  display: block;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--accent-color), var(--accent-secondary));
  margin: 8px auto 0;
  border-radius: 2px;
}

/* 加载容器 */
.loading-container {
  text-align: center;
  padding: 4rem 0;
}

.loading-text {
  margin-top: 1rem;
  color: var(--text-secondary);
}

/* 内容包装器 */
.content-wrapper {
  max-width: 56rem;
  margin-left: auto;
  margin-right: auto;
}

/* 时间线容器 */
.timeline-container {
  position: relative;
  padding-left: 30px;
}

/* 月份标题 */
.month-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--text-primary);
  position: relative;
}

/* 时间线项目容器 */
.timeline-items {
  position: relative;
  margin-bottom: 40px;
}

/* 时间线项目 */
.timeline-item {
  position: relative;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
}

/* 时间线点 */
.timeline-dot {
  position: absolute;
  left: -30px;
  top: 8px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--accent-color);
  border: 2px solid var(--card-bg);
  box-shadow: 0 0 0 2px var(--accent-color);
  z-index: 1;
}

/* 时间线 */
.timeline-item:not(.last-item)::before {
  content: '';
  position: absolute;
  left: -24px;
  top: 20px;
  bottom: -20px;
  width: 2px;
  background-color: var(--border-color);
}

/* 内容区域 */
.timeline-content {
  flex: 1;
  margin-left: 10px;
}

/* 文章卡片 */
.post-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px var(--shadow-color);
  transition: all 0.3s ease;
}

.post-card:hover {
  box-shadow: 0 4px 8px var(--shadow-color);
  transform: translateY(-2px);
}

/* 文章标题 */
.post-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.post-title a {
  color: var(--text-primary);
  transition: color 0.2s ease;
}

.post-title a:hover {
  color: var(--accent-color);
}

/* 文章元信息 */
.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: var(--text-secondary);
}

/* 文章日期 */
.post-date {
  color: var(--text-tertiary);
}

/* 文章分类 */
.post-category {
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

/* 空容器 */
.empty-container {
  text-align: center;
  padding: 4rem 0;
}

.empty-text {
  color: var(--text-secondary);
}
</style>
