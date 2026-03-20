/**
 * 安全工具类
 * 前端安全校验和XSS防护
 */

// 敏感词列表（与后端保持一致）
const SENSITIVE_WORDS = [
  '反动', '暴乱', '恐怖主义', '分裂', '独裁',
  '色情', '淫秽', '嫖娼', '卖淫', '强奸',
  '杀人', '放火', '爆炸', '枪击', '炸弹',
  '诈骗', '传销', '洗钱', '赌博', '毒品',
  '加微信', '加QQ', '联系方式', '点击查看', '免费领'
];

/**
 * 检查是否包含敏感词
 * @param content 原始内容
 * @returns 是否包含敏感词
 */
export function containsSensitiveWords(content: string): boolean {
  if (!content || typeof content !== 'string') {
    return false;
  }

  return SENSITIVE_WORDS.some(word => {
    const regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    return regex.test(content);
  });
}

/**
 * 获取内容中的敏感词列表
 * @param content 原始内容
 * @returns 敏感词数组
 */
export function getSensitiveWords(content: string): string[] {
  if (!content || typeof content !== 'string') {
    return [];
  }

  const found: string[] = [];
  SENSITIVE_WORDS.forEach(word => {
    const regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    if (regex.test(content) && !found.includes(word)) {
      found.push(word);
    }
  });

  return found;
}

/**
 * 验证评论内容
 * @param content 评论内容
 * @returns 验证结果
 */
export function validateComment(content: string): { valid: boolean; message?: string } {
  if (!content || typeof content !== 'string') {
    return { valid: false, message: '评论内容不能为空' };
  }

  const trimmed = content.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, message: '评论内容不能为空' };
  }

  if (trimmed.length > 500) {
    return { valid: false, message: '评论内容不能超过500个字符' };
  }

  // 检查是否包含敏感词
  const sensitiveWords = getSensitiveWords(trimmed);
  if (sensitiveWords.length > 0) {
    return { 
      valid: false, 
      message: `评论包含敏感词：${sensitiveWords.join('、')}，请修改后重试` 
    };
  }

  return { valid: true };
}

/**
 * 检测潜在的XSS攻击
 * @param content 原始内容
 * @returns 是否包含潜在的XSS代码
 */
export function detectXSS(content: string): boolean {
  if (!content || typeof content !== 'string') {
    return false;
  }

  // XSS攻击模式
  const xssPatterns = [
    /<script[^>]*>[\s\S]*?<\/script>/i,
    /<iframe[^>]*>[\s\S]*?<\/iframe>/i,
    /<object[^>]*>[\s\S]*?<\/object>/i,
    /<embed[^>]*>/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<[^>]+\s+on\w+\s*=/i,
    /data:text\/html/i,
    /<svg[^>]*>[\s\S]*?<\/svg>/i,
    /<math[^>]*>[\s\S]*?<\/math>/i,
    /expression\s*\(/i,
    /url\s*\(\s*['"]*javascript:/i
  ];

  return xssPatterns.some(pattern => pattern.test(content));
}

/**
 * 清理HTML标签
 * @param content 原始内容
 * @returns 清理后的纯文本
 */
export function stripHtml(content: string): string {
  if (!content || typeof content !== 'string') {
    return content;
  }

  return content.replace(/<[^>]*>/g, '');
}

/**
 * 输入净化 - 用于实时显示和提交前处理
 * @param content 原始内容
 * @returns 净化后的内容
 */
export function sanitizeInput(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // 移除HTML标签
  return stripHtml(content);
}
