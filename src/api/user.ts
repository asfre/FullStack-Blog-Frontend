import request from '../utils/request'
import type { ApiResponse, User } from '../types'

/**
 * 用户API接口
 * 用于获取用户信息、编辑资料等
 */

/**
 * 获取用户信息
 * @param userId 用户ID
 * @returns 用户信息
 */
export const getUserById = async (userId: number): Promise<ApiResponse<User>> => {
  return request.get(`/users/${userId}`)
}

/**
 * 获取博主信息（用于关于我页面）
 * 默认获取ID为1的用户（博主）
 * @returns 博主信息
 */
export const getBloggerInfo = async (): Promise<ApiResponse<User>> => {
  return request.get('/users/1')
}

/**
 * 更新用户信息
 * @param userId 用户ID
 * @param data 用户数据
 * @returns 更新后的用户信息
 */
export const updateUser = async (userId: number, data: Partial<User>): Promise<ApiResponse<User>> => {
  return request.put(`/users/${userId}`, data)
}

/**
 * 获取用户总数
 * 用于登录页面显示站点创作者数量
 * @returns 用户总数
 */
export const getUserCount = async (): Promise<ApiResponse<{ total: number }>> => {
  return request.get('/users/count')
}
