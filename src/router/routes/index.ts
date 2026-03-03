/** 导入所有模块，并立即执行 */
const modules = import.meta.glob('./modules/*.ts', { eager: true })

/**
 * 将模块列表格式化，并添加到路由记录中
 * @param _modules - 导入的模块对象
 * @param result - 路由记录数组
 * @returns 返回格式化后的路由记录数组
 */
function formatModules(_modules: any, result: Route.RouteRecord[]) {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default
    if (!defaultModule) {return}
    const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule]
    result.push(...moduleList)
  })
  return result
}

/** 本地路由 */
export const appRoutes: Route.RouteRecord[] = formatModules(modules, [])
