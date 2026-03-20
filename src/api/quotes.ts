import request from '../utils/request'
import type { ApiResponse } from '../types'

/**
 * 名言API接口
 * 前端调用后端API获取语录
 * 后端已处理敏感词校验
 */

/**
 * 名言数据类型
 */
export interface Quote {
  id: number
  text: string
  textEn: string
  author: string
  authorEn: string
  category: string
}

/**
 * 获取随机名言
 * 后端会自动进行敏感词校验
 * @returns 随机名言数据
 */
export const getRandomQuote = async (): Promise<ApiResponse<Quote>> => {
  return request.get('/quotes/random')
}

/**
 * 获取多条名言
 * @param limit 数量限制，默认5条
 * @returns 名言列表
 */
export const getQuotes = async (limit: number = 5): Promise<ApiResponse<Quote[]>> => {
  return request.get('/quotes', { params: { limit } })
}

/**
 * 本地备用语录数据
 * 当后端API不可用时使用
 */
export const LOCAL_QUOTES: Quote[] = [
  {
    id: 1,
    text: '生活不是等待风暴过去，而是学会在雨中翩翩起舞。',
    textEn: 'Life is not about waiting for the storm to pass, but learning to dance in the rain.',
    author: '维维安·格林',
    authorEn: 'Vivian Greene',
    category: '生活'
  },
  {
    id: 2,
    text: '未经审视的人生不值得过。',
    textEn: 'The unexamined life is not worth living.',
    author: '苏格拉底',
    authorEn: 'Socrates',
    category: '哲学'
  },
  {
    id: 3,
    text: '世界上只有一种真正的英雄主义，那就是认清生活的真相后依然热爱生活。',
    textEn: 'There is only one heroism in the world: to see the world as it is and to love it.',
    author: '罗曼·罗兰',
    authorEn: 'Romain Rolland',
    category: '生活'
  },
  {
    id: 4,
    text: '你若盛开，清风自来。',
    textEn: 'If you bloom, the breeze will come naturally.',
    author: '三毛',
    authorEn: 'Sanmao',
    category: '成长'
  },
  {
    id: 5,
    text: '星光不问赶路人，时光不负有心人。',
    textEn: 'The stars do not ask the traveler, time does not fail the dedicated.',
    author: '大冰',
    authorEn: 'Da Bing',
    category: '奋斗'
  },
  {
    id: 6,
    text: '愿你出走半生，归来仍是少年。',
    textEn: 'May you return as a teenager after half a lifetime of wandering.',
    author: '孙光曼',
    authorEn: 'Sun Guangman',
    category: '初心'
  },
  {
    id: 7,
    text: '山重水复疑无路，柳暗花明又一村。',
    textEn: 'After endless mountains and rivers, there seems no way out; willows dark, flowers bright, another village appears.',
    author: '陆游',
    authorEn: 'Lu You',
    category: '希望'
  },
  {
    id: 8,
    text: '人生如逆旅，我亦是行人。',
    textEn: 'Life is like a journey against the current, and I am also a traveler.',
    author: '苏轼',
    authorEn: 'Su Shi',
    category: '人生'
  },
  {
    id: 9,
    text: '路漫漫其修远兮，吾将上下而求索。',
    textEn: 'The road is long and winding, I will seek high and low.',
    author: '屈原',
    authorEn: 'Qu Yuan',
    category: '追求'
  },
  {
    id: 10,
    text: '天行健，君子以自强不息。',
    textEn: 'As heaven maintains vigor through movement, a gentleman should constantly strive for self-improvement.',
    author: '《周易》',
    authorEn: 'Zhou Yi',
    category: '励志'
  }
]
