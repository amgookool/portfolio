import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { resolveCssColor } from '#/utils/theme'

const COUNT = 180
const CONNECT_DIST = 1.1
const CONNECT_DIST_SQ = CONNECT_DIST * CONNECT_DIST
const MAX_SEGS = 1200

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const W = container.clientWidth
    const H = container.clientHeight

    const [TR, TG, TB] = resolveCssColor('--lagoon')

    // ── renderer ───────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // ── scene / camera ─────────────────────────────────────────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100)
    camera.position.z = 5

    // ── particle positions & velocities ────────────────────────
    const pos = new Float32Array(COUNT * 3)
    const vel = new Float32Array(COUNT * 2) // only XY drift

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.2
      vel[i * 2] = (Math.random() - 0.5) * 0.0028
      vel[i * 2 + 1] = (Math.random() - 0.5) * 0.0016
    }

    const ptGeo = new THREE.BufferGeometry()
    const ptAttr = new THREE.BufferAttribute(pos, 3)
    ptGeo.setAttribute('position', ptAttr)

    const ptMat = new THREE.PointsMaterial({
      size: 0.045,
      color: new THREE.Color(TR, TG, TB),
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
    scene.add(new THREE.Points(ptGeo, ptMat))

    // ── connection lines ───────────────────────────────────────
    const linePosArr = new Float32Array(MAX_SEGS * 6)
    const lineColArr = new Float32Array(MAX_SEGS * 6)

    const lineGeo = new THREE.BufferGeometry()
    const linePosAttr = new THREE.BufferAttribute(linePosArr, 3)
    const lineColAttr = new THREE.BufferAttribute(lineColArr, 3)
    linePosAttr.setUsage(THREE.DynamicDrawUsage)
    lineColAttr.setUsage(THREE.DynamicDrawUsage)
    lineGeo.setAttribute('position', linePosAttr)
    lineGeo.setAttribute('color', lineColAttr)

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    scene.add(new THREE.LineSegments(lineGeo, lineMat))

    // ── mouse parallax ─────────────────────────────────────────
    let targetX = 0
    let targetY = 0
    const onMouse = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 1.4
      targetY = -(e.clientY / window.innerHeight - 0.5) * 0.9
    }
    window.addEventListener('mousemove', onMouse)

    // ── resize ─────────────────────────────────────────────────
    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // ── animation ──────────────────────────────────────────────
    let raf = 0

    const tick = () => {
      raf = requestAnimationFrame(tick)

      // drift particles
      for (let i = 0; i < COUNT; i++) {
        const b = i * 3
        pos[b] += vel[i * 2]
        pos[b + 1] += vel[i * 2 + 1]
        if (pos[b] > 5) pos[b] = -5
        else if (pos[b] < -5) pos[b] = 5
        if (pos[b + 1] > 3) pos[b + 1] = -3
        else if (pos[b + 1] < -3) pos[b + 1] = 3
      }
      ptAttr.needsUpdate = true

      // connection lines
      let seg = 0
      for (let i = 0; i < COUNT && seg < MAX_SEGS; i++) {
        const ax = pos[i * 3], ay = pos[i * 3 + 1], az = pos[i * 3 + 2]
        for (let j = i + 1; j < COUNT && seg < MAX_SEGS; j++) {
          const bx = pos[j * 3], by = pos[j * 3 + 1], bz = pos[j * 3 + 2]
          const dsq = (ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2
          if (dsq < CONNECT_DIST_SQ) {
            const alpha = (1 - Math.sqrt(dsq) / CONNECT_DIST) * 0.55
            const s = seg * 6
            linePosArr[s] = ax; linePosArr[s + 1] = ay; linePosArr[s + 2] = az
            linePosArr[s + 3] = bx; linePosArr[s + 4] = by; linePosArr[s + 5] = bz
            lineColArr[s] = TR * alpha; lineColArr[s + 1] = TG * alpha; lineColArr[s + 2] = TB * alpha
            lineColArr[s + 3] = TR * alpha; lineColArr[s + 4] = TG * alpha; lineColArr[s + 5] = TB * alpha
            seg++
          }
        }
      }
      lineGeo.setDrawRange(0, seg * 2)
      linePosAttr.needsUpdate = true
      lineColAttr.needsUpdate = true

      // smooth camera parallax
      camera.position.x += (targetX - camera.position.x) * 0.05
      camera.position.y += (targetY - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      ptGeo.dispose()
      ptMat.dispose()
      lineGeo.dispose()
      lineMat.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
