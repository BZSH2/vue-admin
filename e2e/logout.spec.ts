import { test, expect } from '@playwright/test'

test.describe('退出登录', () => {
  test('头像下拉退出回到登录页', async ({ page }) => {
    await page.goto('/#/dashboard')
    // 打开头像下拉（头像显示字母 U）
    await page.getByText('U').click()
    await page.getByRole('menuitem', { name: '退出登录' }).click()
    await page.waitForURL('**/#/login')
    await expect(page.getByRole('button', { name: '登录' })).toBeVisible()
  })
})
