import { useEffect, useRef } from "react"
import * as THREE from 'three'

/**
*/
const FishDemo = () => {

  const threeRef = useRef(null)


  useEffect(() => {
    if (!threeRef.current) return
    const size = { width: threeRef.current.clientWidth, height: threeRef.current.clientHeight }
    /* 基础场景 */
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x001e2f)

    const camera = new THREE.PerspectiveCamera(
      60,
      size.width / size.height,
      0.1,
      100
    )
    camera.position.set(0, 5, 12)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(size.width, size.height)
    threeRef.current.appendChild(renderer.domElement)

    /* 光照（像水下） */
    scene.add(new THREE.AmbientLight(0x88ccff, 0.6))

    const light = new THREE.DirectionalLight(0xffffff, 0.8)
    light.position.set(5, 10, 5)
    scene.add(light)

    /* 水面（半透明） */
    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({
        color: 0x003344,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      })
    )
    water.rotation.x = -Math.PI / 2
    scene.add(water)

    /* 金鱼（几何体拼装） */
    const fish = new THREE.Group()

    // 身体
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xff9933 })
    )
    body.scale.set(1.4, 1, 1)
    fish.add(body)

    // 尾巴
    const tail = new THREE.Mesh(
      new THREE.ConeGeometry(0.4, 1, 16),
      new THREE.MeshStandardMaterial({ color: 0xffcc66 })
    )
    tail.position.x = -1.2
    tail.rotation.z = Math.PI
    fish.add(tail)

    scene.add(fish)

    /* 游动逻辑 */
    let time = 0
    let prevPos = new THREE.Vector3()

    function animate() {
      requestAnimationFrame(animate)
      time += 0.015

      // 🐟 更自然的游动轨迹
      const x = Math.sin(time * 0.5) * 6
      const z = Math.cos(time * 0.3) * 5 + Math.sin(time * 0.8) * 2
      const y = Math.sin(time * 0.7) * 1.2 + 1.5

      fish.position.set(x, y, z)

      // 🧭 朝向前进方向（关键）
      const dir = fish.position.clone().sub(prevPos)
      if (dir.lengthSq() > 0.0001) {
        fish.lookAt(fish.position.clone().add(dir))
      }
      prevPos.copy(fish.position)

      // 🌀 尾巴摆动（游动感）
      tail.rotation.y = Math.sin(time * 10) * 0.6
      // 身体轻微摆动
      body.rotation.z = Math.sin(time * 5) * 0.1

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      renderer.dispose()
      threeRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div>
    <div>渲染范围</div>
    <div ref={threeRef} style={{ width: 1920, height: 1080 }}></div>
  </div>
}
export { FishDemo }
