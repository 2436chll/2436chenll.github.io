import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const Demo = () => {

  const threeRef = useRef()

  useEffect(() => {
    if (!threeRef.current) return
    const size = { width: threeRef.current.clientWidth, height: threeRef.current.clientHeight }

    /**
     * 场景 Scene
     */
    const scene = new THREE.Scene()

    /**
     * 相机 Camera
     */
    const camera = new THREE.PerspectiveCamera(
      75,                              // 视角（FOV）
      size.width / size.height,
      0.1,                             // 近裁剪面
      1000                             // 远裁剪面
    )

    // 相机往后挪一点
    camera.position.z = 5

    /**
     * 渲染器 Renderer
     */
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(size.width, size.height)

    // 把 canvas 插入页面
    threeRef.current.appendChild(renderer.domElement)

    /**
     * 坐标轴 Helper（关键）
     * 红 X / 绿 Y / 蓝 Z
     */
    const axesHelper = new THREE.AxesHelper(3)
    scene.add(axesHelper)

    /**
     * 几何体 Geometry，决定形状
     */
    const geometry = new THREE.BoxGeometry(1, 1, 1)

    /**
     * 材质 Material
     */
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00
    })

    /**
     * 网格 Mesh，几何体 + 材质 = 可渲染物体
     */
    const cube = new THREE.Mesh(geometry, material)

    const cubeAxes = new THREE.AxesHelper(1.5)
    cube.add(cubeAxes)

    // 把物体加入场景
    scene.add(cube)
    demoAnimate()

    /**
     * 环境光（基础亮度）
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    /**
     * 平行光（主光源）
     */
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    // directionalLight.position.set(-5, 3, 2)

    // directionalLight.position.set(-5, -5, 5)
    scene.add(directionalLight)

    /**
     * 光源 Helper（关键）
     */
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      1
    )
    scene.add(directionalLightHelper)

    /**
     * 渲染循环
     */
    function demoAnimate() {
      // 浏览器每一帧都会调用
      requestAnimationFrame(demoAnimate)

      // 修改物体属性 = 动画
      cube.rotation.x += 0.01

      cube.rotation.z += 0.01

      // 真正画出来的地方
      renderer.render(scene, camera)
    }

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