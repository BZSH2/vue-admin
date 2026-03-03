import {
  ElMessage,
  ElMessageBox,
  ElNotification,
  type MessageOptions,
  type Action,
} from 'element-plus'
import type { VNode, RendererNode, RendererElement } from 'vue'
// Element Plus 消息提示等组件样式需单独引入
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/notification/style/css'

export type StatusType = 'success' | 'warning' | 'info' | 'error'

export interface ConfirmProps {
  content: string
  title?: string
  type?: StatusType
  confirmButtonText?: string
  cancelButtonText?: string
  onOk?: () => void
  onCancel?: () => void
  onClose?: () => void
  [key: string]: any
}

export interface NotificationProps {
  [key: string]: any
}

/**
 * @description 全局Message
 * @param message 消息内容
 * @param type 消息类型
 * @param duration 显示时间
 * @param options 其他配置项
 */
export function $baseMessage(
  message: string,
  type: StatusType = 'success',
  duration: number = 3000,
  options?: MessageOptions
): void {
  ElMessage({
    message,
    type,
    duration,
    ...(options || {}),
  })
}

/**
 * @description 全局Confirm
 * @param  params 入参
 * @param  params.content 消息正文内容
 * @param  params.title 标题
 * @param  params.type 类型
 * @param  params.onOk 确认回调
 * @param  params.onClose 关闭或取消回调
 * @param  params.onCancel 关闭或取消回调
 * @param  params.confirmButtonText 确定按钮的文本内容
 * @param  params.cancelButtonText 取消按钮的文本内容
 */
export function $baseConfirm({
  content,
  title = '提示',
  onOk,
  onCancel,
  onClose,
  confirmButtonText = '确定',
  cancelButtonText = '取消',
  type = 'warning',
  ...args
}: ConfirmProps): void {
  ElMessageBox.confirm(content, title, {
    confirmButtonText,
    cancelButtonText,
    type,
    draggable: true,
    closeOnClickModal: false,
    ...args,
  })
    .then(() => {
      if (onOk) {onOk()}
    })
    .catch((action: Action) => {
      if (action === 'cancel') {
        if (onCancel) {onCancel()}
      } else {
        if (onClose) {onClose()}
      }
    })
}

export interface NotificationOptions extends NotificationProps {
  type?: StatusType
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  duration?: number
  dangerouslyUseHTMLString?: boolean
}

/**
 * @description 全局Notification
 * @param message 说明文字
 * @param title 标题
 * @param options 其他配置项
 */
export function $baseNotify(
  message: string | VNode<RendererNode, RendererElement>,
  title: string,
  options?: NotificationOptions
): void {
  const {
    type = 'info',
    position = 'top-right',
    duration = 4500,
    dangerouslyUseHTMLString = false,
    ...rest
  } = options || {}

  ElNotification({
    title,
    message,
    type,
    position,
    duration,
    dangerouslyUseHTMLString,
    ...rest,
  })
}

/**
 * @description 异步Confirm
 * @param  props 入参
 * @returns Promise<boolean>
 */
export function $asyncBaseConfirm(props: ConfirmProps): Promise<boolean> {
  const {
    content,
    title = '提示',
    confirmButtonText = '确定',
    cancelButtonText = '取消',
    type = 'warning',
    ...args
  } = props

  return ElMessageBox.confirm(content, title, {
    confirmButtonText,
    cancelButtonText,
    type,
    draggable: true,
    closeOnClickModal: false,
    ...args,
  })
    .then(() => true)
    .catch(() => false)
}

/**
 * 组合式函数入口 (可选)
 * 如果你喜欢用 useMessage() 的方式调用，也可以保留这个导出
 */
export const useMessage = () => ({
    $baseMessage,
    $baseConfirm,
    $baseNotify,
    $asyncBaseConfirm,
  })
