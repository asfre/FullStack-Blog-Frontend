<template>
  <div class="post-editor">
    <div class="editor-header">
      <h2 class="page-title">{{ isEdit ? '编辑文章' : '创建文章' }}</h2>
      <div class="header-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isEdit ? '更新' : '发布' }}
        </el-button>
      </div>
    </div>
    
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <!-- 文章标题 -->
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入文章标题" maxlength="200" show-word-limit />
      </el-form-item>
      
      <!-- 文章slug -->
      <el-form-item label="Slug" prop="slug">
        <el-input v-model="form.slug" placeholder="请输入文章slug（可选，默认会根据标题生成）" />
      </el-form-item>
      
      <!-- 文章分类 -->
      <el-form-item label="分类" prop="categoryId">
        <el-select v-model="form.categoryId" placeholder="请选择分类">
          <el-option 
            v-for="category in categories" 
            :key="category.id" 
            :label="category.name" 
            :value="category.id" 
          />
        </el-select>
      </el-form-item>
      
      <!-- 文章标签 -->
      <el-form-item label="标签" prop="tags">
        <el-select v-model="form.tags" multiple placeholder="请选择标签">
          <el-option 
            v-for="tag in tags" 
            :key="tag.id" 
            :label="tag.name" 
            :value="tag.id" 
          />
        </el-select>
      </el-form-item>
      
      <!-- 文章封面 -->
      <el-form-item label="封面图">
        <el-upload
          class="cover-upload"
          :action="'#'"
          :auto-upload="false"
          :file-list="coverFileList"
          :limit="1"
          :on-exceed="handleCoverExceed"
          :on-change="handleCoverChange"
        >
          <template #trigger>
            <el-button type="primary">
              <el-icon><UploadIcon /></el-icon>
              选择封面
            </el-button>
          </template>
          <template #tip>
            <div class="el-upload__tip">
              请上传图片文件，建议尺寸为 1200x600，文件大小不超过 2MB
            </div>
          </template>
        </el-upload>
      </el-form-item>
      
      <!-- 文章摘要 -->
      <el-form-item label="摘要" prop="excerpt">
        <el-input
          v-model="form.excerpt"
          type="textarea"
          placeholder="请输入文章摘要（可选，默认会从内容中提取）"
          rows="3"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
      
      <!-- 文章状态 -->
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="draft">草稿</el-radio>
          <el-radio label="published">已发布</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <!-- 文章内容 -->
      <el-form-item label="内容" prop="content">
        <MdEditor
          v-model="form.content"
          :toolbars="toolbars"
          :preview="true"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { Upload as UploadIcon } from '@element-plus/icons-vue'
import { postApi } from '../../api/post'
import request from '../../utils/request'
import { useUserStore } from '../../stores/userStore'
import type { Post, Category, Tag, CreatePostParams, UpdatePostParams } from '../../types'

// 路由参数
const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)
const isEdit = computed(() => !!id.value)

// 用户存储
const userStore = useUserStore()

// 响应式数据
const formRef = ref()
const loading = ref(false)
const coverFileList = ref<any[]>([])

// 表单数据
const form = reactive({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  coverImage: '',
  categoryId: 1,
  status: 'draft',
  tags: [] as number[]
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 1, max: 200, message: '标题长度在 1 到 200 个字符之间', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择文章分类', trigger: 'change' }
  ]
}

// 分类和标签数据
const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])

// Markdown编辑器工具栏配置
const toolbars = [
  'bold', 'italic', 'strikethrough', '|',
  'h1', 'h2', 'h3', '|',
  'list-ul', 'list-ol', 'blockquote', '|',
  'link', 'image', 'code', 'table', '|',
  'preview', 'fullscreen', 'github'
]

// 处理封面图超出限制
const handleCoverExceed = () => {
  ElMessage.warning('只能上传一张封面图')
}

// 处理封面文件变化 - 转换为Base64存储
const handleCoverChange = (file: any, fileList: any[]) => {
  if (file.status === 'ready') {
    // 当选择文件时，转换为Base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64Result = e.target?.result as string
      // 将完整的Base64数据存入form
      form.coverImage = base64Result
      // 更新文件列表，使用Base64预览
      coverFileList.value = [{
        ...file,
        status: 'success',
        url: base64Result,
        preview: base64Result
      }]
      ElMessage.success('封面选择成功')
    }
    reader.readAsDataURL(file.raw)
  }
}

// 删除封面
const removeCover = () => {
  form.coverImage = ''
  coverFileList.value = []
}

// 处理图片上传成功
const handleImageUploadSuccess = (res: any) => {
  if (res.code === 200 && res.data && res.data.url) {
    return res.data.url
  }
  return 'https://picsum.photos/800/600'
}

// 处理图片上传失败
const handleImageUploadError = () => {
  ElMessage.error('图片上传失败')
}

// 取消编辑
const handleCancel = () => {
  router.push('/admin/posts')
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        if (isEdit.value) {
          // 更新文章
          const params: UpdatePostParams = {
            id: parseInt(id.value),
            title: form.title,
            slug: form.slug,
            content: form.content,
            excerpt: form.excerpt,
            coverImage: form.coverImage,
            categoryId: form.categoryId,
            status: form.status,
            tags: form.tags
          }
          await postApi.updatePost(params)
          ElMessage.success('文章更新成功')
        } else {
          // 创建文章
          const params: CreatePostParams = {
            title: form.title,
            slug: form.slug,
            content: form.content,
            excerpt: form.excerpt,
            coverImage: form.coverImage,
            categoryId: form.categoryId,
            status: form.status,
            tags: form.tags,
            authorId: userStore.user?.id || 1
          }
          await postApi.createPost(params)
          ElMessage.success('文章创建成功')
        }
        router.push('/admin/posts')
      } catch (error: any) {
        ElMessage.error(error.message || '操作失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 获取文章详情（编辑模式）
const fetchPostDetail = async () => {
  if (!isEdit.value) return
  try {
    // 调用API获取文章详情
    const response = await postApi.getPostBySlug(id.value)
    const post = response.data
    
    form.title = post.title
    form.slug = post.slug
    form.content = post.content
    form.excerpt = post.excerpt || ''
    form.coverImage = post.coverImage || ''
    form.categoryId = post.categoryId
    form.status = post.status
    form.tags = post.tags?.map((tag: Tag) => tag.id) || []
    
    if (form.coverImage) {
      coverFileList.value = [{ url: form.coverImage }]
    }
  } catch (error) {
    console.error('获取文章详情失败:', error)
    ElMessage.error('获取文章详情失败')
  }
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    const response = await request.get('/categories')
    categories.value = response.data
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error('获取分类列表失败')
  }
}

// 获取标签列表
const fetchTags = async () => {
  try {
    const response = await request.get('/tags')
    tags.value = response.data
  } catch (error) {
    console.error('获取标签列表失败:', error)
    ElMessage.error('获取标签列表失败')
  }
}

// 页面挂载时获取数据
onMounted(() => {
  fetchCategories()
  fetchTags()
  if (isEdit.value) {
    fetchPostDetail()
  }
})
</script>

<style scoped>
.post-editor {
  padding: 1rem 0;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
  margin: 0;
  transition: color 0.3s ease;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

/* 封面上传样式 */
.cover-upload {
  margin-bottom: 1rem;
}

.cover-preview {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cover-image {
  width: 200px;
  height: 100px;
  object-fit: cover;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-actions {
    align-self: flex-end;
  }
  
  .cover-image {
    width: 150px;
    height: 75px;
  }
}
</style>