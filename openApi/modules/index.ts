let modules: any[] = []

const globFn = (import.meta as any).glob
if (typeof globFn === 'function') {
  const matched = globFn('./generated/*.ts', { eager: true }) as Record<string, any>
  modules = Object.entries(matched)
    .filter(([k]) => !k.endsWith('index.ts'))
    .map(([, m]) => m?.default)
    .filter(Boolean)
} else {
  const fs = await import('fs')
  const path = await import('path')
  const url = await import('url')
  const __filename = url.fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const generatedDir = path.join(__dirname, 'generated')
  if (fs.existsSync(generatedDir)) {
    const files = fs.readdirSync(generatedDir).filter((f: string) => f.endsWith('.ts'))
    for (const f of files) {
      if (f === 'index.ts') {continue}
      const full = path.join(generatedDir, f)
      const mod = await import(url.pathToFileURL(full).href)
      if (mod?.default) {modules.push(mod.default)}
    }
  }
}

console.log('modules', modules)

export default modules
