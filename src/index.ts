import { afterAll, rs } from '@rstest/core'

declare global {
  var jest: typeof rs | undefined
}

global.jest = rs

const apis = [
  'Path2D',
  'CanvasGradient',
  'CanvasPattern',
  'CanvasRenderingContext2D',
  'DOMMatrix',
  'ImageData',
  'TextMetrics',
  'ImageBitmap',
  'createImageBitmap',
] as const

async function importMockWindow() {
  // @ts-expect-error
  const getCanvasWindow = await import('jest-canvas-mock/lib/window.js').then(res => res.default?.default || res.default || res)

  const canvasWindow = getCanvasWindow({ document: window.document })

  apis.forEach((api) => {
    global[api] = canvasWindow[api]
    global.window[api] = canvasWindow[api]
  })
}

importMockWindow()

afterAll(() => {
  delete global.jest
  delete global.window.jest
})
