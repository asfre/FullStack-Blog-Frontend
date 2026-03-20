import request from '../utils/request'
import type { ApiResponse, User, LoginResponse } from '../types'

/**
 * 认证API接口
 */
export const authApi = {
  /**
   * 用户注册
   * @param username 用户名
   * @param password 密码
   * @param email 邮箱
   * @returns 注册成功的用户信息
   */
  register: async (username: string, password: string, email: string): Promise<ApiResponse<User>> => {
    return request.post('/auth/register', { username, password, email })
  },

  /**
   * 用户登录
   * @param username 账号
   * @param password 密码
   * @returns 用户信息和token
   */
  login: async (username: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    return request.post('/auth/login', { username, password })
  },


}