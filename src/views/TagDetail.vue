<template>
  <div class="tag-detail">
    <h1 class="text-3xl font-bold mb-8 text-center">{{ tag?.name }}标签</h1>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-16">
      <el-spinner type="chasing-dots" size="40" />
      <p class="mt-4 text-gray-600">加载中...</p>
    </div>
    
    <!-- 内容区域 -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 主内容区 -->
      <div class="lg:col-span-2">
        <!-- 文章列表 -->
        <div v-if="posts.length > 0" class="space-y-6">
          <div v-for="post in posts" :key="post.id" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold mb-3">
              <router-link :to="`/post/${post.slug}`" class="hover:text-primary-600">{{ post.title }}</router-link>
            </h2>
            <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span>{{ formatDate(post.createdAt) }}</span>
              <span>{{ post.viewCount }} 阅读</span>
              <span v-if="post.category">{{ post.category.name }}</span>
            </div>
            <p class="text-gray-600 mb-4">{{ post.excerpt }}</p>
            <router-link :to="`/post/${post.slug}`" class="text-primary-600 hover:text-primary-700">阅读全文 →</router-link>
          </div>
        </div>
        
        <!-- 无文章提示 -->
        <div v-else class="text-center py-12">
          <p class="text-gray-600 text-lg">该标签下暂无文章</p>
        </div>
      </div>
      
      <!-- 侧边栏 -->
      <div class="lg:col-span-1">
        <!-- 分类列表 -->
        <div class="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 class="text-lg font-bold mb-3">所有分类</h3>
          <ul class="space-y-2">
            <li v-for="cat in categories" :key="cat.id">
              <router-link :to="`/categories/${cat.slug}`" class="flex justify-between items-center hover:text-primary-600">
                <span>{{ cat.name }}</span>
                <span class="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{{ cat.count }}</span>
              </router-link>
            </li>
            <li v-if="categories.length === 0" class="text-gray-500 text-sm">
              暂无分类
            </li>
          </ul>
        </div>
        
        <!-- 标签云 -->
        <div class="bg-white rounded-lg shadow-md p-4">
          <h3 class="text-lg font-bold mb-3">所有标签</h3>
          <div class="flex flex-wrap gap-2">
            <router-link 
              v-for="t in tags" 
              :key="t.id" 
              :to="`/tags/${t.slug}`" 
              class="bg-gray-100 hover:bg-primary-100 hover:text-primary-600 px-3 py-1 rounded-full text-sm"
            >
              {{ t.name }}
            </router-link>
            <p v-if="tags.length === 0" class="text-gray-500 text-sm">
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
import { vLoading } from 'element-plus'

// 路由参数
const route = useRoute()
const slug = computed(() => route.params.slug as string)

// 响应式数据
const posts = ref<Post[]>([])
const categories = ref<(Category & { count: number })[]>([])
const tags = ref<Tag[]>([])
const loading = ref(true)

// 当前标签
const tag = computed(() => tags.value.find(t => t.slug === slug.value))

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
    if (tag.value) {
      const response = await postApi.getPosts({ 
        limit: 100,
        tagId: tag.value.id.toString(),
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
      fetchTags()
    ])
    await fetchPosts()
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* 组件级样式 */
</style>