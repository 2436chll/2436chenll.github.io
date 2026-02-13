import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const MoreFish = () => {
  const threeRef = useRef(null)

  useEffect(() => {
    if (!threeRef.current) return

    const width = threeRef.current.clientWidth
    const height = threeRef.current.clientHeight

    /* 创建鱼身纹理 */
    function createFishTexture(baseColor, spotColor) {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 256
      const ctx = canvas.getContext('2d')

      ctx.clearRect(0, 0, 512, 256)

      // 绘制鱼身体
      ctx.beginPath()
      ctx.ellipse(256, 128, 180, 80, 0, 0, Math.PI * 2)
      const gradient = ctx.createRadialGradient(256, 128, 20, 256, 128, 180)
      gradient.addColorStop(0, baseColor)
      gradient.addColorStop(1, '#ffcc66')
      ctx.fillStyle = gradient
      ctx.fill()

      // 绘制尾巴
      ctx.beginPath()
      ctx.moveTo(76, 128)
      ctx.lineTo(20, 80)
      ctx.lineTo(20, 176)
      ctx.closePath()
      ctx.fillStyle = baseColor
      ctx.fill()

      // 绘制鱼鳍（左）
      ctx.beginPath()
      ctx.moveTo(256, 48)
      ctx.quadraticCurveTo(280, 20, 320, 40)
      ctx.quadraticCurveTo(300, 60, 256, 48)
      ctx.fillStyle = spotColor
      ctx.globalAlpha = 0.7
      ctx.fill()
      ctx.globalAlpha = 1.0

      // 绘制鱼鳍（右）
      ctx.beginPath()
      ctx.moveTo(256, 208)
      ctx.quadraticCurveTo(280, 236, 320, 216)
      ctx.quadraticCurveTo(300, 196, 256, 208)
      ctx.fillStyle = spotColor
      ctx.globalAlpha = 0.7
      ctx.fill()
      ctx.globalAlpha = 1.0

      // 添加斑点
      for (let i = 0; i < 25; i++) {
        const x = 150 + Math.random() * 200
        const y = 80 + Math.random() * 96
        const radius = Math.random() * 10 + 5
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = spotColor
        ctx.globalAlpha = 0.3
        ctx.fill()
      }
      ctx.globalAlpha = 1.0

      // 眼睛（左）
      ctx.beginPath()
      ctx.arc(380, 110, 12, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(382, 110, 6, 0, Math.PI * 2)
      ctx.fillStyle = '#000000'
      ctx.fill()

      // 眼睛（右）
      ctx.beginPath()
      ctx.arc(380, 146, 12, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(382, 146, 6, 0, Math.PI * 2)
      ctx.fillStyle = '#000000'
      ctx.fill()

      // 嘴巴
      ctx.beginPath()
      ctx.ellipse(460, 128, 15, 8, 0, 0, Math.PI * 2)
      ctx.fillStyle = '#ff6666'
      ctx.fill()

      // 添加鳞片光泽
      ctx.globalAlpha = 0.15
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      for (let i = 0; i < 6; i++) {
        ctx.beginPath()
        ctx.arc(200 + i * 30, 128, 40, -Math.PI / 4, Math.PI / 4)
        ctx.stroke()
      }
      ctx.globalAlpha = 1.0

      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      return texture
    }

    // 预生成几种颜色的纹理
    const textures = [
      createFishTexture('#ff9933', '#ff6633'),
      createFishTexture('#ff6699', '#ff3366'),
      createFishTexture('#66ff99', '#33cc66'),
      createFishTexture('#ffcc33', '#ff9900'),
      createFishTexture('#6699ff', '#3366cc')
    ]

    /* 场景 */
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000a14)

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
    camera.position.set(0, 6, 14)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    threeRef.current.appendChild(renderer.domElement)

    /* 光照 */
    scene.add(new THREE.AmbientLight(0x66aadd, 0.7))
    const light = new THREE.DirectionalLight(0xaaddff, 1.0)
    light.position.set(5, 10, 5)
    scene.add(light)

    /* 上方光束（阳光穿透水面） */
    const sunLight = new THREE.SpotLight(0xffffee, 1.2)
    sunLight.position.set(0, 20, 0)
    sunLight.angle = Math.PI / 4
    sunLight.penumbra = 0.5
    scene.add(sunLight)

    /* 水面 */
    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({
        color: 0x006699,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide
      })
    )
    water.rotation.x = -Math.PI / 2
    water.position.y = 3
    scene.add(water)

    /* 水底 */
    const seabed = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({
        color: 0x002840,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
      })
    )
    seabed.rotation.x = Math.PI / 2
    seabed.position.y = -2
    scene.add(seabed)

    /* 水中粒子（模拟悬浮物） */
    const particleCount = 200
    const particleGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30
      positions[i + 1] = Math.random() * 6 - 1
      positions[i + 2] = (Math.random() - 0.5) * 30
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xaaddff,
      size: 0.06,
      transparent: true,
      opacity: 0.8
    })
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    /* 金鱼 */
    function createFish(textureIndex) {
      const g = new THREE.Group()

      const material = new THREE.MeshStandardMaterial({
        map: textures[textureIndex],
        transparent: true,
        roughness: 0.5,
        metalness: 0.15,
        side: THREE.DoubleSide
      })

      // 主体平面
      const body = new THREE.Mesh(new THREE.PlaneGeometry(2, 1), material)
      g.add(body)

      // 侧面（增加厚度感）
      const side1 = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.9), material)
      side1.rotation.y = Math.PI / 2
      side1.position.x = 0.05
      g.add(side1)

      const side2 = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.9), material)
      side2.rotation.y = -Math.PI / 2
      side2.position.x = -0.05
      g.add(side2)

      g.userData.body = body
      return g
    }

    /* 初始化鱼群 */
    const FISH_COUNT = 15
    const fishes = []

    for (let i = 0; i < FISH_COUNT; i++) {
      const fish = createFish(i % textures.length)
      fish.position.set(
        (Math.random() - 0.5) * 8,
        1 + Math.random() * 2,
        (Math.random() - 0.5) * 8
      )

      const angle = Math.random() * Math.PI * 2
      const baseSpeed = 0.008 + Math.random() * 0.008
      fishes.push({
        mesh: fish,
        velocity: new THREE.Vector3(
          Math.cos(angle),
          0,
          Math.sin(angle)
        ).multiplyScalar(baseSpeed),

        // 每条鱼的"长期方向偏好"
        heading: new THREE.Vector3(
          Math.cos(angle),
          0,
          Math.sin(angle)
        ).normalize(),

        // 连续噪声相位
        wanderPhase: Math.random() * Math.PI * 2,

        // 曲线转向半径（每条鱼不同）
        turnRadius: 0.008 + Math.random() * 0.006,

        // 转向方向（左转或右转）
        turnDirection: Math.random() > 0.5 ? 1 : -1,

        // 每条鱼不同的速度范围
        maxSpeed: baseSpeed + 0.01,
        minSpeed: baseSpeed * 0.5
      })

      scene.add(fish)
    }

    /* 参数 */
    const separationDist = 1
    const alignmentDist = 1.5 // ↓ 缩小作用范围
    const maxSpeed = 0.02
    const center = new THREE.Vector3(0, 1.5, 0)

    const Y_AXIS = new THREE.Vector3(0, 1, 0)
    const SAFE_RADIUS = 10
    const MAX_RADIUS = 12

    /* 动画 */
    let particleTime = 0
    const animate = () => {
      requestAnimationFrame(animate)

      // 粒子缓慢浮动
      particleTime += 0.001
      particles.rotation.y = particleTime * 0.5

      fishes.forEach((fish, i) => {
        const pos = fish.mesh.position
        const vel = fish.velocity

        const separation = new THREE.Vector3()
        const alignment = new THREE.Vector3()
        let alignCount = 0

        fishes.forEach((other, j) => {
          if (i === j) return

          const d = pos.distanceTo(other.mesh.position)

          if (d < separationDist) {
            separation.add(
              pos.clone().sub(other.mesh.position).normalize().divideScalar(d)
            )
          }

          if (d < alignmentDist) {
            alignment.add(other.velocity)
            alignCount++
          }
        })

        /* 1️⃣ 强分离（防聚团） */
        vel.add(separation.multiplyScalar(0.04))

        /* 2️⃣ 弱对齐（只是"参考"） */
        if (alignCount > 0) {
          alignment.divideScalar(alignCount)
          alignment.sub(vel)
          alignment.multiplyScalar(0.01)
          vel.add(alignment)
        }

        /* 3️⃣ 曲线转向（持续转向形成自然曲线） */
        fish.heading.applyAxisAngle(Y_AXIS, fish.turnRadius * fish.turnDirection)
        vel.add(fish.heading.clone().multiplyScalar(0.012))

        /* 4️⃣ 随机偶尔改变转向方向 */
        if (Math.random() < 0.005) {
          fish.turnDirection *= -1
        }

        /* 5️⃣ 自然游荡（增加垂直波动） */
        fish.wanderPhase += 0.04
        vel.add(
          new THREE.Vector3(
            Math.cos(fish.wanderPhase) * 0.3,
            Math.sin(fish.wanderPhase * 0.7) * 0.2,
            Math.sin(fish.wanderPhase) * 0.3
          ).multiplyScalar(0.004)
        )

        /* 5️⃣ 活动范围 */
        // const toCenter = center.clone().sub(pos)
        // if (toCenter.length() > 7) {
        //   vel.add(toCenter.normalize().multiplyScalar(0.003))
        // }

        const toCenter = center.clone().sub(pos)
        const dist = toCenter.length()

        if (dist > SAFE_RADIUS) {
          // 越界程度 0 ~ 1
          const t = Math.min((dist - SAFE_RADIUS) / (MAX_RADIUS - SAFE_RADIUS), 1)

          // 1️⃣ 强制调整 heading（这是关键）
          fish.heading.lerp(
            toCenter.normalize(),
            0.05 + t * 0.2 // 越远，转得越狠
          )

          // 2️⃣ 额外速度补偿（辅助）
          vel.add(
            toCenter.normalize().multiplyScalar(0.01 * t)
          )
        }

        vel.clampLength(fish.minSpeed, fish.maxSpeed)
        pos.add(vel)

        fish.mesh.lookAt(pos.clone().add(vel))
        // 身体轻微摆动
        fish.mesh.userData.body.rotation.z =
          Math.sin(Date.now() * 0.008 + i * 0.5) * 0.15
      })

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      renderer.dispose()
      threeRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div>
      <div>渲染范围</div>
      <div ref={threeRef} style={{ width: 1920, height: 1080 }} />
    </div>
  )
}
