/* 自动/手动维护：本地 Demo 演示清单。
   file 指向 demos/ 下的独立 HTML 文件，点击会经 demo.html 查看器打开。
   想新增 Demo：复制一条，把 file/title/desc/accent/tags 改掉即可。 */
window.DEMOS = [
  {
    id: 'forest-hunter-3d',
    file: 'demos/林间猎手 3D.html',
    title: '林间猎手 3D',
    desc: '第一人称 3D 狩猎射击：猎枪 / 弓箭 / 陷阱三种武器，五个昼夜关卡，雷达定位、开镜瞄准与连击计分，支持键鼠与触屏陀螺仪。',
    category: '3D 游戏',
    accent: ['#5a9a45', '#ffc83d'],
    tags: ['Three.js', 'WebGL', '射击', 'FPS'],
    featured: true
  },
  {
    id: 'v8-engine',
    file: 'demos/V8 发动机 3D 分解组合演示.html',
    title: 'V8 发动机 3D 分解组合演示',
    desc: '基于 Three.js 的 V8 引擎交互式拆解：分解/组合动画、运转动画、缸内冲程着色与点火顺序可视化。',
    category: '3D / WebGL',
    accent: ['#c0392b', '#ec6a58'],
    tags: ['Three.js', 'WebGL', '引擎', '可视化'],
    featured: true
  },
  {
    id: 'neon-grid-racer',
    file: 'demos/Neon Grid · 城市赛车.html',
    title: 'Neon Grid · 城市赛车',
    desc: '霓虹都市 3D 赛车：程序化生成的城市街区与 Bloom 辉光，油门/刹车、手刹漂移与氮气加速；可切换黄昏、白天、夜晚以及雨天湿滑路面，支持 4 车 AI 竞速与检查点计时两种模式。',
    category: '3D 游戏',
    accent: ['#3ee6ff', '#ff4fd8'],
    tags: ['Three.js', 'WebGL', '赛车', '竞速'],
    featured: true
  }
];
