<template>
  <!-- 登录/注册页面 - 科技感紫色渐变设计风格 -->
  <div class="auth-container">
    <!-- 背景层 -->
    <div class="auth-background">
      <!-- 深紫到浅紫对角线渐变 -->
      <div class="gradient-bg"></div>
      <!-- 半透明白色几何圆环装饰 -->
      <div class="geometric-rings">
        <div class="ring ring-1"></div>
        <div class="ring ring-2"></div>
        <div class="ring ring-3"></div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="auth-content">
      <!-- 左侧区域（40%）- 品牌展示 -->
      <div class="brand-section">
        <div class="brand-content">
          <!-- Logo：银色钢笔插入打开的书本，周围环绕小星星 -->
          <div class="brand-logo">
            <svg viewBox="0 0 120 120" class="logo-svg">
              <!-- 书本 -->
              <path d="M20 70 Q20 60 30 60 L55 65 L55 95 Q35 90 20 95 Z" fill="#C0C0C0" stroke="#A0A0A0" stroke-width="1"/>
              <path d="M100 70 Q100 60 90 60 L65 65 L65 95 Q85 90 100 95 Z" fill="#D0D0D0" stroke="#A0A0A0" stroke-width="1"/>
              <path d="M55 65 L65 65 L65 95 L55 95 Z" fill="#E8E8E8"/>
              <!-- 书页线条 -->
              <line x1="25" y1="70" x2="50" y2="72" stroke="#999" stroke-width="0.5"/>
              <line x1="25" y1="75" x2="48" y2="77" stroke="#999" stroke-width="0.5"/>
              <line x1="25" y1="80" x2="46" y2="82" stroke="#999" stroke-width="0.5"/>
              <line x1="95" y1="70" x2="70" y2="72" stroke="#999" stroke-width="0.5"/>
              <line x1="95" y1="75" x2="72" y2="77" stroke="#999" stroke-width="0.5"/>
              <line x1="95" y1="80" x2="74" y2="82" stroke="#999" stroke-width="0.5"/>
              <!-- 钢笔 -->
              <path d="M60 20 L55 55 L60 60 L65 55 Z" fill="url(#penGradient)" stroke="#888" stroke-width="0.5"/>
              <path d="M60 60 L58 65 L60 68 L62 65 Z" fill="#333"/>
              <defs>
                <linearGradient id="penGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#E8E8E8"/>
                  <stop offset="50%" style="stop-color:#C0C0C0"/>
                  <stop offset="100%" style="stop-color:#A0A0A0"/>
                </linearGradient>
              </defs>
              <!-- 小星星 -->
              <circle cx="15" cy="30" r="2" fill="white" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="105" cy="25" r="1.5" fill="white" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="110" cy="45" r="1" fill="white" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.8s" repeatCount="indefinite"/>
              </circle>
              <circle cx="10" cy="50" r="1.5" fill="white" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2.2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="30" cy="15" r="1" fill="white" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0.3;0.6" dur="1.6s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>

          <!-- 主标题 -->
          <h1 class="brand-title">开始你的创作旅程</h1>
          <!-- 副标题 -->
          <p class="brand-subtitle">
            在这里，用文字连接世界 ——<br>
            记录灵感、分享知识、遇见同频伙伴
          </p>

          <!-- 底部创作者数量 -->
          <div class="creator-count">
            <span class="count-icon">
              <el-icon><User /></el-icon>
            </span>
            <span class="count-text">
              已有 <strong>{{ userCount }}</strong> 位创作者在此安家
            </span>
          </div>
        </div>
      </div>

      <!-- 右侧区域（60%）- 表单卡片 -->
      <div class="form-section">
        <div class="form-card">
          <!-- 滑动式 Tab -->
          <div class="tab-container">
            <div class="tab-slider" :style="{ transform: isLogin ? 'translateX(0)' : 'translateX(100%)' }"></div>
            <button
              class="tab-btn"
              :class="{ active: isLogin }"
              @click="isLogin = true"
            >
              登录
            </button>
            <button
              class="tab-btn"
              :class="{ active: !isLogin }"
              @click="isLogin = false"
            >
              注册
            </button>
          </div>

          <!-- 登录表单 -->
          <form v-if="isLogin" @submit.prevent="handleLogin" class="auth-form">
            <!-- 用户名 -->
            <div class="form-field" :class="{ focused: focusedField === 'loginUsername', filled: loginForm.username }">
              <div class="input-wrapper">
                <el-icon class="field-icon"><User /></el-icon>
                <input
                  v-model="loginForm.username"
                  type="text"
                  required
                  @focus="focusedField = 'loginUsername'"
                  @blur="focusedField = ''"
                >
                <label class="field-label">用户名</label>
              </div>
            </div>

            <!-- 密码 -->
            <div class="form-field" :class="{ focused: focusedField === 'loginPassword', filled: loginForm.password }">
              <div class="input-wrapper">
                <el-icon class="field-icon"><Lock /></el-icon>
                <input
                  v-model="loginForm.password"
                  :type="showLoginPassword ? 'text' : 'password'"
                  required
                  @focus="focusedField = 'loginPassword'"
                  @blur="focusedField = ''"
                >
                <label class="field-label">密码</label>
                <span class="eye-icon" @click="showLoginPassword = !showLoginPassword">
                  <el-icon v-if="showLoginPassword"><View /></el-icon>
                  <el-icon v-else><Hide /></el-icon>
                </span>
              </div>
            </div>

            <!-- 记住我 -->
            <div class="form-options">
              <label class="remember-checkbox">
                <input type="checkbox" v-model="loginForm.remember">
                <span class="checkmark"></span>
                <span>记住我</span>
              </label>
              <a href="#" class="forgot-link" @click.prevent="showContactAdmin">忘记密码？</a>
            </div>

            <!-- 登录按钮 -->
            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="loading" class="btn-loader"></span>
              <span v-else>立即登录</span>
            </button>

            <!-- 切换提示 -->
            <p class="switch-hint">
              还没有账号？
              <a href="#" @click.prevent="isLogin = false">立即注册 →</a>
            </p>
          </form>

          <!-- 注册表单 -->
          <form v-else @submit.prevent="handleRegister" class="auth-form">
            <!-- 用户名 -->
            <div class="form-field" :class="{ focused: focusedField === 'regUsername', filled: registerForm.username }">
              <div class="input-wrapper">
                <el-icon class="field-icon"><User /></el-icon>
                <input
                  v-model="registerForm.username"
                  type="text"
                  required
                  @focus="focusedField = 'regUsername'"
                  @blur="focusedField = ''"
                >
                <label class="field-label">用户名 <span class="required">*</span></label>
              </div>
            </div>

            <!-- 邮箱 -->
            <div
              class="form-field"
              :class="{
                focused: focusedField === 'regEmail',
                filled: registerForm.email,
                error: emailError
              }"
            >
              <div class="input-wrapper">
                <el-icon class="field-icon"><Message /></el-icon>
                <input
                  v-model="registerForm.email"
                  type="email"
                  required
                  @focus="focusedField = 'regEmail'"
                  @blur="validateEmail"
                >
                <label class="field-label">邮箱 <span class="required">*</span></label>
              </div>
              <span v-if="emailError" class="error-text">请输入有效的邮箱地址</span>
            </div>

            <!-- 密码 -->
            <div class="form-field" :class="{ focused: focusedField === 'regPassword', filled: registerForm.password }">
              <div class="input-wrapper">
                <el-icon class="field-icon"><Lock /></el-icon>
                <input
                  v-model="registerForm.password"
                  :type="showRegPassword ? 'text' : 'password'"
                  required
                  @focus="focusedField = 'regPassword'"
                  @blur="focusedField = ''"
                  @input="checkPasswordStrength"
                >
                <label class="field-label">密码 <span class="required">*</span></label>
                <span class="eye-icon" @click="showRegPassword = !showRegPassword">
                  <el-icon v-if="showRegPassword"><View /></el-icon>
                  <el-icon v-else><Hide /></el-icon>
                </span>
              </div>
              <!-- 密码强度条 -->
              <div v-if="registerForm.password" class="password-strength">
                <div class="strength-bar">
                  <div class="strength-fill" :class="passwordStrengthClass" :style="{ width: passwordStrength + '%' }"></div>
                </div>
                <span class="strength-text" :class="passwordStrengthClass">{{ passwordStrengthText }}</span>
              </div>
            </div>

            <!-- 注册按钮 -->
            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="loading" class="btn-loader"></span>
              <span v-else>立即免费创建</span>
            </button>

            <!-- 切换提示 -->
            <p class="switch-hint">
              已有账号？
              <a href="#" @click.prevent="isLogin = true">直接登录 →</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 登录/注册表单组件
 * 功能：提供用户登录和注册功能，科技感紫色渐变设计
 */
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Message, View, Hide } from '@element-plus/icons-vue'
import { authApi } from '../../api/auth'
import { getUserCount } from '../../api/user'
import { useUserStore } from '../../stores/userStore'
import { useThemeStore } from '../../stores/themeStore'

// ===== 响应式数据 =====
const isLogin = ref(true)
const loading = ref(false)
const focusedField = ref('')
const userCount = ref(0)
const showLoginPassword = ref(false)
const showRegPassword = ref(false)
const emailError = ref(false)

// ===== Store 和路由 =====
const userStore = useUserStore()
const themeStore = useThemeStore()
const router = useRouter()
const route = useRoute()

// ===== 表单数据 =====
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

const registerForm = reactive({
  username: '',
  email: '',
  password: ''
})

// ===== 密码强度计算 =====
const passwordStrength = ref(0)
const passwordStrengthClass = ref('')
const passwordStrengthText = ref('')

/**
 * 检查密码强度
 * 根据密码长度和复杂度计算强度值
 */
const checkPasswordStrength = () => {
  const password = registerForm.password
  if (!password) {
    passwordStrength.value = 0
    return
  }

  let strength = 0
  // 长度加分
  if (password.length >= 6) strength += 20
  if (password.length >= 10) strength += 20
  // 包含数字
  if (/\d/.test(password)) strength += 20
  // 包含小写字母
  if (/[a-z]/.test(password)) strength += 20
  // 包含大写字母或特殊字符
  if (/[A-Z]/.test(password) || /[^a-zA-Z0-9]/.test(password)) strength += 20

  passwordStrength.value = strength

  // 设置强度等级和文字
  if (strength <= 40) {
    passwordStrengthClass.value = 'weak'
    passwordStrengthText.value = '弱'
  } else if (strength <= 70) {
    passwordStrengthClass.value = 'medium'
    passwordStrengthText.value = '中'
  } else {
    passwordStrengthClass.value = 'strong'
    passwordStrengthText.value = '强'
  }
}

/**
 * 验证邮箱格式
 */
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  emailError.value = registerForm.email !== '' && !emailRegex.test(registerForm.email)
  focusedField.value = ''
}

/**
 * 获取用户总数
 */
const fetchUserCount = async () => {
  try {
    const response = await getUserCount()
    if (response.code === 200) {
      userCount.value = response.data.total
    }
  } catch (error) {
    console.error('获取用户数量失败:', error)
  }
}

// ===== 事件处理函数 =====

/**
 * 处理登录
 */
const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.error('请输入账号和密码')
    return
  }

  loading.value = true
  try {
    const response = await authApi.login(loginForm.username, loginForm.password)
    if (response.code === 200) {
      userStore.login(response.data.user, response.data.token, loginForm.remember)
      // 更新主题登录状态，解锁"个性情感"模式
      themeStore.setLoginStatus(true)
      ElMessage.success('登录成功')
      const redirect = route.query.redirect as string
      if (redirect) {
        router.push(redirect)
      } else {
        router.push('/')
      }
    }
  } catch (error: any) {
    ElMessage.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

/**
 * 显示联系管理员提示
 */
const showContactAdmin = () => {
  ElMessage.info('请联系管理员重置密码')
}

/**
 * 处理注册
 */
const handleRegister = async () => {
  // 验证表单
  if (!registerForm.username || !registerForm.email || !registerForm.password) {
    ElMessage.error('请填写完整的注册信息')
    return
  }

  // 验证邮箱
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(registerForm.email)) {
    emailError.value = true
    ElMessage.error('请输入有效的邮箱地址')
    return
  }

  loading.value = true
  try {
    const response = await authApi.register(registerForm.username, registerForm.password, registerForm.email)
    if (response.code === 201) {
      ElMessage.success('注册成功')
      isLogin.value = true
    }
  } catch (error: any) {
    ElMessage.error(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取用户数量
onMounted(() => {
  fetchUserCount()
})
</script>

<style scoped>
/* ===== 页面容器 ===== */
.auth-container {
  min-height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
}

/* ===== 背景层 ===== */
.auth-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* 深紫到浅紫对角线渐变 */
.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a0a2e 0%, #4a1a6b 30%, #7c3aed 60%, #a855f7 100%);
}

/* 半透明白色几何圆环装饰 */
.geometric-rings {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.ring {
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.ring-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  left: -100px;
  animation: rotate 30s linear infinite;
}

.ring-2 {
  width: 300px;
  height: 300px;
  top: 50%;
  left: 5%;
  border-color: rgba(255, 255, 255, 0.08);
  animation: rotate 25s linear infinite reverse;
}

.ring-3 {
  width: 200px;
  height: 200px;
  bottom: 10%;
  left: 15%;
  border-color: rgba(255, 255, 255, 0.06);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ===== 主内容区域 ===== */
.auth-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 40px 60px;
  gap: 80px;
}

/* ===== 左侧品牌区域（40%）===== */
.brand-section {
  flex: 0 0 40%;
  color: white;
}

.brand-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* Logo */
.brand-logo {
  width: 120px;
  height: 120px;
  margin-bottom: 40px;
}

.logo-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 20px rgba(255, 255, 255, 0.3));
}

/* 标题 */
.brand-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.5px;
}

/* 副标题 */
.brand-subtitle {
  font-size: 16px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 60px;
  max-width: 400px;
}

/* 创作者数量 */
.creator-count {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.count-icon {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
}

.count-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.count-text strong {
  color: white;
  font-size: 18px;
  font-weight: 700;
}

/* ===== 右侧表单区域（60%）===== */
.form-section {
  flex: 0 0 60%;
  display: flex;
  justify-content: center;
}

/* 玻璃拟态卡片 - 带柔和高斯阴影和紫色光晕 */
.form-card {
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  padding: 48px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    /* 多层高斯阴影营造柔和深度 */
    0 2px 4px rgba(0, 0, 0, 0.02),
    0 8px 16px rgba(0, 0, 0, 0.04),
    0 16px 32px rgba(0, 0, 0, 0.06),
    0 32px 64px rgba(0, 0, 0, 0.08),
    /* 紫色光晕 - 边缘发光效果 */
    0 0 0 1px rgba(124, 58, 237, 0.08),
    0 0 40px rgba(124, 58, 237, 0.15),
    0 0 80px rgba(124, 58, 237, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
}

/* 卡片顶部渐变装饰线 */
.form-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%);
  opacity: 0.8;
}

/* 卡片内部微妙光效 */
.form-card::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    ellipse at 30% 20%,
    rgba(124, 58, 237, 0.03) 0%,
    transparent 50%
  );
  pointer-events: none;
}

/* ===== Tab 切换 - 胶囊式设计 ===== */
.tab-container {
  display: flex;
  position: relative;
  margin-bottom: 40px;
  padding: 4px;
  background: rgba(243, 244, 246, 0.8);
  border-radius: 14px;
  border: 1px solid rgba(229, 231, 235, 0.5);
}

/* 滑动背景块 */
.tab-slider {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: white;
  border-radius: 10px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(124, 58, 237, 0.1);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tab-btn {
  flex: 1;
  padding: 14px 0;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  border-radius: 10px;
}

.tab-btn:hover {
  color: #4b5563;
}

.tab-btn.active {
  color: #7c3aed;
  font-weight: 600;
}

/* ===== 表单样式 ===== */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-field {
  position: relative;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.field-icon {
  position: absolute;
  left: 16px;
  font-size: 20px;
  color: #9ca3af;
  transition: color 0.3s ease;
  z-index: 1;
}

.form-field.focused .field-icon,
.form-field.filled .field-icon {
  color: #7c3aed;
}

.input-wrapper input {
  width: 100%;
  padding: 16px 44px 16px 48px;
  border: 1.5px solid #e5e7eb;
  border-radius: 14px;
  font-size: 15px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.25s ease;
  color: #1f2937;
}

.input-wrapper input:hover {
  border-color: #d1d5db;
  background: white;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #7c3aed;
  background: white;
  box-shadow:
    0 0 0 4px rgba(124, 58, 237, 0.08),
    0 2px 8px rgba(124, 58, 237, 0.1);
}

.form-field.error input {
  border-color: #ef4444;
  background: rgba(254, 242, 242, 0.5);
}

.form-field.error input:focus {
  box-shadow:
    0 0 0 4px rgba(239, 68, 68, 0.08),
    0 2px 8px rgba(239, 68, 68, 0.1);
}

/* Label 浮动效果 */
.field-label {
  position: absolute;
  left: 48px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 15px;
  pointer-events: none;
  transition: all 0.3s ease;
  background: white;
  padding: 0 4px;
}

.form-field.focused .field-label,
.form-field.filled .field-label {
  top: 0;
  font-size: 12px;
  color: #7c3aed;
}

.form-field.error .field-label {
  color: #ef4444;
}

.required {
  color: #ef4444;
}

/* 眼睛图标 */
.eye-icon {
  position: absolute;
  right: 16px;
  cursor: pointer;
  color: #9ca3af;
  font-size: 18px;
  transition: color 0.3s ease;
  z-index: 1;
}

.eye-icon:hover {
  color: #7c3aed;
}

/* 错误提示 */
.error-text {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #ef4444;
}

/* 密码强度条 */
.password-strength {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.strength-fill.weak {
  background: #ef4444;
}

.strength-fill.medium {
  background: #f59e0b;
}

.strength-fill.strong {
  background: #10b981;
}

.strength-text {
  font-size: 12px;
  font-weight: 500;
}

.strength-text.weak {
  color: #ef4444;
}

.strength-text.medium {
  color: #f59e0b;
}

.strength-text.strong {
  color: #10b981;
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #6b7280;
}

.remember-checkbox input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remember-checkbox input:checked + .checkmark {
  background: #7c3aed;
  border-color: #7c3aed;
}

.remember-checkbox input:checked + .checkmark::after {
  content: '';
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.forgot-link {
  font-size: 14px;
  color: #7c3aed;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #6d28d9;
}

/* 提交按钮 - 渐变玻璃质感 */
.submit-btn {
  width: 100%;
  padding: 16px 24px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%);
  background-size: 200% 200%;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    0 4px 6px -1px rgba(124, 58, 237, 0.2),
    0 2px 4px -2px rgba(124, 58, 237, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
    0 8px 20px rgba(124, 58, 237, 0.35);
  position: relative;
  overflow: hidden;
}

/* 按钮光泽效果 */
.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.01);
  background-position: 100% 100%;
  box-shadow:
    0 8px 12px -2px rgba(124, 58, 237, 0.3),
    0 4px 6px -2px rgba(124, 58, 237, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.15) inset,
    0 12px 30px rgba(124, 58, 237, 0.45);
}

.submit-btn:hover:not(:disabled)::before {
  left: 100%;
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.99);
  box-shadow:
    0 2px 4px -1px rgba(124, 58, 237, 0.2),
    0 1px 2px -1px rgba(124, 58, 237, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 4px rgba(124, 58, 237, 0.2);
}

/* 按钮加载动画 */
.btn-loader {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 切换提示 */
.switch-hint {
  text-align: center;
  font-size: 14px;
  color: #6b7280;
  margin-top: 8px;
}

.switch-hint a {
  color: #7c3aed;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.switch-hint a:hover {
  color: #6d28d9;
}

/* ===== 响应式设计 ===== */
@media (max-width: 1024px) {
  .auth-content {
    flex-direction: column;
    padding: 40px 24px;
    gap: 40px;
  }

  .brand-section,
  .form-section {
    flex: none;
    width: 100%;
  }

  .brand-content {
    align-items: center;
    text-align: center;
  }

  .brand-title {
    font-size: 32px;
  }

  .brand-subtitle {
    margin-bottom: 30px;
  }

  .form-card {
    max-width: 100%;
    padding: 32px;
  }
}

@media (max-width: 480px) {
  .brand-title {
    font-size: 28px;
  }

  .brand-logo {
    width: 80px;
    height: 80px;
  }

  .form-card {
    padding: 24px;
  }
}
</style>
