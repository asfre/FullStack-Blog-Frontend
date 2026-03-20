<template>
  <!-- 嵌套回复组件 - 用于显示展开的二级及以上回复 -->
  <div class="nested-replies-list">
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="nested-reply-item"
    >
      <div class="reply-line"></div>
      <div class="reply-body">
        <!-- 回复内容行 -->
        <div class="reply-content-line">
          <span class="reply-username">{{ comment.user.username }}</span>
          <template v-if="shouldShowReplyTarget(comment)">
            <span class="reply-text">回复</span>
            <span class="reply-target">{{ getReplyTargetName(comment) }}</span>
          </template>
          <span class="reply-colon">:</span>
          <span class="reply-content-text">{{ comment.content }}</span>
          <span v-if="comment.status === 'pending'" class="pending-dot" title="待审核"></span>
        </div>

        <!-- 回复操作栏 -->
        <div class="reply-actions-bar">
          <span class="reply-time">{{ formatDate(comment.createdAt) }}</span>
          <span class="reply-action-btn" v-if="isLoggedIn" @click="onReplyClick(comment)">回复</span>
          <span class="reply-action-btn approve-btn" v-if="canModerateComment(comment)" @click="onApproveClick(comment)">通过审核</span>
          <span class="reply-action-btn" v-if="canDeleteComment(comment)" @click="onDeleteClick(comment)">删除</span>
        </div>

        <!-- 回复表单 -->
        <div v-if="isReplying(comment)" class="nested-reply-form">
          <div class="relative">
            <textarea
              v-model="replyContent"
              :placeholder="`回复 ${comment.user.username}...`"
              class="reply-input"
              maxlength="500"
            ></textarea>
            <div class="char-count">{{ replyContent.length }}/500</div>
          </div>
          <div class="reply-actions">
            <button class="btn-cancel" @click="onCancelReply">取消</button>
            <button class="btn-submit" @click="onSubmitReply(comment)" :disabled="!replyContent.trim() || replyContent.length > 500">发送</button>
          </div>
        </div>

        <!-- 继续递归显示更深层的回复 -->
        <div v-if="comment.children && comment.children.length > 0" class="deeper-replies">
          <NestedReplies
            :comments="comment.children"
            :parent-user-name="comment.user.username"
            :post-id="postId"
            :replying-to="replyingTo"
            @reply="onChildReply"
            @delete="onChildDelete"
            @submit-reply="onChildSubmitReply"
            @cancel-reply="onChildCancelReply"
            @approve="onChildApprove"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 嵌套回复组件
 * 用于显示展开的二级及以上回复，支持无限层级递归
 */
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import type { Comment } from '../types'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)

const props = defineProps<{
  comments: Comment[]
  parentUserName?: string
  postId?: number
  replyingTo?: number | null
}>()

const emit = defineEmits<{
  (e: 'reply', comment: Comment): void
  (e: 'delete', comment: Comment): void
  (e: 'submit-reply', comment: Comment, content: string): void
  (e: 'cancel-reply'): void
  (e: 'approve', comment: Comment): void
}>()

const replyContent = ref('')
const currentReplyingId = ref<number | null>(null)

const isReplying = (comment: Comment): boolean => {
  return currentReplyingId.value === comment.id || props.replyingTo === comment.id
}

/**
 * 判断是否显示回复目标
 * 当回复自己时不显示
 */
const shouldShowReplyTarget = (comment: Comment): boolean => {
  const targetName = getReplyTargetName(comment)
  return !!targetName && targetName !== comment.user.username
}

/**
 * 获取回复目标的用户名
 */
const getReplyTargetName = (comment: Comment): string => {
  if (comment.parent?.user?.username) {
    return comment.parent.user.username
  }
  return props.parentUserName || ''
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}

const canDeleteComment = (comment: Comment): boolean => {
  return userStore.currentUser?.role === 'admin' || userStore.currentUser?.id === comment.userId
}

const canModerateComment = (comment: Comment): boolean => {
  return userStore.currentUser?.role === 'admin' && comment.status === 'pending'
}

const onReplyClick = (comment: Comment) => {
  currentReplyingId.value = comment.id
  replyContent.value = ''
  emit('reply', comment)
}

const onDeleteClick = (comment: Comment) => {
  emit('delete', comment)
}

const onApproveClick = (comment: Comment) => {
  emit('approve', comment)
}

const onCancelReply = () => {
  currentReplyingId.value = null
  replyContent.value = ''
  emit('cancel-reply')
}

const onSubmitReply = (comment: Comment) => {
  if (!replyContent.value.trim()) return
  emit('submit-reply', comment, replyContent.value)
  replyContent.value = ''
  currentReplyingId.value = null
}

const onChildReply = (comment: Comment) => {
  currentReplyingId.value = comment.id
  emit('reply', comment)
}

const onChildDelete = (comment: Comment) => {
  emit('delete', comment)
}

const onChildSubmitReply = (comment: Comment, content: string) => {
  emit('submit-reply', comment, content)
  currentReplyingId.value = null
}

const onChildCancelReply = () => {
  currentReplyingId.value = null
  emit('cancel-reply')
}

const onChildApprove = (comment: Comment) => {
  emit('approve', comment)
}
</script>

<style scoped>
.nested-replies-list {
  display: flex;
  flex-direction: column;
}

.nested-reply-item {
  display: flex;
  gap: 8px;
  padding: 6px 0;
}

.reply-line {
  width: 2px;
  background: #e0e0e0;
  border-radius: 1px;
  margin-left: 19px;
  flex-shrink: 0;
  min-height: 20px;
}

.reply-body {
  flex: 1;
  min-width: 0;
}

.reply-content-line {
  font-size: 14px;
  line-height: 1.5;
  color: #161823;
  word-break: break-word;
}

.reply-username {
  color: #576b95;
  font-weight: 600;
  cursor: pointer;
}

.reply-text {
  color: #999;
  margin: 0 4px;
}

.reply-target {
  color: #576b95;
  font-weight: 600;
  cursor: pointer;
}

.reply-colon {
  margin-right: 4px;
}

.reply-content-text {
  color: #161823;
}

.pending-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #ff6b6b;
  border-radius: 50%;
  margin-left: 6px;
  vertical-align: middle;
}

.reply-actions-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.reply-time {
  font-size: 12px;
  color: #999;
}

.reply-action-btn {
  font-size: 12px;
  color: #576b95;
  cursor: pointer;
  font-weight: 500;
}

.reply-action-btn:hover {
  opacity: 0.8;
}

.approve-btn {
  color: #67c23a;
}

.approve-btn:hover {
  color: #85ce61;
}

.deeper-replies {
  margin-top: 4px;
}

.nested-reply-form {
  margin-top: 8px;
  background: #f7f8fa;
  padding: 10px;
  border-radius: 8px;
}

.reply-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  resize: none;
  min-height: 60px;
  background: #fff;
}

.reply-input:focus {
  outline: none;
  border-color: #576b95;
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.btn-cancel, .btn-submit {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  border: none;
}

.btn-cancel {
  background: #e0e0e0;
  color: #666;
}

.btn-submit {
  background: #576b95;
  color: #fff;
}

.btn-submit:hover {
  background: #4a5d85;
}

.btn-submit:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

.relative {
  position: relative;
}

.char-count {
  position: absolute;
  bottom: 8px;
  right: 10px;
  font-size: 12px;
  color: #999;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
