import { Demo, FishDemo, MoreFish, Girl } from 'src/modules'
import s from './page.module.scss'
import { useState } from 'react'

/** 页面入口 */
export function Page() {

  const [demoIndex, setDemoIndex] = useState(0)

  const demos = [
    {name: 'Demo', component: <Demo/>, desc:'一个正方体块在循环旋转'},
    {name: 'FilshDemo', component: <FishDemo/>, desc:'金鱼在游'},
    {name: 'MoreFish', component: <MoreFish/>, desc:'很多金鱼在游'},
    {name: 'girl', component: <Girl/>, desc:'小女孩'},
  ]

  return (
    <div className={s.root}>
      <div>{demos[demoIndex]?.desc}</div>
      {
        demos.map((item,index) =><button key={item.name} onClick={() => setDemoIndex(index)}>{item.name}</button>)
      }
      {demos[demoIndex]?.component}
    </div>
  )
}