declare namespace Common {
  /**
   * 策略模式
   */
  interface StrategicPattern {
    condition: boolean
    callback: () => void
  }
}
