/**
 * Toast 通知工具函数
 * 提供全局气泡通知功能
 */

import { ref, type ComponentPublicInstance } from 'vue'
import type ToastNotification from '../components/ToastNotification.vue'

type ToastType = 'info' | 'success' | 'warning' | 'error'

// 全局 toast 组件引用
let toastRef = ref<ComponentPublicInstance<typeof ToastNotification> | null>(null)

/**
 * 设置 toast 组件引用
 * @param ref toast 组件实例
 */
export function setToastRef(ref: ComponentPublicInstance<typeof ToastNotification>) {
  toastRef.value = ref
}

/**
 * 显示错误通知
 * @param message 错误消息
 * @param duration 持续时间（毫秒）
 */
export function showError(message: string, duration: number = 4000) {
  toastRef.value?.addToast(message, 'error', duration)
}

/**
 * 显示警告通知
 * @param message 警告消息
 * @param duration 持续时间（毫秒）
 */
export function showWarning(message: string, duration: number = 3500) {
  toastRef.value?.addToast(message, 'warning', duration)
}

/**
 * 显示成功通知
 * @param message 成功消息
 * @param duration 持续时间（毫秒）
 */
export function showSuccess(message: string, duration: number = 3000) {
  toastRef.value?.addToast(message, 'success', duration)
}

/**
 * 显示信息通知
 * @param message 信息消息
 * @param duration 持续时间（毫秒）
 */
export function showInfo(message: string, duration: number = 3000) {
  toastRef.value?.addToast(message, 'info', duration)
}

/**
 * 通用显示方法
 * @param message 消息内容
 * @param type 消息类型
 * @param duration 持续时间
 */
export function showToast(message: string, type: ToastType = 'info', duration: number = 3000) {
  toastRef.value?.addToast(message, type, duration)
}
