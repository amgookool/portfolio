// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('resolveCssColor', () => {
  let origCreateElement: typeof document.createElement

  beforeEach(() => {
    origCreateElement = document.createElement.bind(document)

    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: () => ' #0ea5e9 ',
    } as unknown as CSSStyleDeclaration)

    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag !== 'canvas') return origCreateElement(tag)
      return {
        width: 0,
        height: 0,
        getContext: () => ({
          fillStyle: '',
          fillRect: vi.fn(),
          getImageData: vi.fn().mockReturnValue({ data: [14, 165, 233, 255] }),
        }),
      } as unknown as HTMLCanvasElement
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a normalized [r, g, b] tuple', async () => {
    const { resolveCssColor } = await import('./theme')
    const result = resolveCssColor('--lagoon')
    expect(result).toHaveLength(3)
    expect(result[0]).toBeCloseTo(14 / 255, 3)
    expect(result[1]).toBeCloseTo(165 / 255, 3)
    expect(result[2]).toBeCloseTo(233 / 255, 3)
  })

  it('each channel is in [0, 1]', async () => {
    const { resolveCssColor } = await import('./theme')
    const [r, g, b] = resolveCssColor('--lagoon')
    expect(r).toBeGreaterThanOrEqual(0)
    expect(r).toBeLessThanOrEqual(1)
    expect(g).toBeGreaterThanOrEqual(0)
    expect(g).toBeLessThanOrEqual(1)
    expect(b).toBeGreaterThanOrEqual(0)
    expect(b).toBeLessThanOrEqual(1)
  })
})
