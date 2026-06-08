export function resolveCssColor(cssVarName: string): [number, number, number] {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVarName)
    .trim()
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = raw
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return [r / 255, g / 255, b / 255]
}
