import { test, expect } from '@playwright/test'

test.describe('登录与跳转', () => {
  test('登录成功后跳转到 dashboard 并设置 token', async ({ page, context }) => {
    await page.goto('/#/login')

    await page.getByPlaceholder('请输入用户名').fill('admin')
    await page.getByPlaceholder('请输入密码').fill('123456')
    await page.getByRole('button', { name: '登录' }).click()

    await page.waitForURL('**/#/dashboard')

    await expect(page.getByRole('heading')).toContainText('你好, 这是一个测试')

    const cookies = await context.cookies()
    expect(cookies.some((c) => c.name === 'admin_token')).toBeTruthy()
  })
})
