/**
 * 封装 localStorage 和 sessionStorage
 * 提供类型安全的存储操作，支持 JSON 自动序列化/反序列化
 */
class Storage {
  /**
   * 设置存储
   * @param key 键名
   * @param value 值（对象会自动转 JSON）
   * @param type 存储类型，默认 'local'
   */
  static set(key: Storage.StorageKey, value: any, type: Storage.StorageType = 'local') {
    const storage = type === 'local' ? localStorage : sessionStorage
    const data = JSON.stringify(value)
    storage.setItem(key, data)
  }

  /**
   * 获取存储
   * @param key 键名
   * @param type 存储类型，默认 'local'
   * @returns 解析后的数据，如果解析失败或不存在则返回 null
   */
  static get<T = any>(key: Storage.StorageKey, type: Storage.StorageType = 'local'): T | null {
    const storage = type === 'local' ? localStorage : sessionStorage
    const value = storage.getItem(key)
    if (value) {
      try {
        return JSON.parse(value)
      } catch (error) {
        console.warn(`[Storage] JSON parse error for key "${key}":`, error)
        return null
      }
    }
    return null
  }

  /**
   * 移除存储
   * @param key 键名
   * @param type 存储类型，默认 'local'
   */
  static remove(key: Storage.StorageKey, type: Storage.StorageType = 'local') {
    const storage = type === 'local' ? localStorage : sessionStorage
    storage.removeItem(key)
  }

  /**
   * 清空所有存储
   * @param type 存储类型，默认 'local'
   */
  static clear(type: Storage.StorageType = 'local') {
    const storage = type === 'local' ? localStorage : sessionStorage
    storage.clear()
  }
}

/**
 * 导出简化的操作函数
 */
export const setStorage = Storage.set
export const getStorage = Storage.get
export const removeStorage = Storage.remove
export const clearStorage = Storage.clear

export default Storage
