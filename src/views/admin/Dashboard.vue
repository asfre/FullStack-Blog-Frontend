<template>
  <div class="dashboard">
    <h2 class="page-title">仪表盘</h2>
    
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon bg-blue-500">
          <el-icon><DocumentIcon /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.posts }}</div>
          <div class="stat-label">文章总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-green-500">
          <el-icon><CollectionIcon /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.categories }}</div>
          <div class="stat-label">分类总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-purple-500">
          <el-icon><ChatLineRoundIcon /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.comments }}</div>
          <div class="stat-label">评论总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-orange-500">
          <el-icon><ViewIcon /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.views }}</div>
          <div class="stat-label">总浏览量</div>
        </div>
      </div>
    </div>
    
    <!-- 最近文章 -->
    <div class="recent-posts">
      <h3 class="section-title">最近文章</h3>
      <el-table :data="recentPosts" style="width: 100%">
        <el-table-column prop="title" label="标题" width="400">
          <template #default="{ row }">
            <router-link :to="`/post/${row.slug}`" target="_blank" class="post-title">{{ row.title }}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="category.name" label="分类" width="120" />
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'">{{ row.status === 'published' ? '已发布' : '草稿' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="editPost(row.id)">
              <el-icon><EditIcon /></el-icon>
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Document as DocumentIcon, 
  Collection as CollectionIcon, 
  ChatLineRound as ChatLineRoundIcon, 
  View as ViewIcon, 
  Edit as EditIcon 
} from '@element-plus/icons-vue'
import { postApi } from '../../api/post'
import request from '../../utils/request'
import type { Post, Category } from '../../types'

// 响应式数据
const stats = ref({
  posts: 0,
  categories: 0,
  comments: 0,
  views: 0
})

const recentPosts = ref<Post[]>([])
const router = useRouter()

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 编辑文章
const editPost = (id: number) => {
  router.push(`/admin/posts/edit/${id}`)
}

// 获取统计数据和最近文章
const fetchData = async () => {
  try {
    // 并行获取数据
    const [postsResponse, categoriesResponse] = await Promise.all([
      // 获取最近文章
      postApi.getPosts({ limit: 5 }),
      // 获取分类列表
      request.get('/categories')
    ])
    
    recentPosts.value = postsResponse.data.posts
    
    // 计算统计数据
    stats.value = {
      posts: postsResponse.data.total,
      categories: categoriesResponse.data.length,
      comments: 0, // 暂时设为0，需要后端提供评论总数接口
      views: 0 // 暂时设为0，需要后端提供总浏览量接口
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

// 页面挂载时获取数据
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.dashboard {
  padding: 1rem 0;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary, #1f2937);
  transition: color 0.3s ease;
}

/* 统计卡片样式 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-color, 0 1px 3px rgba(0, 0, 0, 0.1));
  padding: 1.5rem;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: #ffffff;
  font-size: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
  margin-bottom: 0.25rem;
  transition: color 0.3s ease;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary, #6b7280);
  transition: color 0.3s ease;
}

/* 最近文章样式 */
.recent-posts {
  background-color: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-color, 0 1px 3px rgba(0, 0, 0, 0.1));
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary, #1f2937);
  transition: color 0.3s ease;
}

.post-title {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.2s ease;
}

.post-title:hover {
  color: #2563eb;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-icon {
    width: 3rem;
    height: 3rem;
    font-size: 1.25rem;
  }
  
  .stat-number {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>