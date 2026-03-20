import axios from 'axios'

// 根据环境设置 baseURL
const getBaseURL = () => {
  // 生产环境使用实际后端地址
  if (import.meta.env.PROD) {
    return 'https://backend-no0rg5v6s-asfres-projects.vercel.app/api'
  }
  // 开发环境使用代理
  return '/api'
}

// 创建Axios实例
const request = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000, // 增加到30秒，适应AI API调用时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      // 自动携带token
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 统一处理响应数据
    const { data } = response
    if (data.code !== 200 && data.code !== 201) {
      // 统一错误提示
      console.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }
    return data
  },
  (error) => {
    // 统一处理网络错误
    if (error.response && error.response.data) {
      // 后端返回的错误信息
      const errorMessage = error.response.data.message || '请求失败'
      console.error('错误:', errorMessage)
      return Promise.reject(new Error(errorMessage))
    }
    console.error('网络错误:', error.message)
    return Promise.reject(new Error(error.message || '网络错误'))
  }
)

export default request