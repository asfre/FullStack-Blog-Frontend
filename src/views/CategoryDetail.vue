<template>
  <div class="category-detail">
    <h1 class="page-title">{{ category?.name }}分类</h1>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-spinner type="chasing-dots" size="40" />
      <p class="loading-text">加载中...</p>
    </div>

    <!-- 内容区域 -->
    <div v-else class="content-grid">
      <!-- 主内容区 -->
      <div class="main-content">
        <!-- 文章列表 -->
        <div v-if="posts.length > 0" class="posts-list">
          <div v-for="post in posts" :key="post.id" class="post-item">
            <h2 class="post-title">
              <router-link :to="`/post/${post.slug}`">{{ post.title }}</router-link>
            </h2>
            <div class="post-meta">
              <span>{{ formatDate(post.createdAt) }}</span>
              <span>{{ post.viewCount }} 阅读</span>
              <span v-if="post.category">{{ post.category.name }}</span>
            </div>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <router-link :to="`/post/${post.slug}`" class="read-more">阅读全文 →</router-link>
          </div>
        </div>

        <!-- 无文章提示 -->
        <div v-else class="empty-state">
          <p>该分类下暂无文章</p>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="sidebar">
        <!-- 分类列表 -->
        <div class="sidebar-card">
          <h3 class="sidebar-title">所有分类</h3>
          <ul class="category-list">
            <li v-for="cat in categories" :key="cat.id">
              <router-link :to="`/categories/${cat.slug}`" class="category-link">
                <span>{{ cat.name }}</span>
                <span class="category-count">{{ cat.count }}</span>
              </router-link>
            </li>
            <li v-if="categories.length === 0" class="empty-item">
              暂无分类
            </li>
          </ul>
        </div>

        <!-- 标签云 -->
        <div class="sidebar-card">
          <h3 class="sidebar-title">标签</h3>
          <div class="tag-cloud">
            <router-link
              v-for="tag in tags"
              :key="tag.id"
              :to="`/tags/${tag.slug}`"
              class="tag-link"
            >
              {{ tag.name }}
            </router-link>
            <p v-if="tags.length === 0" class="empty-item">
              暂无标签
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { postApi } from '../api/post'
import type { Post, Category, Tag } from '../types'

// 路由参数
const route = useRoute()
const slug = computed(() => route.params.slug as string)

// 响应式数据
const posts = ref<Post[]>([])
const categories = ref<(Category & { count: number })[]>([])
const tags = ref<Tag[]>([])
const loading = ref(true)

// 当前分类
const category = computed(() => categories.value.find(cat => cat.slug === slug.value))

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
    if (category.value) {
      const response = await postApi.getPosts({
        limit: 100,
        categoryId: category.value.id.toString(),
        status: 'published'
      })
      posts.value = response.data.posts
    }
  } catch (error) {
    console.error('获取文章列表失败:', error)
  }
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    const response = await postApi.getCategories()
    categories.value = response.data
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

// 获取标签列表
const fetchTags = async () => {
  try {
    const response = await postApi.getTags()
    tags.value = response.data
  } catch (error) {
    console.error('获取标签列表失败:', error)
  }
}

// 监听路由参数变化
watch(() => route.params.slug, async () => {
  loading.value = true
  try {
    await fetchPosts()
  } catch (error) {
    console.error('获取文章列表失败:', error)
  } finally {
    loading.value = false
  }
}, { immediate: false })

// 页面挂载时获取数据
onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      fetchCategories(),
      fetchTags(),
      fetchPosts()
    ])
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
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: var(--text-primary);
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

/* 内容网格 */
.content-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
}

@media (min-width: 1024px) {
  .content-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .main-content {
    grid-column: span 2;
  }

  .sidebar {
    grid-column: span 1;
  }
}

/* 文章列表 */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post-item {
  background-color: var(--card-bg);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px var(--shadow-color);
  padding: 1.5rem;
}

.post-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.post-title a {
  color: var(--text-primary);
  transition: color 0.2s ease;
}

.post-title a:hover {
  color: var(--accent-color);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.post-excerpt {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.read-more {
  color: var(--accent-color);
  transition: color 0.2s ease;
}

.read-more:hover {
  color: var(--accent-secondary);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 3rem 0;
}

.empty-state p {
  color: var(--text-secondary);
  font-size: 1.125rem;
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  background-color: var(--card-bg);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px var(--shadow-color);
  padding: 1rem;
}

.sidebar-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

/* 分类列表 */
.category-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-primary);
  transition: color 0.2s ease;
}

.category-link:hover {
  color: var(--accent-color);
}

.category-count {
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

/* 标签云 */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-link {
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.tag-link:hover {
  background-color: var(--bg-tertiary);
  color: var(--accent-color);
}

/* 空项 */
.empty-item {
  color: var(--text-tertiary);
  font-size: 0.875rem;
}
</style>
