<template>
  <!-- 关于我页面 - 展示博主个人信息、技术栈、足迹等 -->
  <div class="about-container">
    <!-- 页面标题 -->
    <div class="about-header">
      <h1 class="about-title">关于我</h1>
      <p class="about-subtitle">了解更多关于我的故事</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else class="about-content">
      <!-- 左侧：个人信息展示 -->
      <div class="about-left">
        <div class="profile-card">
          <!-- 头像区域 -->
          <div class="avatar-section">
            <div class="avatar-wrapper">
              <!-- 博主头像 - 使用默认头像，加载失败时显示备用头像 -->
              <img
                :src="userAvatar"
                alt="博主头像"
                class="profile-avatar"
                @error="handleAvatarError"
              >
            </div>
            <!-- <h2 class="username">{{ aboutInfo.username }}</h2> -->
            <p class="bio">{{ aboutInfo.bio || '这个人很懒，什么都没写~' }}</p>
          </div>

          <!-- 联系方式 -->
          <div class="contact-section">
            <a :href="aboutInfo.githubUrl || 'https://github.com/asfre'" target="_blank" class="contact-item">
              <div class="contact-icon-wrapper github">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <span class="contact-text">GitHub</span>
            </a>
            <a :href="`tencent://message/?uin=${aboutInfo.qqNumber || '414898182'}`" class="contact-item">
              <div class="contact-icon-wrapper qq">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195S3.55 14.96 3.55 17.474c0 .665.17 1.025.281 1.025.114 0 .902-.484 1.748-2.072 0 0-.18 2.197 1.904 3.967 0 0-1.77.495-1.77 1.182 0 .686 4.078.43 6.29.43 2.21 0 6.287.257 6.287-.43 0-.687-1.768-1.182-1.768-1.182 2.085-1.77 1.905-3.967 1.905-3.967.845 1.588 1.634 2.072 1.746 2.072.111 0 .283-.36.283-1.025 0-2.514-2.164-6.954-2.164-6.954V9.325C18.29 3.364 14.268 2 12.003 2z"/>
                </svg>
              </div>
              <span class="contact-text">QQ</span>
            </a>
            <a :href="`mailto:${aboutInfo.email || 'admin@example.com'}`" class="contact-item">
              <div class="contact-icon-wrapper email">
                <el-icon :size="20"><Message /></el-icon>
              </div>
              <span class="contact-text">邮箱</span>
            </a>
          </div>

          <!-- 技术栈 -->
          <div class="tags-section">
            <div class="section-header-row">
              <h3 class="section-subtitle">技术栈</h3>
            </div>
            <div class="tags-cloud">
              <span
                v-for="(tech, index) in aboutInfo.techStack"
                :key="index"
                class="tag-item tech"
                :style="getTagStyle(index, 'tech')"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- 足迹 -->
          <div class="tags-section">
            <div class="section-header-row">
              <h3 class="section-subtitle">足迹</h3>
            </div>
            <div class="tags-cloud">
              <span
                v-for="(place, index) in aboutInfo.visitedProvinces"
                :key="index"
                class="tag-item place"
                :style="getTagStyle(index, 'place')"
              >
                {{ place }}
              </span>
            </div>
          </div>

          <!-- 词云图 -->
          <div class="wordcloud-section">
            <h3 class="section-subtitle">个人词云</h3>
            <div class="wordcloud-container">
              <div
                v-for="(word, index) in wordCloudData"
                :key="index"
                class="wordcloud-item"
                :style="{
                  fontSize: word.size + 'px',
                  color: word.color,
                  left: word.x + '%',
                  top: word.y + '%',
                  transform: 'translate(-50%, -50%) rotate(' + word.rotate + 'deg)',
                  animationDelay: word.delay + 's'
                }"
              >
                {{ word.text }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：详细介绍 -->
      <div class="about-right">
        <!-- 个人简介 -->
        <div class="intro-section">
          <!-- <h2 class="section-title">👋 你好，我是 {{ aboutInfo.username }}</h2> -->
          <div class="intro-content">
            <p>欢迎来到我的博客！这里是我记录学习、分享技术、表达想法的地方。</p>
            <p>我喜欢探索新技术，热爱编程，享受解决复杂问题的过程。</p>
            <p>如果你对我的文章感兴趣，欢迎通过上方的联系方式与我交流。</p>
          </div>
        </div>

        <!-- 摘抄语录 -->
        <QuotesSection class="about-section-gap" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 关于我页面
 * 功能：展示博主个人信息、技术栈、足迹、联系方式等
 */
import { ref, onMounted } from 'vue'
import { Message } from '@element-plus/icons-vue'
import { getBloggerInfo } from '../api/user'
import QuotesSection from '../components/QuotesSection.vue'

// 博主信息 - 初始为空，从API获取
const aboutInfo = ref({
  username: '',
  bio: '',
  email: '',
  githubUrl: '',
  qqNumber: '',
  techStack: [] as string[],
  visitedProvinces: [] as string[]
})

// 加载状态
const loading = ref(true)

// 默认头像 - 使用 DiceBear API 生成默认头像
const userAvatar = ref('https://api.dicebear.com/9.x/avataaars/svg?seed=1')

// 备用头像 - 当默认头像加载失败时使用
const fallbackAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'

/**
 * 处理头像加载错误
 * 功能：当头像图片加载失败时，切换到备用头像
 */
const handleAvatarError = () => {
  userAvatar.value = fallbackAvatar
}

// 词云数据 - 从真实数据生成
const wordCloudData = ref<Array<{
  text: string
  size: number
  color: string
  x: number
  y: number
  rotate: number
  delay: number
}>>([])

/**
 * 生成随机颜色
 * 功能：生成鲜艳的随机颜色
 * @returns 十六进制颜色字符串
 */
const getRandomColor = (): string => {
  const hue = Math.floor(Math.random() * 360)
  const saturation = 60 + Math.floor(Math.random() * 30) // 60-90%
  const lightness = 45 + Math.floor(Math.random() * 20) // 45-65%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

/**
 * 生成词云数据
 * 功能：根据技术栈和足迹生成词云
 */
const generateWordCloud = () => {
  const words: Array<{
    text: string
    size: number
    color: string
    x: number
    y: number
    rotate: number
    delay: number
  }> = []

  // 合并技术栈和足迹作为词云数据源
  const techWords = aboutInfo.value.techStack.length > 0
    ? aboutInfo.value.techStack
    : ['Vue.js', 'Node.js', 'TypeScript', 'JavaScript']

  const placeWords = aboutInfo.value.visitedProvinces.length > 0
    ? aboutInfo.value.visitedProvinces
    : ['长沙市', '娄底市', '衡阳市', '耒阳市', '深圳市', '广州市']

  const allWords = [...techWords, ...placeWords]

  // 生成词云项
  allWords.forEach((text, index) => {
    words.push({
      text,
      size: 14 + Math.floor(Math.random() * 16), // 14-30px 随机大小
      color: getRandomColor(),
      x: 10 + Math.floor(Math.random() * 80), // 10-90% 随机位置
      y: 10 + Math.floor(Math.random() * 80), // 10-90% 随机位置
      rotate: -20 + Math.floor(Math.random() * 40), // -20 到 20 度随机旋转
      delay: index * 0.1 // 依次延迟动画
    })
  })

  wordCloudData.value = words
}

// 获取标签样式
const getTagStyle = (index: number, type: 'tech' | 'place') => {
  const techColors = [
    { bg: '#e3f2fd', border: '#2196f3', text: '#1976d2' },
    { bg: '#f3e5f5', border: '#9c27b0', text: '#7b1fa2' },
    { bg: '#e8f5e9', border: '#4caf50', text: '#388e3c' },
    { bg: '#fff3e0', border: '#ff9800', text: '#f57c00' },
    { bg: '#fce4ec', border: '#e91e63', text: '#c2185b' },
    { bg: '#e0f2f1', border: '#009688', text: '#00796b' }
  ]

  const placeColors = [
    { bg: '#fff8e1', border: '#ffc107', text: '#ffa000' },
    { bg: '#e8eaf6', border: '#3f51b5', text: '#303f9f' },
    { bg: '#fbe9e7', border: '#ff5722', text: '#e64a19' },
    { bg: '#e0f7fa', border: '#00bcd4', text: '#0097a7' },
    { bg: '#f3e5f5', border: '#9c27b0', text: '#7b1fa2' }
  ]

  const colors = type === 'tech' ? techColors : placeColors
  const color = colors[index % colors.length]

  return {
    backgroundColor: color.bg,
    borderColor: color.border,
    color: color.text
  }
}

// 获取博主信息
const fetchAboutInfo = async () => {
  try {
    loading.value = true
    // 从API获取博主信息
    const response = await getBloggerInfo()
    if (response.data) {
      const user = response.data
      aboutInfo.value.username = user.username || ''
      aboutInfo.value.bio = (user as any).bio || ''
      aboutInfo.value.email = user.email || ''
      aboutInfo.value.githubUrl = (user as any).github_url || ''
      aboutInfo.value.qqNumber = (user as any).qq_number || ''
      userAvatar.value = user.avatar || userAvatar.value

      // 处理技术栈 - 后端可能返回数组或JSON字符串
      try {
        const techStack = (user as any).tech_stack
        if (techStack) {
          if (Array.isArray(techStack)) {
            aboutInfo.value.techStack = techStack
          } else if (typeof techStack === 'string') {
            aboutInfo.value.techStack = JSON.parse(techStack)
          } else {
            aboutInfo.value.techStack = []
          }
        } else {
          aboutInfo.value.techStack = []
        }
      } catch {
        aboutInfo.value.techStack = []
      }

      // 处理足迹 - 后端可能返回数组或JSON字符串
      try {
        const visitedProvinces = (user as any).visited_provinces
        if (visitedProvinces) {
          if (Array.isArray(visitedProvinces)) {
            aboutInfo.value.visitedProvinces = visitedProvinces
          } else if (typeof visitedProvinces === 'string') {
            aboutInfo.value.visitedProvinces = JSON.parse(visitedProvinces)
          } else {
            aboutInfo.value.visitedProvinces = []
          }
        } else {
          aboutInfo.value.visitedProvinces = []
        }
      } catch {
        aboutInfo.value.visitedProvinces = []
      }

      // 生成词云数据
      generateWordCloud()
    }
  } catch (error) {
    console.error('获取博主信息失败:', error)
    // 使用默认数据生成词云
    generateWordCloud()
  } finally {
    loading.value = false
  }
}

// 页面挂载时获取数据
onMounted(() => {
  fetchAboutInfo()
})
</script>

<style scoped>
/* 页面容器 */
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 页面标题 */
.about-header {
  text-align: center;
  margin-bottom: 40px;
}

.about-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.about-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

/* 内容区域 */
.about-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

@media (min-width: 1024px) {
  .about-content {
    grid-template-columns: 350px 1fr;
  }
}

/* 左侧卡片 */
.about-left {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.profile-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px var(--shadow-color);
}

/* 头像区域 */
.avatar-section {
  text-align: center;
  margin-bottom: 24px;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid var(--accent-color);
  object-fit: cover;
}

/* .username {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
} */

.bio {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* 联系方式 */
.contact-section {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

.contact-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.contact-item:hover {
  transform: translateY(-3px);
}

.contact-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.contact-icon-wrapper svg,
.contact-icon-wrapper .el-icon {
  width: 22px;
  height: 22px;
  color: white;
}

.contact-icon-wrapper.github {
  background: linear-gradient(135deg, #333 0%, #666 100%);
}

.contact-icon-wrapper.qq {
  background: linear-gradient(135deg, #12b7f5 0%, #0099ff 100%);
}

.contact-icon-wrapper.email {
  background: linear-gradient(135deg, #ea4335 0%, #fbbc05 100%);
}

.contact-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* 标签区域 */
.tags-section {
  margin-bottom: 24px;
}

.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-subtitle {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid;
  transition: all 0.3s ease;
}

.tag-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

/* 词云图 */
.wordcloud-section {
  margin-bottom: 0;
}

.wordcloud-container {
  position: relative;
  height: 200px;
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
}

.wordcloud-item {
  position: absolute;
  font-weight: 600;
  white-space: nowrap;
  animation: float 6s ease-in-out infinite;
  cursor: default;
  transition: transform 0.3s ease;
}

.wordcloud-item:hover {
  transform: translate(-50%, -50%) scale(1.2) !important;
  z-index: 10;
}

@keyframes float {
  0%, 100% {
    transform: translate(-50%, -50%) rotate(var(--rotate, 0deg)) translateY(0);
  }
  50% {
    transform: translate(-50%, -50%) rotate(var(--rotate, 0deg)) translateY(-10px);
  }
}

/* 右侧内容 */
.about-right {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.intro-section {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px var(--shadow-color);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.intro-content {
  color: var(--text-secondary);
  line-height: 1.8;
}

.intro-content p {
  margin-bottom: 12px;
}

.intro-content p:last-child {
  margin-bottom: 0;
}

.about-section-gap {
  margin-top: 0;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-state p {
  margin-top: 16px;
  color: var(--text-secondary);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
