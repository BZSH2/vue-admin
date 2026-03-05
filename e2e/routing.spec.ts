import { test, expect } from '@playwright/test'

test.describe('路由与导航', () => {
  test('侧边栏 levelHidden 展示子级为一级菜单', async ({ page }) => {
    await page.goto('/#/dashboard')
    await expect(page.getByText('首页')).toBeVisible()
    await expect(page.getByText('图标')).toBeVisible()
  })

  test('点击 图标 菜单进入 /icons', async ({ page }) => {
    await page.goto('/#/dashboard')
    await page.getByText('图标').click()
    await page.waitForURL('**/#/icons')
  })

  test('未匹配路径进入 404 页面', async ({ page }) => {
    await page.goto('/#/this-route-does-not-exist')
    await expect(page.getByText('404')).toBeVisible()
    await expect(page.getByText('页面未找到')).toBeVisible()
  })
})
