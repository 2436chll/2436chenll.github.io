import { useEffect, useRef } from "react"
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const Girl = () => {
  const threeRef = useRef(null)

  useEffect(() => {
    if (!threeRef.current) return

    const size = { width: threeRef.current.clientWidth, height: threeRef.current.clientHeight }

    /* 基础场景 */
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)

    const camera = new THREE.PerspectiveCamera(
      60,
      size.width / size.height,
      0.1,
      1000
    )
    camera.position.set(0, 2, 5)
    camera.lookAt(0, 1, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(size.width, size.height)
    renderer.setPixelRatio(window.devicePixelRatio)
    threeRef.current.appendChild(renderer.domElement)

    /* 轨道控制器（支持手势拖拽） */
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = true
    controls.minDistance = 30
    controls.maxDistance = 300

    /* 光照 */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 5)
    scene.add(directionalLight)

    /* 加载 GLB 模型 */
    const loader = new GLTFLoader()
    let model = null
    let autoRotate = true

    loader.load(
      '/models/matilda.glb',
      (gltf) => {
        model = gltf.scene

        // 调整模型位置和大小
        model.position.set(0, 0, 0)
        model.scale.set(1, 1, 1)

        scene.add(model)

        // 自动调整相机位置以适应模型
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        const maxDim = Math.max(size.x, size.y, size.z)
        const fov = camera.fov * (Math.PI / 180)
        let cameraZ = Math.abs(maxDim / 2 * Math.tan(fov * 2))

        cameraZ *= 2.5
        camera.position.set(cameraZ * 0.5, cameraZ * 0.3, cameraZ)
        camera.lookAt(center)

        controls.target.copy(center)
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded')
      },
      (error) => {
        console.error('加载模型失败:', error)
      }
    )

    /* 动画 */
    function animate() {
      requestAnimationFrame(animate)

      // 用户交互时停止自动旋转
      if (autoRotate && model) {
        model.rotation.y += 0.005
      }

      controls.update()
      renderer.render(scene, camera)
    }

    /* 监听用户交互 */
    controls.addEventListener('start', () => {
      autoRotate = false
    })

    animate()

    /* 清理 */
    return () => {
      controls.dispose()
      renderer.dispose()
      threeRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div>
      <div>模型展示（可拖拽旋转、缩放）</div>
      <div ref={threeRef} style={{ width: '100%', height: '1000px', background: '#f0f0f0' }}></div>
    </div>
  )
}

export { Girl }
