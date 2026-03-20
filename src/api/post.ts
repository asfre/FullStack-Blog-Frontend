import request from '../utils/request'
import type { ApiResponse, Post, PostListResponse, PaginationParams, CreatePostParams, UpdatePostParams, Comment } from '../types'

/**
 * 文章API接口
 */
export const postApi = {
  /**
   * 分页获取文章列表
   * 支持按分类、标签筛选
   * @param params 分页参数
   * @returns 文章列表和分页信息
   */
  getPosts: async (params: PaginationParams): Promise<ApiResponse<PostListResponse>> => {
    return request.get('/posts', { params })
  },

  /**
   * 获取文章详情
   * @param slug 文章slug
   * @returns 文章详情
   */// 获取文章详情
  getPostBySlug: async (slug: string): Promise<ApiResponse<Post>> => {
    return request.get(`/posts/${slug}`)
  },
  
  // 获取文章评论
  getComments: async (postId: number): Promise<ApiResponse<Comment[]>> => {
    return request.get(`/posts/${postId}/comments`)
  },
  
  // 创建评论
  createComment: async (data: { postId: number; content: string; parentId?: number }): Promise<ApiResponse<Comment>> => {
    return request.post('/comments', data)
  },

  // 删除评论
  deleteComment: async (commentId: number): Promise<ApiResponse<null>> => {
    return request.delete(`/comments/${commentId}`)
  },

  // 审核评论
  moderateComment: async (commentId: number, status: 'approved' | 'rejected'): Promise<ApiResponse<Comment>> => {
    return request.put(`/comments/${commentId}/moderate`, { status })
  },

  // 一键通过所有待审核评论
  approveAllComments: async (): Promise<ApiResponse<{ updatedCount: number }>> => {
    return request.put('/comments/approve-all', {})
  },

  /**
   * 创建文章
   * @param data 文章数据
   * @returns 创建的文章
   */
  createPost: async (data: CreatePostParams): Promise<ApiResponse<Post>> => {
    return request.post('/posts', data)
  },

  /**
   * 更新文章
   * @param data 文章数据
   * @returns 更新后的文章
   */
  updatePost: async (data: UpdatePostParams): Promise<ApiResponse<Post>> => {
    return request.put(`/posts/${data.id}`, data)
  },

  /**
   * 删除文章
   * @param id 文章ID
   * @returns 删除结果
   */
  deletePost: async (id: number): Promise<ApiResponse<null>> => {
    return request.delete(`/posts/${id}`)
  },

  /**
   * 获取所有分类
   * @returns 分类列表
   */
  getCategories: async (): Promise<ApiResponse<Array<{ id: number; name: string; slug: string; count: number }>>> => {
    return request.get('/categories')
  },

  /**
   * 获取所有标签
   * @returns 标签列表
   */
  getTags: async (): Promise<ApiResponse<Array<{ id: number; name: string; slug: string }>>> => {
    return request.get('/tags')
  }
}